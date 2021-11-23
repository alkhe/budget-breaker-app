import { PG_HOST, PG_PORT, PG_NAME, PG_USER, PG_PASS, wallet } from '../server/config'
import { workerData } from 'worker_threads'
import { budget_breaker_factory } from '../common/ethers'
// import pgp_factory from 'pg-promise'

/*
const pgp = pgp_factory()

const db = pgp({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_NAME,
  user: PG_USER,
  password: PG_PASS
})
*/

const { id, address } = workerData
const budget_breaker = budget_breaker_factory.connect(wallet).attach(address)

async function main() {
  console.log(`completing contract ${ id } at ${ address }`)

  try {
    await budget_breaker.complete({ gasLimit: 1000000 })
    console.log('completed')
  } catch {
    console.log('failed to complete')
  }
}

main()

