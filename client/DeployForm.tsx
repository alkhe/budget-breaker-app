import React, { useState, forwardRef, FormEvent } from 'react'
import { ProjectParams } from '../types'
import { nextMonday, startOfDay } from 'date-fns'
import TextField from '@mui/material/TextField'
import DateTimePicker from '@mui/lab/DateTimePicker'
import { useIMask } from 'react-imask'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import RemoveIcon from '@mui/icons-material/Remove'

export type DeployFormProps = {
  onSubmit: (params: ProjectParams) => void
}

const DEFAULT_TOKEN = process.env.DEFAULT_ERC20_ADDRESS as string // XTT
const DEFAULT_RESIDUAL = '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65'

export default function DeployForm({ onSubmit }: DeployFormProps) {
  const next_mon = nextMonday(startOfDay(new Date))
  const next_next_mon = nextMonday(next_mon)

  const [token, set_token] = useState(DEFAULT_TOKEN)
  const [description, set_description] = useState('')
  const [residual, set_residual] = useState(DEFAULT_RESIDUAL)
  const [members, set_members] = useState<string[]>(['0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', '0x90f79bf6eb2c4f870365e785982e1f101e93b906'])
  const [target, set_target] = useState<string>('4000000000000000000')
  const [target_share, set_target_share] = useState<string>('2000000000000000000')
  const [execution_deadline, set_execution_deadline] = useState<Date | null>(
    next_mon
  )
  const [completion_deadline, set_completion_deadline] = useState<Date | null>(
    next_next_mon
  )

  const { ref: targetRef } = useIMask({ mask: Number, radix: '.', thousandsSeparator: ',' }, { onAccept: set_target })
  const { ref: targetShareRef } = useIMask({ mask: Number, radix: '.', thousandsSeparator: ',' }, { onAccept: set_target_share })

  const on_submit = (e: FormEvent) => {
    // TODO show errors
    if (target == null || target_share == null || execution_deadline == null || completion_deadline == null) return

    onSubmit({
      token,
      description,
      residual,
      members,
      // target: Number(target.replaceAll(',', '')),
      // target_share: Number(target_share.replaceAll(',', '')),
      target: target.replaceAll(',', ''),
      target_share: target_share.replaceAll(',', ''),
      execution_deadline: Number(execution_deadline),
      completion_deadline: Number(completion_deadline)
    })

    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <form className='deploy-form' onSubmit={on_submit} style={{ width: '100%' }}>
      <Box sx={{
        '& > *': {
          mb: '1rem',
          '&:last-child': {
            mb: 0
          }
        },
        '.Row': {
          display: 'flex',
          '& > *': {
            flex: 1,
            mr: '.5rem',
            '&:last-child': {
              mr: 0
            }
          }
        }
      }}>
        <div className='Row'>
          <TextField
            value={description}
            onChange={e => set_description(e.target.value) }
            label='Description' />
        </div>
        <div className='Row'>
          <TextField
            value={token}
            onChange={e => set_token(e.target.value) }
            label='Token' />
          <TextField
            value={residual}
            onChange={e => set_residual(e.target.value) }
            label='Residual Claimant' />
        </div>
        { members.map((m, i) => (
          <div className='Row'>
            <TextField
              value={m}
              onChange={e => set_members(members.map((n, j) => i === j ? e.target.value : n)) }
              label={'Member ' + (i + 1)}
              InputProps={{ endAdornment: <InputAdornment position='end' onClick={() => {set_members(members.filter((_, j) => i !== j))}}><RemoveIcon /></InputAdornment> }}
            />
          </div>
        )) }
        <Button onClick={() => set_members(members.concat(['']))} variant='contained'>Add Member</Button>
        <div className='Row'>
          <TextField
            value={target}
            label='Target'
            inputProps={{ ref: targetRef, inputMode: 'numeric' }}
          />
          <TextField
            value={target_share}
            label='Target Share'
            inputProps={{ ref: targetShareRef, inputMode: 'numeric' }}
          />
        </div>
        <LocalizationProvider dateAdapter={ AdapterDateFns }>
          <div className='Row'>
            <DateTimePicker
              value={execution_deadline}
              onChange={set_execution_deadline}
              label='Execute by'
              minDateTime={new Date}
              renderInput={ props => <TextField {...props} /> }
              openTo='day' />
            <DateTimePicker
              value={completion_deadline}
              onChange={set_completion_deadline}
              label='Complete by'
              minDateTime={execution_deadline || undefined} // it doesn't take null
              renderInput={ props => <TextField {...props} /> }
              openTo='day' />
          </div>
        </LocalizationProvider>
        <Button type='submit' variant='contained'>Deploy</Button>
      </Box>
    </form>
  )
}

