import React, { useEffect, useState } from 'react'
import { useEtherBalance, useEthers, useSendTransaction } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import axios from 'axios'
import useAxios from 'axios-hooks'
import { Project, ProjectParams, DeployParams } from '../types'
import DeployForm from './DeployForm'
import ProjectView from './ProjectView'
import ProjectsView from './ProjectsView'
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { budget_breaker_factory } from '../common/ethers'

import './index.css'

const CONTROLLER_ADDRESS = process.env.CONTROLLER_ADDRESS as string

export default function App() {
  const { activateBrowserWallet, account, library } = useEthers()
  const ether_balance = useEtherBalance(account)
  const [selected_project, set_selected_project] = useState<Project | null>(null)
  const { sendTransaction, state } = useSendTransaction({ transactionName: 'Deploy Budget Breaker' })

  const [{ data: projects }, refetch_projects] = useAxios<Project[]>(
    {
      url: 'http://localhost:3000/projects-by-member',
      params: {
        member: account
      }
    },
    { manual: true }
  )

  useEffect(() => {
    if (account != null) {
      refetch_projects()
    }
  }, [account])

  useEffect(() => {
    if (projects == null || selected_project == null) {
      set_selected_project(null)
    } else {
      const match = projects.filter(p => p.id === selected_project.id)
      set_selected_project(match.length === 0 ? null : match[0])
    }
  }, [projects])

  if (account == null) {
    return (
      <div>
        <Button onClick={() => activateBrowserWallet()} variant='contained'>Connect</Button>
      </div>
    )
  }

  async function deploy_budget_breaker(params: ProjectParams) {
    const signer = library!.getSigner()
    const deployed = await budget_breaker_factory.connect(signer).deploy(
      params.token, CONTROLLER_ADDRESS, params.residual,
      params.members,
      params.target, params.target_share,
      params.execution_deadline, params.completion_deadline
    )

    const address = deployed.address
    const creation_time = Number(await deployed.creationTime())

    const server_params: DeployParams = { ...params, address, creation_time }

    const res = await axios.post('http://localhost:3000/deploy', server_params)

    refetch_projects()

    console.log(res.data)
  }

  async function sign_project(project: Project, member: string) {
    await axios.post('http://localhost:3000/sign', { project_id: project.id, member })

    refetch_projects()
  }

  return (
    <>
      <Box sx={{ background: '#334', color: '#ccd', width: 'calc(100% - 2rem)', p: '1rem', mb: '2rem', textAlign: 'center' }}>
        <Typography variant='caption'>
          Account: {account}
          {ether_balance ? <><br />Balance: {formatEther(ether_balance)} ETH</> : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '640px', mb: '2rem' }}>
        <DeployForm onSubmit={deploy_budget_breaker} />
        <br />
        <Typography variant='h4' sx={{ cursor: 'pointer' }} onClick={() => set_selected_project(null)}>
          Projects
        </Typography>
        <br />
        {
          selected_project == null
            ? <ProjectsView projects={projects || []} selectProject={set_selected_project} />
            : <ProjectView project={selected_project} signProject={sign_project} />
        }
      </Box>
    </>
  )
}
