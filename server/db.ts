import { DBO, Project, ProjectInsert, ProjectMemberRelation } from '../types'

export async function insert_project({ db, pgp }: DBO, params: ProjectInsert): Promise<number> {
  const q = pgp.helpers.insert(params, null, 'projects') + ' returning id'
  return (await db.one(q)).id
}

export async function insert_project_member_relations({ db, pgp }: DBO, project_id: number, members: string[]) {
  const relations = members.map(member => ({ project_id, member }))
  const q = pgp.helpers.insert(relations, ['project_id', 'member'], 'project_member_relations')
  return db.none(q)
}

export async function get_projects_by_member({ db }: DBO, member: string): Promise<string[]> {
  return db.any('select P.*, array(select PMR.member from project_member_relations as PMR where P.id = PMR.project_id) as members, array(select PMR.signed from project_member_relations as PMR where P.id = PMR.project_id) as signatures from projects as P inner join project_member_relations as PMR on P.id = PMR.project_id where PMR.member = $1', [member])
}

export async function get_signatures_by_project({ db }: DBO, project_id: number): Promise<boolean[]> {
  return db.map('select signed from project_member_relations where project_id = $1', [project_id], (row: ProjectMemberRelation) => row.signed)
}

export async function get_project_by_id({ db }: DBO, project_id: number): Promise<Project> {
  return db.one('select * from projects where id = $1', [project_id])
}

export async function sign_project({ db }: DBO, project_id: number, member: string): Promise<number> {
  return db.one('update project_member_relations set signed = true where member = $1 and project_id = $2 returning id', [member, project_id])
}

export async function set_project_executed({ db }: DBO, project_id: number): Promise<number> {
  return db.one(`update projects set status = 'executed', execution_time = $2 where id = $1 returning id`, [project_id, (new Date).toISOString()])
}

export async function set_project_completed({ db }: DBO, project_id: number): Promise<number> {
  return db.one(`update projects set status = 'completed' where id = $1 returning id`, [project_id])
}

