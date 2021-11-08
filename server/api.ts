import { providers, Wallet } from 'ethers'
import { FastifyPlugin } from 'fastify'
import { BudgetBreaker__factory } from '../types/factories/BudgetBreaker__factory'
import { Project, ProjectParams, ProjectInsert } from '../types'
import { IMain, IDatabase, IBaseProtocol } from 'pg-promise'
import schedule from 'node-schedule'

function ms_to_utc(x: number) {
  return (new Date(x)).toUTCString()
}

function all(xs: boolean[]) {
  for (let i = 0; i < xs.length; i++) {
    if (!xs[i]) return false
  }
  return true
}

type DBO = {
  pgp: IMain
  db: IBaseProtocol<{}>
}

type ProjectsByMemberParams = {
  member: string
}

type MembersByProjectParams = {
  address: string
}

async function insert_project({ db, pgp }: DBO, params: ProjectInsert): Promise<number> {
  const q = pgp.helpers.insert(params, null, 'projects') + ' returning id'
  return (await db.one(q)).id
}

async function insert_project_member_relations({ db, pgp }: DBO, project_id: number, members: string[]) {
  const relations = members.map(member => ({ project_id, member }))
  const q = pgp.helpers.insert(relations, ['project_id', 'member'], 'project_member_relations')
  return db.none(q)
}

async function get_projects_by_member({ db }: DBO, member: string): Promise<string[]> {
  return db.any('select P.*, array(select PMR.member from project_member_relations as PMR where P.id = PMR.project_id) as members, array(select PMR.signed from project_member_relations as PMR where P.id = PMR.project_id) as signatures from projects as P inner join project_member_relations as PMR on P.id = PMR.project_id where PMR.member = $1', [member])
}

async function get_signatures_by_project({ db }: DBO, project_id: number): Promise<boolean[]> {
  return db.map('select signed from project_member_relations where project_id = $1', [project_id], row => row.signed)
}

async function get_project_by_id({ db }: DBO, project_id: number): Promise<Project> {
  return await db.one('select address from projects where id = $1', [project_id])
}

export default function api(
  pgp: IMain, db: IDatabase<{}>,
  provider: providers.Provider, wallet: Wallet, contract_factory: BudgetBreaker__factory
): FastifyPlugin {

  const dbo = { db, pgp }

  async function schedule_complete(project_id: number, project_address: string) {
      console.log(`completing project ${project_id}`)
      const budget_breaker = contract_factory.connect(wallet).attach(project_address)
      await budget_breaker.complete({ gasLimit: 1000000 })
      console.log(`completing project ${project_id}`)
  }

  return (server, opts, done) => {
    server.post('/deploy', async (req, res) => {
      // TODO ensure valid params
      const params = req.body as ProjectParams

      const deployed = await contract_factory.connect(wallet).deploy(
        params.token, wallet.address, params.residual,
        params.members,
        params.target, params.target_share,
        params.execution_deadline, params.completion_deadline
      )

      const address = deployed.address
      const creation_time = Number(await deployed.creationTime())

      req.log.info(`deployed BudgetBreaker at ${ address }`)

      const project_id = await db.tx(async t => {
        const dbo = { db: t, pgp }

        const project_id = await insert_project(dbo, {
          address,
          token: params.token,
          description: params.description,
          residual: params.residual,
          target: params.target,
          target_share: params.target_share,
          creation_time: ms_to_utc(creation_time),
          execution_deadline: ms_to_utc(params.execution_deadline),
          completion_deadline: ms_to_utc(params.completion_deadline)
        })

        await insert_project_member_relations(dbo, project_id, params.members)

        return project_id
      })

      req.log.info(`recorded project entry (id = ${ project_id })`)

      res.send(address)
    })

    server.get('/projects-by-member', async (req, res) => {
      const params = req.query as ProjectsByMemberParams

      const rows = await get_projects_by_member(dbo, params.member.toLowerCase())

      res.send(rows)
    })

    server.get('/members-by-project', async (req, res) => {
      const params = req.query as MembersByProjectParams

      const rows: string[] = await db.map('select member from project_member_relations where address = $1', [params.address], row => row.member)

      res.send(rows)
    })

    server.post('/sign', async (req, res) => {
      const params = req.body as { member: string, project_id: number }

      const relation_id: number = await db.one('update project_member_relations set signed = true where member = $1 and project_id = $2 returning id', [params.member, params.project_id])

      req.log.info(`member ${ params.member } signed project ${ params.project_id }`)

      res.send(relation_id)

      const signatures = await get_signatures_by_project(dbo, params.project_id)

      const project = await get_project_by_id(dbo, params.project_id)

      if (all(signatures)) {
        req.log.info(`executing project ${params.project_id}`)
        const project = await get_project_by_id(dbo, params.project_id)
        const budget_breaker = contract_factory.connect(wallet).attach(project.address)
        await budget_breaker.execute({ gasLimit: 1000000 })
        req.log.info(`executed project ${params.project_id}`)

        schedule.scheduleJob(new Date(project.completion_deadline), schedule_complete.bind(null, project.id, project.address))
      }
    })

    done()
  }
}

