import type {Criterion} from './types'

const categories=[
  {id:'terrain',label:'Terrain',note:'Landforms, surface geometry and traversable features.'},
  {id:'geology',label:'Geology',note:'Materials, mapped units and the processes that shaped them.'},
  {id:'environment',label:'Environment',note:'Environmental context and the limits of an Earth analogy.'},
  {id:'quality',label:'Data quality',note:'Resolution, valid observations and coordinate references.'},
  {id:'practice',label:'Field practice',note:'Activities justified by the documented evidence.'},
  {id:'other',label:'Other criteria',note:'Additional criteria supplied with this dataset.'},
] as const
function category(item:Criterion){
  if(item.role==='metadata_quality')return 'quality'
  if(item.key==='practice')return 'practice'
  if(['geology','process','fan_area_km2'].includes(item.key))return 'geology'
  if(['environmental_limit','specialized_context'].includes(item.role))return 'environment'
  if(['terrain','slope_deg','roughness_std_m','relief_m','channel_density_km_per_km2','boulder_coverage_pct'].includes(item.key))return 'terrain'
  return 'other'
}
/** Presentation groups only: scientific roles and rubric values remain untouched. */
export function groupCriteria(criteria:Criterion[]){
  return categories.map(group=>({...group,items:criteria.filter(item=>category(item)===group.id)})).filter(group=>group.items.length)
}
