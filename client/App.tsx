import React, { useEffect, useState, useRef } from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import axios from 'axios'
import useAxios from 'axios-hooks'
import { Project, ProjectParams, DeployParams, ProjectStatus, ProjectFilter } from '../types'
import DeployForm, { DeployForm2 } from './DeployForm'
import ProjectView from './ProjectView'
import ProjectsView from './ProjectsView'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import PersistentModal, { PersistentModalState } from './PersistentModal'
import { budget_breaker_factory } from '../common/ethers'
import { shorten_address, shorten_balance, capitalize } from '../common/util'

import './index.css'

const project_filters: ProjectFilter[] = [null, 'proposed', 'executed', 'completed', 'abandoned']

function print_project_filter(pf: ProjectFilter): string {
  if (pf === null) return 'All'
  return capitalize(pf)
}

const CONTROLLER_ADDRESS = process.env.CONTROLLER_ADDRESS as string

type FilterGroupProps = {
  filter: ProjectFilter
  setFilter: (pf: ProjectFilter) => void
  dropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
}

type FilterDropdownProps = {
  setFilter: (pf: ProjectFilter) => void
}

function FilterGroup({ filter, setFilter, dropdownOpen, setDropdownOpen }: FilterGroupProps) {
  function set_filter_and_close(pf: ProjectFilter) {
    setFilter(pf)
    setDropdownOpen(false)
  }

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [ref])

  return (
    <div className='relative' ref={ ref }>
      <div className='filter interactive nav-control' onClick={ () => setDropdownOpen(!dropdownOpen) }>
        Filter: <span className='bold'>{ print_project_filter(filter) }</span>
      </div>
      <div className={ `empty-bottom transition ${ dropdownOpen ? '' : 'hidden opacity0' }` }><FilterDropdown setFilter={ set_filter_and_close } /></div>
    </div>
  )
}

function FilterDropdown({ setFilter }: FilterDropdownProps) {
  return (
    <div className='filter-dropdown'>
      {
        project_filters.map(pf =>
          <div className='item interactive transition' onClick={ () => setFilter(pf) }>
            { print_project_filter(pf) }
          </div>
        )
      }
    </div>
  )
}

export default function App() {
  const { activateBrowserWallet, account, library } = useEthers()
  const ether_balance = useEtherBalance(account)
  const [selected_project, set_selected_project] = useState<Project | null>(null)
  const [filter_dropdown_open, set_filter_dropdown_open] = useState<boolean>(false)
  const [project_filter, set_project_filter] = useState<ProjectFilter>(null)

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
      <div className={`interactive nav-control bold row align-center ${ selected_project ? '' : 'hidden' }`} onClick={() => set_selected_project(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Projects
      </div>
      <div className='row align-baseline justify-space-between'>
        <div className='heading'>
          {
            selected_project
              ? (selected_project.description || 'Untitled Project')
              : 'Projects'
          }
        </div>
        { selected_project ? null : <FilterGroup filter={ project_filter } setFilter={ set_project_filter } dropdownOpen={ filter_dropdown_open } setDropdownOpen={ set_filter_dropdown_open } /> }
      </div>
      {
        selected_project
          ? <ProjectView project={selected_project} signProject={sign_project} />
          : <ProjectsView projects={projects || []} filter={ project_filter } selectProject={set_selected_project} beginCreateProject={begin_create_project} />
      }
    </>
  )
}

