import { BigNumber } from 'ethers'
import { toChecksumAddress } from 'ethereum-checksum-address'

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
