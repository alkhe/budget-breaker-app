import React, { useEffect, MouseEventHandler } from 'react'
import { useEthers, useContractFunction } from '@usedapp/core'
import { Project, ProjectsByMemberParams } from '../types'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import BudgetBreakerArtifact from '../contracts/BudgetBreaker.json'
import { ContractFactory } from '@usedapp/core/node_modules/@ethersproject/contracts'
import { shorten_address, print_status, format_time } from '../common/util'

export type ProjectViewProps = {
  project: Project
  signProject: (project: Project, member: string) => void
}

type SignButtonProps = {
  onClick: MouseEventHandler
}

function SignButton({ onClick }: SignButtonProps) {
  return (
    <button className='sign membersig' onClick={ onClick }>
        Sign
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
    </button>
  )
}

function Awaiting() {
  return (
    <div className='awaiting membersig'>
      Awaiting
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
      </svg>
    </div>
  )
}

function Signed() {
  return (
    <div className='signed membersig'>
      Signed
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>
  )
}

export default function ProjectView({ project, signProject }: ProjectViewProps) {
  const { account } = useEthers()

  // TODO use exported factory from common/ethers.ts
  const BudgetBreaker = ContractFactory.fromSolidity(BudgetBreakerArtifact)
  const contract = BudgetBreaker.attach(project.address)

  const { state, send } = useContractFunction(contract, 'sign')

  async function sign_project() {
    await send()
  }

  useEffect(() => {
    if (state.status === 'Success') {
      signProject(project, account!)
    }
  }, [state])

  const converted_status = print_status(project)
  const status_content =
    converted_status === 'Abandoned' || converted_status === 'Completed'
      ? converted_status
      : `${ converted_status } (${ (new Date(project.status === 'proposed' ? project.creation_time : project.execution_time)).toLocaleString() })`

  return (
    <div>
      <div className='project row'>
        <div>
          <div className='property'>
            <span className='name'>Contract Address:</span>
            <br />
            <span className='value'>{ shorten_address(project.address) }</span>
          </div>
          <div className='property'>
            <span className='name'>Status:</span>
            <br />
            <span className='value'>{ status_content }</span>
          </div>
          <div className='property'>
            <span className='name'>Execute by:</span>
            <br />
            <span className='value'>{ format_time(project.execution_deadline) }</span>
          </div>
          <div className='property'>
            <span className='name'>Complete by:</span>
            <br />
            <span className='value'>{ format_time(project.completion_deadline) }</span>
          </div>
        </div>
        <div className='col align-center'>
          <div>
            <div className='property'>
              <span className='name'>Transaction Token:</span>
              <br />
              <span className='value'>{ shorten_address(project.token) }</span>
            </div>
            <div className='property'>
              <span className='name'>Target Revenue:</span>
              <br />
              <span className='value'>{ project.target }</span>
            </div>
            <div className='property'>
              <span className='name'>Individual Payout:</span>
              <br />
              <span className='value'>{ project.target_share }</span>
            </div>
            <div className='property'>
              <span className='name'>Residual Claimant:</span>
              <br />
              <span className='value'>{ shorten_address(project.residual) }</span>
            </div>
          </div>
        </div>
      </div>
      <div className='team col align-center'>
        <div className='heading'>
          Project Team
        </div>
        <div className='members mono col'>
          {
            project.members.map((m, i) =>
              <div className='row justify-space-between align-center'>
                <div>Member { m }{ m === account ? ' (you)' : '' }</div>
                <div>{ project.signatures[i] ? <Signed /> : m === account ? <SignButton onClick={ sign_project } /> : <Awaiting /> }</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

