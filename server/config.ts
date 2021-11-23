import { Wallet, providers } from 'ethers'

const { env } = process

export const SERVER_PORT = Number(env.SERVER_PORT as string)

export const PG_HOST = env.PG_HOST as string
export const PG_PORT = Number(env.PG_PORT as string)
export const PG_NAME = env.PG_NAME as string
export const PG_USER = env.PG_USER as string
export const PG_PASS = env.PG_PASS as (string | undefined)

export const dev = env.MODE === 'development'

const NETWORK = env.NETWORK as string
const API_KEY = env.API_KEY as (string | undefined)
const CONTROLLER_PK = env.CONTROLLER_PK as string

export const provider = NETWORK === 'local'
  ? new providers.WebSocketProvider('ws://[::1]:8545/')
  : new providers.InfuraProvider(NETWORK, API_KEY)

export const wallet = new Wallet(CONTROLLER_PK, provider)

