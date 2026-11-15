export const bodies = [
  {id:'earth', name:'Earth', kind:'Terrestrial planet', color:'#55D6E8', texture:'earth_daymap', diameter:'12,756 km', gravity:'9.8 m/s²', day:'24.0 hours', angle:2.65, subtitle:'Our home world', description:'Oceans, moving tectonic plates and an active atmosphere shape Earth’s surface. Its deserts, volcanic fields and impact structures offer places to practice fieldwork for other worlds.'},
  {id:'moon', name:'Moon', kind:'Natural satellite', color:'#CBD5E1', texture:'moon', diameter:'3,475 km', gravity:'1.6 m/s²', day:'708.7 hours', angle:2.8, subtitle:'Earth’s companion', description:'The Moon’s surface preserves bright cratered highlands and dark plains formed by ancient lava. Apollo crews explored both the terrain and the rocks to understand its history.'},
  {id:'mars', name:'Mars', kind:'Terrestrial planet', color:'#FF9D66', texture:'mars', diameter:'6,792 km', gravity:'3.7 m/s²', day:'24.7 hours', angle:3.6, subtitle:'The red planet', description:'Mars has vast volcanic landscapes and craters that preserve signs of ancient water. Rover missions examine these surfaces to piece together when and how those environments formed.'},
] as const
export type Body = typeof bodies[number]
export const factSource = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'
export const textureSources = [
  ['Earth zoom · NASA Blue Marble Next Generation', 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/'],
  ['Earth · NASA Blue Marble', 'https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/'],
  ['Moon · NASA Lunar Reconnaissance Orbiter', 'https://svs.gsfc.nasa.gov/4720/'],
  ['Mars · NASA/JPL/USGS Viking Orbiter mosaic', 'https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m'],
] as const
