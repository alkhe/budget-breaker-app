import { BigNumber } from 'ethers'
import { toChecksumAddress } from 'ethereum-checksum-address'
import { Project } from '../types'
import { format } from 'date-fns'
import { DeployParams, ProjectInsert } from '../types'

export function shorten_address(address: string, front: number = 3, back: number = 4) {
  const l = address.length

  if (2 + front + back >= l) return address

  return address.substring(0, 2 + front) + '...' + address.substring(l - back)
}

export function shorten_balance(balance: BigNumber) {
  const cents = balance.div(10E14).toNumber()
  return (cents / 1000).toFixed(2)
}

export function validate_address(address: string): (string | null) {
  try {
    return toChecksumAddress(address)
  } catch (e) {
    console.log(e)
    return null
  }
}

export function iso_ms(iso: string) {
  return Number(new Date(iso))
}

export function print_status(project: Project) {
  if (project.status === 'proposed') {
    return Date.now() <= iso_ms(project.execution_deadline)
      ? 'Proposed'
      : 'Abandoned'
  }

  return capitalize(project.status)
}

export function format_time(utc: string) {
  return format(new Date(utc), 'E MMM dd y h:mm aaa')
}

export function ms_to_iso(x: number) {
  return (new Date(x)).toISOString()
}

export function all(xs: boolean[]) {
  for (let i = 0; i < xs.length; i++) {
    if (!xs[i]) return false
  }
  return true
}

export function validate_addresses(addresses: string[]) {
  const v_addresses = []

  for (let i = 0; i < addresses.length; i++) {
    const v_address = validate_address(addresses[i])
    if (v_address === null) return null
    v_addresses.push(v_address)
  }

  return v_addresses
}

export function validate_deploy_params(params: DeployParams): ProjectInsert | null {
  const v_addresses_result = validate_addresses([params.address, params.token, params.residual])

  if (v_addresses_result === null) return null

  const [address, token, residual] = v_addresses_result

  return {
    address,
    token,
    description: params.description,
    residual,
    target: params.target,
    target_share: params.target_share,
    creation_time: ms_to_iso(params.creation_time),
    execution_deadline: ms_to_iso(params.execution_deadline),
    completion_deadline: ms_to_iso(params.completion_deadline)
  }
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.substring(1)
}

