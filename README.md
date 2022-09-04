# ndxstr - Nostr indexing node

Bootstrapping Nostr layer two with an indexing node.

## Why

Modern applications may want:

- More advanced querying than currently supported by Nostr relays
- Receiving messages in a batch via API, not one at a time over a websocket
- Fewer expensive cryptographic operations done client-side (e.g. trusting an indexer to validate events)
- To retrieve large amounts of messages quickly+reliably via one API without caring about uptime/featuresets of multiple relays

## Solution

- A server that pulls events from all known relays, storing them forever-ish and making available to clients via API

## Stack

- NodeJS
- TypeScript
- Postgres
- REST API

## Risks

- Centralization - Need to avoid Infura-ization
