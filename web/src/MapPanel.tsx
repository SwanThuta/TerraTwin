import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Site } from './types'
import LocatorFallback, {landGeometry} from './LocatorFallback'

maplibregl.setWorkerUrl(mapWorkerUrl)

interface Props {
  sites: Site[]
  selectedId: string | null
  onSelect: (siteId: string) => void
  projection: 'flat' | 'globe'
}

export default function MapPanel({ sites, selectedId, onSelect, projection }: Props) {
  const node = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [mapUnavailable, setMapUnavailable] = useState(false)
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const currentSite = sites.find(site => site.id === selectedId)
  const point = currentSite?.mapPoint
  const externalMap = point ? `https://www.openstreetmap.org/?mlat=${point[1]}&mlon=${point[0]}#map=5/${point[1]}/${point[0]}` : null

  useEffect(() => {
    if (!node.current) return
    // MapLibre sets position:relative on its container. Keep it separate from
    // our absolute layout host so lazy-loaded provider CSS cannot collapse it.
    const container = document.createElement('div')
    container.className = 'map-instance'
    node.current.appendChild(container)
    let instance: maplibregl.Map | undefined
    let alive = true
    let loaded = false
    let resize: ResizeObserver | undefined
    let frame = 0
    setReady(false)
    setMapUnavailable(false)
    // Worker, context and source failures must never leave an empty panel.
    const deadline = window.setTimeout(() => {
      if (alive && !loaded) setMapUnavailable(true)
    }, 8000)
    try {
      instance = new maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {land: {type: 'geojson', data: landGeometry, attribution: 'Made with Natural Earth'}},
          layers: [
            {id: 'ocean', type: 'background', paint: {'background-color': '#0a1c30'}},
            {id: 'land', type: 'fill', source: 'land', paint: {'fill-color': '#31546a', 'fill-opacity': 0.85}},
            {id: 'coast', type: 'line', source: 'land', paint: {'line-color': '#7395a8', 'line-width': 0.8, 'line-opacity': 0.75}},
          ],
        },
        center: [-100, 48], zoom: 0.5, attributionControl: false,
      })
      const liveMap = instance
      map.current = liveMap
      liveMap.addControl(new maplibregl.NavigationControl({showCompass: false}), 'top-right')
      liveMap.addControl(new maplibregl.AttributionControl({compact: true}), 'bottom-right')
      liveMap.on('idle', () => {
        if (!alive || !liveMap.isSourceLoaded('land')) return
        loaded = true
        window.clearTimeout(deadline)
        setMapUnavailable(false)
        setReady(true)
      })
      liveMap.on('error', () => {if (alive) {setMapUnavailable(true);setReady(false)}})
      liveMap.on('webglcontextlost', () => {if (alive) {setMapUnavailable(true);setReady(false)}})
      liveMap.on('webglcontextrestored', () => {if (alive) liveMap.resize()})
      resize = new ResizeObserver(() => {if (alive) liveMap.resize()})
      resize.observe(node.current)
      frame = requestAnimationFrame(() => {if (alive) liveMap.resize()})
    } catch {
      setMapUnavailable(true)
    }
    return () => {
      alive = false
      window.clearTimeout(deadline)
      cancelAnimationFrame(frame)
      resize?.disconnect()
      instance?.remove()
      container.remove()
      if (map.current === instance) map.current = null
    }
  }, [attempt])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    const markers = sites.flatMap(site => {
      if (!site.mapPoint) return []
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `site-marker${site.id === selectedId ? ' selected' : ''}`
      button.setAttribute('aria-label', `Select ${site.name}; ${site.mapPointKind}`)
      button.title = `${site.name} · ${site.mapPointKind}`
      button.addEventListener('click', () => onSelect(site.id))
      const marker = new maplibregl.Marker({ element: button })
        .setLngLat(site.mapPoint)
        .addTo(instance)
      return [marker]
    })
    return () => markers.forEach(marker => marker.remove())
  }, [sites, selectedId, onSelect, attempt])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    const site = sites.find(item => item.id === selectedId)
    const apply = () => {
      instance.setProjection({ type: projection === 'globe' ? 'globe' : 'mercator' })
      if (site?.mapPoint) instance.jumpTo({ center: site.mapPoint, zoom: projection === 'globe' ? 0.5 : 2.2 })
    }
    if (instance.loaded()) apply()
    else instance.once('load', apply)
    return () => { instance.off('load', apply) }
  }, [selectedId, sites, projection, attempt])

  return (
    <div className="map-frame">
      {(!ready || mapUnavailable) && <LocatorFallback sites={sites} selectedId={selectedId} onSelect={onSelect}/>}
      <div className="map-canvas" ref={node} aria-label="Interactive Earth regional locator map" style={{visibility:ready&&!mapUnavailable?'visible':'hidden'}}/>
      {mapUnavailable && <div className="map-recovery" role="status">
        <span>Flat map · 3D renderer unavailable</span>
        <button onClick={()=>setAttempt(value=>value+1)}>Retry interactive map</button>
        {externalMap && <a href={externalMap} target="_blank" rel="noreferrer">Open context locator ↗</a>}
      </div>}
      {!sites.length && !mapUnavailable && <div className="map-empty">No published Earth locator for this selection. Choose an available comparison to explore its context.</div>}
      <div className="map-note">
        <span className="map-note-dot" />
        Regional locators · not feature boundaries
      </div>
    </div>
  )
}
