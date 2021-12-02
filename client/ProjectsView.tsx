import React from 'react'
import { Project } from '../types'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { shorten_address, convert_status } from './util'

export type ProjectItemProps = {
  project: Project
  selectProject: (project: Project) => void
}

export type ProjectsViewProps = {
  projects: Project[]
  selectProject: (project: Project) => void
  beginCreateProject: () => void
}

export function ProjectItem({ project, selectProject }: ProjectItemProps) {
  return (
    <div className='project-item interactive' onClick={ () => selectProject(project) }>
      <span className='title'>
        {project.description}
      </span>
      Status: {convert_status(project.status)}
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

export default function ProjectsView({ projects, selectProject, beginCreateProject }: ProjectsViewProps) {
  return (
    <div className='projects-container'>
      {projects.map(p => (
        <ProjectItem key={p.id} project={p} selectProject={ selectProject } />
      ))}
      <div className='create-project mgray interactive' onClick={ beginCreateProject }>
        + Create a Project
      </div>
    </div>
  )
}

