import fastify from 'fastify'
import fastify_static from 'fastify-static'
import fastify_cors from 'fastify-cors'
import path from 'path'
import pgp_factory from 'pg-promise'
import api from './api'
import { SERVER_PORT, PG_HOST, PG_PORT, PG_NAME, PG_USER, PG_PASS, dev, provider, wallet } from './config'
import Bree from 'bree'
import { add } from 'date-fns'

const pgp = pgp_factory()

// node-postgres timestamp without time zone parsing issue
// https://github.com/brianc/node-postgres/issues/429#issuecomment-24870258
pgp.pg.types.setTypeParser(1114, x => x + ' GMT')

const db = pgp({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_NAME,
  user: PG_USER,
  password: PG_PASS
})

const bree = new Bree

bree.start()

const server = fastify({ logger: { prettyPrint: dev } })

server.register(fastify_cors)

if (!dev) {
  server.register(fastify_static, { root: path.join(__dirname, '../static') })
}

server.register(api(
  pgp, db,
  provider, wallet,
  bree
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

