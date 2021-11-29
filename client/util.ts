import { BigNumber } from 'ethers'

export function shorten_address(address: string) {
  return address.substring(0, 5) + '...' + address.substring(address.length - 4)
}

export function shorten_balance(balance: BigNumber) {
  const cents = balance.div(10E14).toNumber()
  return (cents / 1000).toFixed(2)
}
