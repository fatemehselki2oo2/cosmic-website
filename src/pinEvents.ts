export type CosmicEvent = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location?: string
  shortDescription: string
  image?: string
  organizations: string[]
  rsvpCount: number
}

type PinEvent = {
  id?: string | number
  name?: string
  description?: string
  location?: string
  startsOn?: string
  endsOn?: string
  imagePath?: string
  organizationName?: string
  organizationNames?: string[]
  rsvpTotal?: number
}

type PinSearchResponse = {
  value?: PinEvent[]
}

const COSMIC_ORGANIZATION_ID = '425942'
const PIN_EVENTS_PATH = '/pin-api/api/discovery/event/search'
const PIN_IMAGE_ROOT = 'https://se-images.campuslabs.com/clink/images'

function plainTextPreview(html = '', maxLength = 190) {
  const document = new DOMParser().parseFromString(html, 'text/html')
  const text = (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

function localDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function localTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function mapPinEvent(event: PinEvent): CosmicEvent | null {
  if (!event.id || !event.name || !event.startsOn || !event.endsOn) return null
  const startsAt = new Date(event.startsOn)
  const endsAt = new Date(event.endsOn)
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) return null

  const organizations = (event.organizationNames?.length ? event.organizationNames : [event.organizationName])
    .filter((name): name is string => Boolean(name?.trim()))
    .map(name => name.trim())

  return {
    id: String(event.id),
    title: event.name.trim(),
    date: localDate(startsAt),
    startTime: localTime(startsAt),
    endTime: localTime(endsAt),
    location: event.location?.trim() || undefined,
    shortDescription: plainTextPreview(event.description) || 'More details will be available on the event’s PIN page.',
    image: event.imagePath ? `${PIN_IMAGE_ROOT}/${encodeURIComponent(event.imagePath)}?preset=large-w` : undefined,
    organizations: organizations.length ? organizations : ['COSMIC'],
    rsvpCount: Number.isFinite(event.rsvpTotal) ? Number(event.rsvpTotal) : 0,
  }
}

export async function fetchCosmicEvents(signal?: AbortSignal): Promise<CosmicEvent[]> {
  const now = new Date()
  const params = new URLSearchParams({
    endsAfter: now.toISOString(),
    orderByField: 'startsOn',
    orderByDirection: 'ascending',
    status: 'Approved',
    take: '20',
  })
  params.append('organizationIds[0]', COSMIC_ORGANIZATION_ID)

  const response = await fetch(`${PIN_EVENTS_PATH}?${params}`, { headers: { Accept: 'application/json' }, signal })
  if (!response.ok) throw new Error(`PIN returned HTTP ${response.status}`)

  const payload = await response.json() as PinSearchResponse
  return (payload.value ?? [])
    .filter(event => Boolean(event.startsOn) && new Date(event.startsOn as string).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startsOn as string).getTime() - new Date(b.startsOn as string).getTime())
    .map(mapPinEvent)
    .filter((event): event is CosmicEvent => event !== null)
}
