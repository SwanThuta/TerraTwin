import type {Atlas, Comparison, Dimension, Site, Visual} from './types'

type Row = Record<string, unknown>
const row = (value: unknown): Row => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Row : {}
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : []
const text = (value: unknown) => typeof value === 'string' ? value : ''
const strings = (value: unknown) => list(value).filter((item): item is string => typeof item === 'string')
const uniqueRows = (value: unknown) => {
  const seen = new Set<string>()
  return list(value).map(row).filter(item => typeof item.id === 'string' && !!item.id && !seen.has(item.id) && (seen.add(item.id), true))
}

export const assetUrl = (path: string) => /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
export function safeUrl(path: string) {
  if (!path || path.startsWith('//') || /[<>\\\u0000-\u001f]/.test(path)) return false
  try { return ['http:', 'https:'].includes(new URL(path, 'https://atlas.local/').protocol) } catch { return false }
}

function dimension(value: unknown): Dimension {
  const source = row(value)
  return {...source, rating:typeof source.rating === 'string' ? source.rating as Dimension['rating'] : null,
    evidence:text(source.evidence), difference:text(source.difference), sourceIds:strings(source.sourceIds),
    missingReason:typeof source.missingReason === 'string' ? source.missingReason : !source.evidence ? 'Evidence not supplied.' : null}
}
function visual(value: unknown): Visual {
  const source = row(value), path = text(source.localPath)
  return {...source, localPath:safeUrl(path) ? path : null, sourceId:text(source.sourceId), scale:text(source.scale), credit:text(source.credit),
    scope:text(source.scope), caption:text(source.caption), usage:text(source.usage), acquired:text(source.acquired),
    missingReason:typeof source.missingReason === 'string' ? source.missingReason : !path ? 'Site imagery has not been supplied.' : null}
}
function point(value: unknown): [number, number] | null {
  const coordinates = list(value)
  return coordinates.length === 2 && coordinates.every(item => typeof item === 'number' && Number.isFinite(item)) &&
    Math.abs(coordinates[0] as number) <= 180 && Math.abs(coordinates[1] as number) <= 90 ? coordinates as [number, number] : null
}

/** Normalize the destination export once; never calculate ratings or infer scene coordinates. */
export function normalizeAtlas(value: unknown): Atlas {
  const raw = row(value)
  if (!Array.isArray(raw.sites) || !Array.isArray(raw.comparisons)) throw new Error('Invalid atlas payload')
  const sites: Site[] = uniqueRows(raw.sites).filter(site => ['earth','moon','mars'].includes(text(site.body))).map(site => ({
    ...site, id:text(site.id), body:site.body as Site['body'], name:text(site.name)||text(site.id), region:text(site.region),
    feature:text(site.feature), description:text(site.description)||undefined, thumbnail:text(site.thumbnail)||undefined,
    locator:text(site.locator), mapPoint:point(site.mapPoint), mapPointKind:text(site.mapPointKind), mapPointSourceId:text(site.mapPointSourceId),
    coordinateNote:text(site.coordinateNote), coordinateConvention:text(site.coordinateConvention), sourceIds:strings(site.sourceIds),
  }))
  const byId = new Map(sites.map(site => [site.id, site]))
  const comparisons: Comparison[] = uniqueRows(raw.comparisons).filter(pair => pair.status === 'reviewed' &&
    byId.get(text(pair.earthId))?.body === 'earth' && ['moon','mars'].includes(byId.get(text(pair.targetId))?.body || '')).map(pair => ({
    ...pair, id:text(pair.id), earthId:text(pair.earthId), targetId:text(pair.targetId), status:'reviewed',
    reviewer:text(pair.reviewer)||null, reviewDate:text(pair.reviewDate)||null, reviewStatus:text(pair.reviewStatus), reviewNotes:text(pair.reviewNotes),
    relationship:text(pair.relationship), relationshipSourceIds:strings(pair.relationshipSourceIds),
    similaritySummary:text(pair.similaritySummary)||'Similarity evidence not supplied.',
    overall:(text(pair.overall)||'Insufficient evidence') as Comparison['overall'], coverage:typeof pair.coverage === 'number' && Number.isFinite(pair.coverage) ? pair.coverage : 0,
    rankEligible:pair.rankEligible === true, rankOrder:typeof pair.rankOrder === 'number' && Number.isFinite(pair.rankOrder) ? pair.rankOrder : null,
    terrain:dimension(pair.terrain), geology:dimension(pair.geology),
    visuals:{earth:visual(row(pair.visuals).earth), target:visual(row(pair.visuals).target)},
    similarities:uniqueRows(pair.similarities).map(item => ({...item,id:text(item.id),dimension:item.dimension === 'terrain' ? 'terrain' : 'geology',
      earthFeature:text(item.earthFeature),planetaryFeature:text(item.planetaryFeature),sharedObservation:text(item.sharedObservation),limitation:text(item.limitation),
      earthLocator:text(item.earthLocator),planetaryLocator:text(item.planetaryLocator),scaleNote:text(item.scaleNote),sourceIds:strings(item.sourceIds),reviewStatus:text(item.reviewStatus)})),
    practice:uniqueRows(pair.practice).map(item => ({...item,id:text(item.id),label:text(item.label),reason:text(item.reason),sourceIds:strings(item.sourceIds),
      status:item.status === 'not_supported' ? 'not_supported' : 'possible',limitations:text(item.limitations)})),
    limits:strings(pair.limits), limitSourceIds:strings(pair.limitSourceIds), explanation:text(pair.explanation),
    explanationSourceIds:strings(pair.explanationSourceIds), reportPath:safeUrl(text(pair.reportPath)) ? text(pair.reportPath) : '',
  }))
  return {...raw, datasetVersion:text(raw.datasetVersion), reviewProfile:text(raw.reviewProfile), orderingProfile:text(raw.orderingProfile), sites, comparisons,
    criteria:uniqueRows(raw.criteria).map(item => ({...item,id:text(item.id),key:text(item.key),role:text(item.role),title:text(item.title),question:text(item.question),
      unitOrRating:text(item.unitOrRating),rule:text(item.rule),readiness:text(item.readiness)})),
    sources:uniqueRows(raw.sources).map(item => ({...item,id:text(item.id),title:text(item.title),provider:text(item.provider),locator:text(item.locator),
      url:safeUrl(text(item.url)) ? text(item.url) : '', accessDate:text(item.accessDate)||null})),
  }
}

export function matches(atlas: Atlas, siteId: string, world?: string) {
  const sites = new Map(atlas.sites.map(site => [site.id,site]))
  const pairs = atlas.comparisons.filter(pair => (pair.earthId === siteId || pair.targetId === siteId) &&
    (!world || sites.get(pair.earthId === siteId ? pair.targetId : pair.earthId)?.body === world))
  // Backend rankOrder is scoped to a target. Reverse search retains dataset order.
  return sites.get(siteId)?.body === 'earth' ? pairs : pairs.map((pair,index) => ({pair,index})).sort((a,b) =>
    (a.pair.rankOrder ?? Infinity) - (b.pair.rankOrder ?? Infinity) || a.index - b.index).map(item => item.pair)
}
export async function loadAtlas(signal: AbortSignal) {
  const response = await fetch(import.meta.env.VITE_ATLAS_URL || `${import.meta.env.BASE_URL}data/atlas.json`, {signal})
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return normalizeAtlas(await response.json())
}
