export type Body = 'earth' | 'moon' | 'mars'
export type Rating = 'Strong' | 'Moderate' | 'Weak' | null

export interface Source {
  id: string
  provider: string
  title: string
  url: string
  locator: string
  accessDate: string
}

export interface Site {
  id: string
  name: string
  body: Body
  region: string
  feature: string
  locator: string
  mapPoint: [number, number] | null
  mapPointKind: string
  mapPointSourceId: string
}

export interface Dimension {
  rating: Rating
  evidence: string
  difference: string
  sourceIds: string[]
  missingReason: string | null
}

export interface Practice {
  id: string
  label: string
  reason: string
  sourceIds: string[]
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
  terrain: Dimension
  geology: Dimension
  practice: Practice[]
  limits: string[]
  limitSourceIds: string[]
  visuals: { earth: Visual; target: Visual }
  reviewNotes: string
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
  sites: Site[]
  comparisons: Comparison[]
}
