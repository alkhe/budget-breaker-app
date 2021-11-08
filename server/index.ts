import fastify from 'fastify'
import fastify_static from 'fastify-static'
import fastify_cors from 'fastify-cors'
import path from 'path'
import { Wallet, ContractFactory, providers } from 'ethers'
import BudgetBreakerArtifact from '../contracts/BudgetBreaker.json'
import { BudgetBreaker__factory } from '../types/factories/BudgetBreaker__factory'
import pgp_factory from 'pg-promise'
import api from './api'

const { env } = process

const dev = env.MODE === 'development'
const SERVER_PORT = Number(env.SERVER_PORT as string)
const NETWORK = env.NETWORK as string
const API_KEY = env.API_KEY as (string | undefined)
const WALLET = env.WALLET as string
const PG_HOST = env.PG_HOST as string
const PG_PORT = Number(env.PG_PORT as string)
const PG_NAME = env.PG_NAME as string
const PG_USER = env.PG_USER as string
const PG_PASS = env.PG_PASS as (string | undefined)

const pgp = pgp_factory()

const db = pgp({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_NAME,
  user: PG_USER,
  password: PG_PASS
})

const server = fastify({ logger: { prettyPrint: dev } })

server.register(fastify_cors)

if (!dev) {
  server.register(fastify_static, { root: path.join(__dirname, '../static') })
}

const provider = NETWORK === 'local'
  ? new providers.WebSocketProvider('ws://::1:8545/')
  : new providers.InfuraProvider(NETWORK, API_KEY)
const wallet = new Wallet(WALLET, provider)
const contract_factory = ContractFactory.fromSolidity(BudgetBreakerArtifact) as unknown as BudgetBreaker__factory

server.register(api(
  pgp, db,
  provider, wallet, contract_factory
))

async function start() {
  try {
    await server.listen(SERVER_PORT)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

