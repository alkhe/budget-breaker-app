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

export type ProjectData = ProjectParams & {
  address: string
  creation_time: number
}

export type ProjectInsert = Omit<ProjectData, 'members' | 'creation_time' | 'execution_deadline' | 'completion_deadline'> & {
  creation_time: string
  execution_deadline: string
  completion_deadline: string
}

export type Project = ProjectData & {
  id: number
  signatures: boolean[]
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

