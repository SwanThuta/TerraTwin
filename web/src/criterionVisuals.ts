/** Concept illustrations are presentation assets, never observations or measurements. */
export const criterionVisuals:Record<string,{kind:string;label:string}>= {
 terrain:{kind:'landform',label:'Landforms in profile and plan view'},
 geology:{kind:'layers',label:'Layers and surface material classes'},
 process:{kind:'process',label:'Processes that shape a surface'},
 practice:{kind:'practice',label:'Mapping, sampling and field observations'},
 slope_deg:{kind:'slope',label:'Surface gradient and slope angle'},
 roughness_std_m:{kind:'roughness',label:'Variation around a local mean surface'},
 relief_m:{kind:'relief',label:'The range between high and low terrain'},
 fan_area_km2:{kind:'area',label:'The boundary of a mapped geologic unit'},
 channel_density_km_per_km2:{kind:'channels',label:'A channel network within a mapped area'},
 boulder_coverage_pct:{kind:'boulders',label:'Visible obstacles within an image footprint'},
 illumination:{kind:'light',label:'Lighting, terrain and cast shadows'},
 ice_lake_cave:{kind:'subsurface',label:'Surface and subsurface context'},
 gravity_atmosphere:{kind:'environment',label:'Gravity and atmospheric context'},
 effective_resolution_m:{kind:'resolution',label:'Native sampling and output pixel spacing'},
 valid_fraction:{kind:'validity',label:'Valid observations and masked cells'},
 datum_support:{kind:'coordinates',label:'Body-specific coordinate reference frames'},
}
export function criterionVisual(key:string){return criterionVisuals[key]||{kind:'record',label:'A source-linked review criterion'}}
