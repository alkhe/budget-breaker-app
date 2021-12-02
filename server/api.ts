import { providers, Wallet } from 'ethers'
import { FastifyPluginCallback } from 'fastify'
import { DeployParams, ProjectsByMemberParams, MembersByProjectParams } from '../types'
import { insert_project, insert_project_member_relations, get_projects_by_member, get_signatures_by_project, get_project_by_id, sign_project, set_project_executed, set_project_completed } from './db'
import { IMain, IDatabase } from 'pg-promise'
import { budget_breaker_factory } from '../common/ethers'
import Bree from 'bree'
import path from 'path'

const complete_worker_path = path.join(__dirname, '../jobs/complete.js')

function ms_to_iso(x: number) {
  return (new Date(x)).toISOString()
}

function all(xs: boolean[]) {
  for (let i = 0; i < xs.length; i++) {
    if (!xs[i]) return false
  }
  return true
}

export default function api(
  pgp: IMain, db: IDatabase<{}>,
  wallet: Wallet,
  bree: Bree
): FastifyPluginCallback {

  const dbo = { db, pgp }

  return (server, _, done) => {
    server.post('/deploy', async (req, res) => {
      // TODO ensure valid params
      const params = req.body as DeployParams

      const project_id = await db.tx(async t => {
        const dbo = { db: t, pgp }

        const project_id = await insert_project(dbo, {
          address: params.address,
          token: params.token,
          description: params.description,
          residual: params.residual,
          target: params.target,
          target_share: params.target_share,
          creation_time: ms_to_iso(params.creation_time),
          execution_deadline: ms_to_iso(params.execution_deadline),
          completion_deadline: ms_to_iso(params.completion_deadline)
        })

        await insert_project_member_relations(dbo, project_id, params.members)

        return project_id
      })

      req.log.info(`recorded project entry (id = ${ project_id })`)

      res.send('Success')
    })

    server.get('/projects-by-member', async (req, res) => {
      const params = req.query as ProjectsByMemberParams

      const rows = await get_projects_by_member(dbo, params.member.toLowerCase())

      res.send(rows)
    })

    server.post('/sign', async (req, res) => {
      const params = req.body as { member: string, project_id: number }

      const relation_id: number = await sign_project(dbo, params.project_id, params.member)

      req.log.info(`member ${ params.member } signed project ${ params.project_id }`)

      res.send(relation_id)

      const signatures = await get_signatures_by_project(dbo, params.project_id)

      const project = await get_project_by_id(dbo, params.project_id)

      if (all(signatures)) {
        req.log.info(`executing project ${ project.id }`)
        const budget_breaker = budget_breaker_factory.connect(wallet).attach(project.address)
        await budget_breaker.execute({ gasLimit: 1000000 })
        await set_project_executed(dbo, project.id)
        req.log.info(`executed project ${ project.id }`)

        req.log.info(`scheduling completion of project ${ project.id }`)

        const job_name = `complete-${ project.id }`

        bree.add({
          name: job_name,
          path: complete_worker_path,
          date: new Date(project.completion_deadline),
          worker: {
            workerData: {
              project_id: project.id,
              address: project.address
            }
          }
        })

        bree.start(job_name)

        req.log.info(`scheduled completion of project ${ project.id }`)
      }
    })

    done()
  }
}

