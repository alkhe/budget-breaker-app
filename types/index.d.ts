export type ProjectParams = {
  token: string
  description: string
  residual: string
  members: string[]
  target: string
  target_share: string
  execution_deadline: number
  completion_deadline: number
}

export type ProjectInsert = Omit<ProjectParams, 'members' | 'creation_time' | 'execution_deadline' | 'completion_deadline'> & {
  address: string
  creation_time: string
  execution_deadline: string
  completion_deadline: string
}

export type ProjectStatus = 'proposed' | 'executed' | 'completed'

export type ProjectData = ProjectInsert & {
  id: number
  execution_time: string
  status: ProjectStatus
}

export type Project = ProjectData & {
  members: string[]
  signatures: boolean[]
}

export type ProjectMemberRelation = {
  id: number
  project_id: number
  member: string
  signed: boolean
}

export type DeployParams = ProjectParams & {
  address: string
  creation_time: number
}

export type ProjectsByMemberParams = {
  member: string
}

export type MembersByProjectParams = {
  address: string
}

export type DBO = {
  pgp: IMain
  db: IBaseProtocol<{}>
}

export type ProjectFilter = null | ProjectStatus | 'abandoned'

