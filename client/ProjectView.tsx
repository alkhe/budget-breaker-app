import React from 'react'
import { useEthers, useContractFunction } from '@usedapp/core'
import { Project } from '../types'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import BudgetBreakerArtifact from '../contracts/BudgetBreaker.json'
import { ContractFactory, Contract } from '@usedapp/core/node_modules/@ethersproject/contracts'

export type ProjectViewProps = {
  project: Project
  signProject: (project: Project, member: string) => void
}

export default function ProjectView({ project, signProject }: ProjectViewProps) {
  const { account } = useEthers()

  const BudgetBreaker = ContractFactory.fromSolidity(BudgetBreakerArtifact)
  const contract = BudgetBreaker.attach(project.address)

  const { state, send } = useContractFunction(contract, 'sign')

  async function sign_project() {
    await send()
    signProject(project, account!.toLowerCase())
  }

  return (
    <Card variant='outlined' sx={{ p: '1rem', mb: '.5rem' }}>
      <Typography variant='h5'>
        {project.description}
      </Typography>
      <Typography variant='body1'>
        Token: {project.token}
        <br />
        Address: {project.address}
        <br />
        Residual: {project.residual}
        <br />
        Target: {project.target}
        <br />
        Target Share: {project.target_share}
        <br />
        {
          project.members.map((m, i) =>
            <div>
              Member { m }: {
                project.signatures[i]
                  ? <Typography variant='button'>Signed</Typography>
                : m === account!.toLowerCase()
                  ? <Button variant='text' onClick={sign_project}>Sign</Button>
                  : <Typography variant='button'>Not signed</Typography>
              }
            </div>
          )
        }
        <br />
        Creation Time: {project.creation_time}
        <br />
        Execution Deadline: {project.execution_deadline}
        <br />
        Completion Deadline: {project.completion_deadline}
      </Typography>
    </Card>
  )
}

