export type Body = 'earth' | 'moon' | 'mars'
export type Rating = 'Strong' | 'Moderate' | 'Weak' | null

export interface Source {
  id: string
  provider: string
  title: string
  url: string
  locator: string
  accessDate: string | null
}

export interface Criterion {
  id: string
  key: string
  role: string
  title: string
  question: string
  unitOrRating: string
  rule: string
  readiness: string
}

export interface Site {
  sourceIds?: string[]
  description?: string
  thumbnail?: string
  id: string
  name: string
  body: Body
  region: string
  feature: string
  locator: string
  mapPoint: [number, number] | null
  mapPointKind: string
  mapPointSourceId: string
  coordinateNote: string
  coordinateConvention: string
}

export interface Dimension {
  rating: Rating
  evidence: string
  difference: string
  sourceIds: string[]
  missingReason: string | null
}

export interface SimilarityEvidence {
  id: string
  dimension: 'terrain' | 'geology'
  earthFeature: string
  planetaryFeature: string
  sharedObservation: string
  limitation: string
  earthLocator: string
  planetaryLocator: string
  scaleNote: string
  sourceIds: string[]
  reviewStatus: string
}

export interface Practice {
  id: string
  label: string
  reason: string
  sourceIds: string[]
  status: 'possible' | 'not_supported'
  limitations: string
}

export interface Visual {
  localPath: string | null
  sourceId: string
  scale: string
  credit: string
  missingReason: string | null
}

export interface Comparison {
  id: string
  earthId: string
  targetId: string
  status: 'reviewed' | 'sourced-candidate'
  reviewer: string | null
  reviewDate: string | null
  relationship: string
  relationshipSourceIds: string[]
  similaritySummary: string
  terrain: Dimension
  geology: Dimension
  similarities: SimilarityEvidence[]
  practice: Practice[]
  limits: string[]
  limitSourceIds: string[]
  visuals: { earth: Visual; target: Visual }
  reviewNotes: string
  reviewStatus: string
  overall: 'Strong' | 'Moderate' | 'Weak' | 'Insufficient evidence'
  coverage: number
  rankEligible: boolean
  rankOrder: number | null
  explanation: string
  explanationSourceIds: string[]
  reportPath: string
}

export interface Atlas {
  datasetVersion: string
  reviewProfile: string
  orderingProfile: string
  sources: Source[]
  criteria: Criterion[]
  sites: Site[]
  comparisons: Comparison[]
}
