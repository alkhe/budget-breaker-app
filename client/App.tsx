import React, { useEffect, useState } from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import axios from 'axios'
import useAxios from 'axios-hooks'
import { Project, ProjectParams, DeployParams } from '../types'
import DeployForm, { DeployForm2 } from './DeployForm'
import ProjectView from './ProjectView'
import ProjectsView from './ProjectsView'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import PersistentModal, { PersistentModalState } from './PersistentModal'
import { budget_breaker_factory } from '../common/ethers'
import { shorten_address, shorten_balance } from '../common/util'

import './index.css'

const CONTROLLER_ADDRESS = process.env.CONTROLLER_ADDRESS as string

export default function App() {
  const { activateBrowserWallet, account, library } = useEthers()
  const ether_balance = useEtherBalance(account)
  const [selected_project, set_selected_project] = useState<Project | null>(null)

  const [modal_state, set_modal_state] = useState<PersistentModalState>({
    open: false,
    content: ''
  })

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
  }

  async function sign_project(project: Project, member: string) {
    await axios.post('http://localhost:3000/sign', { project_id: project.id, member })

    refetch_projects()
  }

  const submit_deploy = async (params: ProjectParams) => {
    await deploy_budget_breaker(params)
    set_modal_state({ ...modal_state, open: false })
  }

  // DeployForm2 in development
  const begin_create_project = () => set_modal_state({ open: true, content: <DeployForm onSubmit={ submit_deploy } /> })

  return (
    <>
      <PersistentModal state={ modal_state } setModalState={ set_modal_state } />
      <Box sx={{ textAlign: 'right', mb: '2rem' }} className='mono mgray'>
        {account ? shorten_address(account) : ''}
        <br />
        {ether_balance ? shorten_balance(ether_balance) : '--'} ETH
      </Box>
      <div className={`nav-up bold interactive row align-center ${ selected_project ? '' : 'hidden' }`} onClick={() => set_selected_project(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Projects
      </div>
      <div className='heading'>
        {
          selected_project
            ? (selected_project.description || 'Untitled Project')
            : 'Projects'
        }
      </div>
      {
        selected_project
          ? <ProjectView project={selected_project} signProject={sign_project} />
          : <ProjectsView projects={projects || []} selectProject={set_selected_project} beginCreateProject={begin_create_project} />
      }
    </>
  )
}

