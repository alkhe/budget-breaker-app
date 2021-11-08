import React from 'react'
import ReactDOM from 'react-dom'
import { Config, ChainId, DAppProvider, MULTICALL_ADDRESSES } from '@usedapp/core'
import App from './App'

const config: Config = {
  // readOnlyChainId: ChainId.Goerli,
  readOnlyChainId: ChainId.Localhost,
  readOnlyUrls: {
    [ChainId.Goerli]: 'https://goerli.infura.io/v3/4c6d8cf6d00e4aa39bd7827486e9b02d',
    [ChainId.Localhost]: 'http://[::1]:8545'
  },
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Localhost]: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'
  }
}

const Root = () => (
  <DAppProvider config={ config }>
    <App />
  </DAppProvider>
)

const root = document.getElementById('root')

ReactDOM.render(<Root />, root)

