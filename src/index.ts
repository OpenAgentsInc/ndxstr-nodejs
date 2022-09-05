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
    .where('event_created_at', '>', 1662309482)
    .orderBy('event_created_at', 'desc')
    .then((events) => {
      res.send(events)
    })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

const pool = relayPool()

pool.addRelay('wss://relay.damus.io', { read: true, write: false })

let eventsToProcess: Event[] = []

async function onEvent(event, relay) {
  // console.log(`Received event ${event.id} from ${relay}`)
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
pool.sub({
  cb: onEvent,
  filter: {
    kinds: [40, 41, 42, 43, 44],
    since: 1662368190, // TODO: make this dynamic based on last event in db
  },
})

const processLoop = async () => {
  if (eventsToProcess.length === 0) return
  const event = eventsToProcess.pop()
  if (!event) return
  const rowCount = await insert(event).then(prop('rowCount') as () => number)
  console.log(`Saved ${rowCount} rows - ${eventsToProcess.length} events left - ${event.id}`)
}

setInterval(() => {
  processLoop()
}, 100)
