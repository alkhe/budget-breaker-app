import React, { useEffect, useState } from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { ContractFactory } from 'ethers'
import { formatEther } from '@ethersproject/units'
import axios from 'axios'
import useAxios from 'axios-hooks'
import { Project, ProjectParams } from '../types'
import DeployForm from './DeployForm'
import ProjectView from './ProjectView'
import ProjectsView from './ProjectsView'
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import './index.css'

export default function App() {
  const { activateBrowserWallet, account } = useEthers()
  const ether_balance = useEtherBalance(account)
  const [selected_project, set_selected_project] = useState<Project | null>(null)

  const [{ data: projects }, refetch_projects] = useAxios(
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

  if (account == null) {
    return (
      <div>
        <Button onClick={() => activateBrowserWallet()} variant='contained'>Connect</Button>
      </div>
    )
  }

  async function deploy_budget_breaker(params: ProjectParams) {
    const res = await axios.post('http://localhost:3000/deploy', params)

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
