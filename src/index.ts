import { getDbClient } from './database/client.js'
import { relayPool } from './nostr/pool.js'
import { Event } from './@types/event'
import { insert } from './database/insert'
import { prop } from 'ramda'
import { sleep } from './utils/sleep'

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
// pool.addRelay('wss://nostr-relay.untethr.me', { read: true, write: false })

let eventsToProcess: Event[] = []

async function onEvent(event, relay) {
  const normalizedEvent: Event = {
    id: event.id,
    pubkey: event.pubkey,
    created_at: event.created_at,
    kind: event.kind,
    tags: event.tags,
    content: event.content,
    sig: event.sig,
  }
  eventsToProcess.push(normalizedEvent)
}

// @ts-ignore
const sub = pool.sub({
  cb: onEvent,
  filter: {
    kinds: [40, 41, 42, 43, 44],
    since: 1662370913,
  },
})

setTimeout(() => {
  sub.unsub()
  console.log('Unsubscribed')
}, 5000)

const forLoop = async () => {
  for (let i = 0; i < 15000; i++) {
    await sleep(25)
    if (eventsToProcess.length === 0) return
    const event = eventsToProcess.pop()
    if (!event) return
    const rowCount = await insert(event).then(prop('rowCount') as () => number)
    console.log(
      `${i} - Saved ${rowCount} rows - ${eventsToProcess.length} events left - ${event.id}`
    )
  }
}

setTimeout(() => {
  forLoop()
}, 2000)
