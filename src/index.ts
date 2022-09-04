import { getDbClient } from './database/client.js'
import { relayPool } from './nostr/pool.js'

const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const dbClient = getDbClient()

app.get('/', (req, res) => {
  res.send('ndxstr')
})

app.get('/test', (req, res) => {
  dbClient('events')
    .select('*')
    .then((events) => {
      res.send(events)
    })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

const pool = relayPool()

pool.addRelay('wss://relay.damus.io', { read: true, write: false })

function onEvent(event, relay) {
  console.log(`got an event from ${relay} which is already validated.`, event)
}

// @ts-ignore
// pool.sub({
//   cb: onEvent,
//   filter: {
//     kinds: [40],
//     ids: [
//       'f06a690997a1b7d8283c90a7224eb8b7fe96b7c3d3d8cc7b2e7f743532c02b42',
//       'cc7ace95dcd091e8b2822b4c3f71dce88aece2adff66eaaea362caa8da8563b7',
//       '6c1ab7e5f8cf33874e5b9d85e000c0683d3133ec8294a5009d2f38854aceafb0',
//       '9cb8bf059ae86df40407cfa5871c2111b09d3fb2c85c5be67306fcf6b3bab729',
//     ],
//   },
// })
