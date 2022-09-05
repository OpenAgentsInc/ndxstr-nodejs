import { always, applySpec, ifElse, is, pipe, prop, propSatisfies } from 'ramda'
import { EventDelegatorMetadataKey } from '../constants/base'
import { toBuffer, toJSON } from '../utils/transform'
import { getDbClient } from './client'

const dbClient = getDbClient()

export const insert = (event: Event) => {
  const row = applySpec({
    event_id: pipe(prop('id'), toBuffer),
    event_pubkey: pipe(prop('pubkey'), toBuffer),
    event_created_at: prop('created_at'),
    event_kind: prop('kind'),
    event_tags: pipe(prop('tags'), toJSON),
    event_content: prop('content'),
    event_signature: pipe(prop('sig'), toBuffer),
    event_delegator: ifElse(
      propSatisfies(is(String), EventDelegatorMetadataKey),
      pipe(prop(EventDelegatorMetadataKey as any), toBuffer),
      always(null)
    ),
  })(event)

  return dbClient('events').insert(row).onConflict().ignore()
}
