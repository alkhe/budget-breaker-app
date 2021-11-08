import React from 'react'
import { Project } from '../types'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

export type ProjectItemProps = {
  project: Project
  selectProject: (project: Project) => void
}

export type ProjectsViewProps = {
  projects: Project[]
  selectProject: (project: Project) => void
}

export function ProjectItem({ project, selectProject }: ProjectItemProps) {
  return (
    <Card variant='outlined' sx={{ p: '1rem', mb: '.5rem', cursor: 'pointer' }} onClick={ () => selectProject(project) }>
      <Typography variant='h5'>
        {project.description}
      </Typography>
      <Typography variant='body1'>
        Token: {project.token}
        <br />
        Address: {project.address}
        <br />
        Target: {project.target}
        <br />
        Target Share: {project.target_share}
        <br />
        Members: {project.members.length}
      </Typography>
    </Card>
  )
}

export default function ProjectsView({ projects, selectProject }: ProjectsViewProps) {
  if (projects.length === 0) {
    return (
      <Typography variant='body1'>
        You have no projects.
      </Typography>
    )
  } else {
    return (
      <div>
        {projects.map(p => (
          <ProjectItem key={p.id} project={p} selectProject={ selectProject } />
        ))}
      </div>
    )
  }
}

