import { providers, Wallet } from 'ethers'
import { FastifyPluginCallback } from 'fastify'
import { DeployParams, ProjectsByMemberParams, MembersByProjectParams } from '../types'
import { insert_project, insert_project_member_relations, get_projects_by_member, get_signatures_by_project, get_project_by_id, sign_project, set_project_executed, set_project_completed } from './db'
import { IMain, IDatabase } from 'pg-promise'
import { budget_breaker_factory } from '../common/ethers'
import { ms_to_iso, all, validate_address, validate_addresses, validate_deploy_params } from '../common/util'
import Bree from 'bree'
import path from 'path'

const complete_worker_path = path.join(__dirname, '../jobs/complete.js')

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

      const v_insert = validate_deploy_params(params)
      const v_members = validate_addresses(params.members)

      if (v_insert === null || v_members === null) {
        res.code(400).send('bad request')
        return
      }

      const project_id = await db.tx(async t => {
        const dbo = { db: t, pgp }

        const project_id = await insert_project(dbo, v_insert)

        await insert_project_member_relations(dbo, project_id, v_members)

        return project_id
      })

      req.log.info(`recorded project entry (id = ${ project_id })`)

      res.send('Success')
    })

    server.get('/projects-by-member', async (req, res) => {
      const params = req.query as ProjectsByMemberParams

      const member = validate_address(params.member)

      if (member === null) {
        res.status(400).send('invalid member')
        return
      }

      const rows = await get_projects_by_member(dbo, member)

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

