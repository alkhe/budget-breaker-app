import React from 'react'
import { Project, ProjectFilter } from '../types'
import { shorten_address, print_status, iso_ms } from '../common/util'

function filter_projects(pf: ProjectFilter, projects: Project[]): Project[] {
  if (pf === null) return projects

  if (pf === 'executed' || pf === 'completed') return projects.filter(p => p.status === pf)

  const now = Date.now()

  return projects.filter(
    pf === 'proposed'
      ? p => p.status === 'proposed' && now <= iso_ms(p.execution_deadline)
      : p => p.status === 'proposed' && now > iso_ms(p.execution_deadline)
  )
}

export type ProjectItemProps = {
  project: Project
  selectProject: (project: Project) => void
}

export type ProjectsViewProps = {
  projects: Project[]
  filter: ProjectFilter
  selectProject: (project: Project) => void
  beginCreateProject: () => void
}

export function ProjectItem({ project, selectProject }: ProjectItemProps) {
  return (
    <div className='project-item interactive' onClick={ () => selectProject(project) }>
      <span className='title'>
        {project.description}
      </span>
      Status: {print_status(project)}
      <br />
      Members: {project.members.length}
      <br />
      Token: {shorten_address(project.token)}
      <br />
      Target: {project.target}
      <br />
      Payout: {project.target_share}
    </div>
  )
}

export default function ProjectsView({ projects, filter, selectProject, beginCreateProject }: ProjectsViewProps) {
  const filtered_projects = filter_projects(filter, projects)

  console.log(filter)

  return (
    <div className='projects-container'>
      {filtered_projects.map(p => (
        <ProjectItem key={p.id} project={p} selectProject={ selectProject } />
      ))}
      <div className='create-project mgray interactive' onClick={ beginCreateProject }>
        + Create a Project
      </div>
    </div>
  )
}

