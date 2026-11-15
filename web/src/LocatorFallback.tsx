import {useEffect, useMemo, useRef, useState} from 'react'
import landJson from '../public/maps/ne_110m_land.geojson?raw'
import type {Site} from './types'

// The same bundled geography used by MapLibre, with no WebGL or worker required.
export const landGeometry = JSON.parse(landJson)
type Polygon = number[][][]
type Geometry = {type:'Polygon';coordinates:Polygon}|{type:'MultiPolygon';coordinates:Polygon[]}
const paths = (landGeometry.features as {geometry:Geometry}[]).flatMap(({geometry}) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polygons.map(polygon => polygon.map(ring => ring.map(([lon,lat],index) => `${index?'L':'M'}${lon},${-lat}`).join(' ')+'Z').join(' '))
})

export default function LocatorFallback({sites,selectedId,onSelect}:{sites:Site[];selectedId:string|null;onSelect:(id:string)=>void}) {
  const [zoom,setZoom]=useState(1)
  const [offset,setOffset]=useState({x:0,y:0})
  const drag=useRef<{x:number;y:number;offset:{x:number;y:number}}|null>(null)
  useEffect(()=>{setZoom(1);setOffset({x:0,y:0})},[selectedId])
  const box=useMemo(()=>({width:360/zoom,height:180/zoom}),[zoom])
  function changeZoom(next:number){setZoom(Math.max(1,Math.min(8,next)))}
  return <div className="locator-drawing">
    <svg viewBox={`${-box.width/2+offset.x} ${-box.height/2+offset.y} ${box.width} ${box.height}`} role="group" aria-label="Earth regional locator map, rendered from Natural Earth" tabIndex={0}
      onKeyDown={event=>{
        if(event.target!==event.currentTarget)return
        if(['+','=','-','0'].includes(event.key)){event.preventDefault();changeZoom(event.key==='0'?1:zoom*(event.key==='-'?.8:1.25));if(event.key==='0')setOffset({x:0,y:0})}
        const shift:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}
        const d=shift[event.key];if(d){event.preventDefault();setOffset(p=>({x:p.x+d[0]*box.width*.1,y:p.y+d[1]*box.height*.1}))}
      }}
      onPointerDown={event=>{if((event.target as Element).closest('[data-site]'))return;event.currentTarget.setPointerCapture(event.pointerId);drag.current={x:event.clientX,y:event.clientY,offset}}}
      onPointerMove={event=>{if(!drag.current)return;const bounds=event.currentTarget.getBoundingClientRect();const scale=Math.min(bounds.width/box.width,bounds.height/box.height);setOffset({x:drag.current.offset.x-(event.clientX-drag.current.x)/scale,y:drag.current.offset.y-(event.clientY-drag.current.y)/scale})}}
      onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}>
      <g fill="#31546a" stroke="#7395a8" strokeWidth={.28/zoom} fillRule="evenodd">{paths.map((path,index)=><path d={path} key={index}/>)}</g>
      {sites.map(site=>site.mapPoint&&<g key={site.id} data-site={site.id} role="button" tabIndex={0} aria-label={`Select ${site.name}; regional map locator`} aria-pressed={site.id===selectedId}
        onClick={()=>onSelect(site.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(site.id)}}}>
        <title>{site.name} · {site.mapPointKind}</title>
        <circle cx={site.mapPoint[0]} cy={-site.mapPoint[1]} r={4/zoom} fill="#55d6e8" opacity=".25"/>
        <circle cx={site.mapPoint[0]} cy={-site.mapPoint[1]} r={2/zoom} fill={site.id===selectedId?'#efffff':'#55d6e8'} stroke="#55d6e8" strokeWidth={.7/zoom}/>
      </g>)}
    </svg>
    <div className="locator-zoom" role="group" aria-label="Earth locator zoom">
      <button onClick={()=>changeZoom(zoom*1.25)} aria-label="Zoom in on map" disabled={zoom===8}>+</button>
      <button onClick={()=>changeZoom(zoom*.8)} aria-label="Zoom out on map" disabled={zoom===1}>−</button>
      <button onClick={()=>{setZoom(1);setOffset({x:0,y:0})}} aria-label="Reset map view">⌂</button>
    </div>
    <a className="locator-attribution" href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Made with Natural Earth</a>
  </div>
}
