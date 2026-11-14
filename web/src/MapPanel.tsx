import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Site } from './types'

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

  useEffect(() => {
    if (!node.current) return
    const instance = new maplibregl.Map({
      container: node.current,
      style: {
        version: 8,
        sources: {
          land: { type: 'geojson', data: `${import.meta.env.BASE_URL}maps/ne_110m_land.geojson`, attribution: 'Made with Natural Earth' },
        },
        layers: [
          { id: 'ocean', type: 'background', paint: { 'background-color': '#0a1c30' } },
          { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': '#31546a', 'fill-opacity': 0.85 } },
          { id: 'coast', type: 'line', source: 'land', paint: { 'line-color': '#7395a8', 'line-width': 0.8, 'line-opacity': 0.75 } },
        ],
      },
      center: [-100, 48],
      zoom: projection === 'globe' ? 0.5 : 2.2,
      attributionControl: false,
    })
    map.current = instance
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
    instance.on('error', () => setMapUnavailable(true))
    return () => {
      instance.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    const markers = sites.flatMap(site => {
      if (!site.mapPoint) return []
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `site-marker${site.id === selectedId ? ' selected' : ''}`
      button.setAttribute('aria-label', `Select ${site.name}; regional map locator`)
      button.title = `${site.name} · ${site.mapPointKind}`
      button.addEventListener('click', () => onSelect(site.id))
      const marker = new maplibregl.Marker({ element: button })
        .setLngLat(site.mapPoint)
        .addTo(instance)
      return [marker]
    })
    return () => markers.forEach(marker => marker.remove())
  }, [sites, selectedId, onSelect])

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
  }, [selectedId, sites, projection])

  return (
    <div className="map-frame">
      <div className="map-canvas" ref={node} aria-label="Earth regional locator map" />
      <div className="map-note">
        <span className="map-note-dot" />
        {mapUnavailable ? 'Map layer unavailable · results remain usable' : 'Regional locators · not feature boundaries'}
      </div>
    </div>
  )
}
