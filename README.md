# ndxstr - Nostr indexing node

Bootstrapping Nostr's layer2 with an indexing node.

**ndxstr** nodes are servers that pull events from multiple known relays, storing them forever-ish and making available to clients via API.

## Why

Modern applications may want:

- More advanced querying than currently supported by Nostr relays
- Receiving messages in a batch via API, not one at a time over a websocket
- Fewer expensive cryptographic operations done client-side (e.g. trusting an indexer to validate events)
- To retrieve large amounts of messages quickly+reliably via one API without caring about uptime/featuresets of multiple relays

## Stack

- NodeJS
- TypeScript
- Postgres
- REST API

## Risks

- Centralization - Need to avoid Infura-ization

## Related

- [nostr-ts-relay](https://github.com/Cameri/nostr-ts-relay) - We reuse a lot of this code
- [nostr](https://github.com/nostr-protocol/nostr) - Main nostr repo
