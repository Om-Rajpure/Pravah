/**
 * MumbaiMap — PRAVAAH Live Crowd Flow, Saturation & Train Simulation Canvas
 * 
 * Quantity Classification Taxonomy:
 * - SPARSE:   0–20%    (#14B8A6) Teal
 * - LIGHT:    20–40%   (#2563EB) Blue
 * - MODERATE: 40–60%   (#F59E0B) Amber
 * - HEAVY:    60–85%   (#F97316) Orange
 * - CRITICAL: 85–100%+ (#DC2626) Crimson
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import * as maplibregl from 'maplibre-gl'
import { 
  Activity, 
  TrendingUp, 
  Train, 
  AlertTriangle, 
  Zap, 
  Sparkles, 
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react'
import { MapControls } from './MapControls'
import { MapLegend } from './MapLegend'
import { LocationPopup } from './LocationPopup'
import { createMapInstance, resetMapCamera, resizeMap } from '../../services/mapService'
import { crowdSimEngine, TAXONOMY, classifyQuantity } from '../../services/crowdSimulationEngine'

export function MumbaiMap({
  className = '',
  onMapReady,
  interactive = true,
  style = {},
  mapData: incomingMapData,
  selectedZoneId,
  onSelectZone,
  onSimulateAction,
  demoEventIndex = null,
  simStatus = 'PAUSED',
}) {
  const mapContainerRef   = useRef(null)
  const mapInstanceRef    = useRef(null)
  const markersRef        = useRef([])
  const trainMarkersRef   = useRef([])
  const animFrameRef      = useRef(null)
  const onMapReadyRef     = useRef(onMapReady)

  useEffect(() => {
    onMapReadyRef.current = onMapReady
  }, [onMapReady])

  // Map Modes: 'CURRENT' | 'FORECAST' | 'NETWORK' | 'DISRUPTIONS' | 'INTERVENTION' | 'WHAT_IF'
  const [activeMode, setActiveMode] = useState('CURRENT')
  const [forecastHorizon, setForecastHorizon] = useState(60) // 30 | 60 | 120 | 180
  const [whatIfView, setWhatIfView] = useState('AFTER') // 'BEFORE' | 'AFTER'
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [mapReady, setMapReady]   = useState(false)
  const [mapStatus, setMapStatus] = useState('loading')
  const [errorMsg, setErrorMsg]   = useState(null)

  // Local engine state for continuous simulation & trains
  const [engineState, setEngineState] = useState(() => crowdSimEngine.getState())

  // Auto-sync with Demo Mode events
  useEffect(() => {
    if (demoEventIndex === null || demoEventIndex === undefined) return

    if (demoEventIndex === 0 || demoEventIndex === 1) {
      setActiveMode('CURRENT')
      crowdSimEngine.setDisruption(false)
      crowdSimEngine.setIntervention(false)
    } else if (demoEventIndex === 2) {
      setActiveMode('FORECAST')
      setForecastHorizon(120)
    } else if (demoEventIndex === 3) {
      setActiveMode('INTERVENTION')
      crowdSimEngine.setIntervention(true)
    } else if (demoEventIndex === 4) {
      setActiveMode('DISRUPTIONS')
      crowdSimEngine.setDisruption(true)
    } else if (demoEventIndex === 5) {
      setActiveMode('WHAT_IF')
      setWhatIfView('AFTER')
      crowdSimEngine.setIntervention(true)
    }
    setEngineState(crowdSimEngine.getState())
  }, [demoEventIndex])

  // Sync mode changes to engine
  useEffect(() => {
    if (activeMode === 'DISRUPTIONS') crowdSimEngine.setDisruption(true)
    else if (activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF') crowdSimEngine.setIntervention(true)
    else {
      crowdSimEngine.setDisruption(false)
      crowdSimEngine.setIntervention(false)
    }
    setEngineState(crowdSimEngine.getState())
  }, [activeMode])

  // Hybrid Data Fallback
  const mapData = useMemo(() => {
    const hasValidIncoming = incomingMapData?.geojson?.zones?.features?.length > 0 && incomingMapData?.geojson?.flows?.features?.length > 0
    if (hasValidIncoming) {
      return {
        ...incomingMapData,
        trains: engineState.trains,
        geojson: {
          ...incomingMapData.geojson,
          trains: engineState.geojson.trains
        }
      }
    }
    return engineState
  }, [incomingMapData, engineState])

  // Processed zones with quantity classification
  const processedZones = useMemo(() => {
    if (!mapData?.zones) return []

    return mapData.zones.map(z => {
      let count = z.people || Math.round(z.capacity * (z.pressure / 100))
      let delta = 0

      if (activeMode === 'FORECAST') {
        const factor = forecastHorizon === 30 ? 1.04 : forecastHorizon === 60 ? 1.09 : forecastHorizon === 120 ? 1.15 : 1.18
        count = Math.round(count * factor)
        delta = Math.round((factor - 1) * z.pressure)
      } else if (activeMode === 'WHAT_IF') {
        if (whatIfView === 'AFTER') {
          if (z.id === 'curry-road') count = Math.round(count * 0.81)
          if (z.id === 'thane') count = Math.round(count * 1.08)
        }
      }

      const cl = classifyQuantity(count, z.capacity)
      return {
        ...z,
        people: count,
        display_pressure: cl.pct,
        display_delta: delta,
        display_label: cl.formatted_label,
        fill_color: cl.color,
        border_color: cl.color,
        classification: cl
      }
    })
  }, [mapData, activeMode, forecastHorizon, whatIfView])

  // GeoJSON for Zones
  const zonesGeoJSON = useMemo(() => {
    if (!mapData?.geojson?.zones?.features) return null
    const features = mapData.geojson.zones.features.map(f => {
      const pZone = processedZones.find(pz => pz.id === f.id || pz.id === f.properties?.id)
      const p = pZone || f.properties
      return {
        ...f,
        properties: {
          ...f.properties,
          ...p,
          fill_color: p.fill_color || '#14B8A6',
          border_color: p.border_color || '#14B8A6',
          display_pressure: p.display_pressure || p.pressure
        }
      }
    })
    return { type: 'FeatureCollection', features }
  }, [mapData, processedZones])

  // GeoJSON for Saturation Halos
  const halosGeoJSON = useMemo(() => {
    if (!mapData?.geojson?.halos?.features) return null
    const features = mapData.geojson.halos.features.map(f => {
      const pZone = processedZones.find(pz => f.id === `halo-${pz.id}` || f.properties?.id === pz.id)
      const p = pZone || f.properties
      return {
        ...f,
        properties: {
          ...f.properties,
          ...p,
          display_pressure: p.display_pressure || p.pressure,
          fill_color: p.fill_color || '#14B8A6',
          halo_opacity: p.display_pressure >= 85 ? 0.55 : p.display_pressure >= 60 ? 0.42 : 0.25
        }
      }
    })
    return { type: 'FeatureCollection', features }
  }, [mapData, processedZones])

  // Clear DOM Markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    trainMarkersRef.current.forEach(m => m.remove())
    trainMarkersRef.current = []
  }, [])

  // Render Interactive Hotspot & Train DOM Markers
  const updateMapMarkers = useCallback((map) => {
    if (!map) return
    clearMarkers()

    // 1. Zone Hotspot Badges
    const targetZones = processedZones.filter(z => z.display_pressure >= 60 || z.id === selectedZoneId)
    targetZones.forEach(zone => {
      if (!zone.lat || !zone.lng) return

      const isCritical = zone.display_pressure >= 85
      const isSelected = selectedZoneId === zone.id

      const el = document.createElement('div')
      el.className = 'group cursor-pointer select-none transition-transform hover:scale-110 active:scale-95'
      el.style.zIndex = isCritical ? '25' : '15'

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${isCritical ? `
            <span class="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </span>
          ` : ''}
          <div class="px-2.5 py-1 rounded-card-sm shadow-elevated flex items-center gap-1.5 border text-[11px] font-extrabold transition-all ${
            isSelected ? 'ring-2 ring-navy scale-105' : ''
          }" style="background-color: ${zone.fill_color}; color: #FFFFFF; border-color: ${zone.border_color};">
            <span class="tracking-tight">${zone.name.split(' ')[0]}</span>
            <span class="bg-black/30 px-1.5 py-0.5 rounded font-mono text-[10px]">${zone.display_pressure}%</span>
          </div>
          <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: ${zone.fill_color};"></div>
        </div>
      `

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedFeature({ type: 'zone', properties: zone })
        if (onSelectZone) onSelectZone(zone)
        map.easeTo({ center: [zone.lng, zone.lat], zoom: 12.8, duration: 400 })
      })

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([zone.lng, zone.lat])
        .addTo(map)

      markersRef.current.push(marker)
    })

    // 2. Train Fleet Badges (Local Rake Simulation)
    if (activeMode === 'NETWORK' || activeMode === 'CURRENT' || activeMode === 'DISRUPTIONS') {
      const trains = mapData?.trains || crowdSimEngine.getState().trains
      trains.forEach(train => {
        if (!train.coord) return

        const cl = train.classification || classifyQuantity(train.occupancy || 1400, 2000)
        const tEl = document.createElement('div')
        tEl.className = 'group cursor-pointer select-none transition-transform hover:scale-125'
        tEl.style.zIndex = '30'

        tEl.innerHTML = `
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded shadow-md border text-[10px] font-extrabold text-white" style="background-color: ${cl.color}; border-color: #FFFFFF;">
            <svg class="w-3 h-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16M6 6v12M18 6v12" />
            </svg>
            <span class="font-mono text-[9px]">${cl.pct}%</span>
          </div>
        `

        tEl.addEventListener('click', (e) => {
          e.stopPropagation()
          setSelectedFeature({
            type: 'train',
            properties: {
              id: train.id,
              name: `${train.id} (${train.lineName})`,
              line: train.lineName,
              direction: train.direction > 0 ? 'Downbound' : 'Upbound',
              occupancy: train.currentOccupancy || train.baseOccupancy,
              capacity: 2000,
              classification: cl,
              color: cl.color
            }
          })
          map.easeTo({ center: train.coord, zoom: 13.0, duration: 400 })
        })

        const tMarker = new maplibregl.Marker({ element: tEl, anchor: 'center' })
          .setLngLat(train.coord)
          .addTo(map)

        trainMarkersRef.current.push(tMarker)
      })
    }
  }, [processedZones, selectedZoneId, activeMode, mapData, clearMarkers, onSelectZone])

  // Core synchronization method
  const syncMapLayers = useCallback((map) => {
    if (!map || !map.isStyleLoaded()) return

    try {
      // 1. Spatial Saturation Heat Halos
      if (halosGeoJSON) {
        if (map.getSource('pravaah-halos-src')) {
          map.getSource('pravaah-halos-src').setData(halosGeoJSON)
        } else {
          map.addSource('pravaah-halos-src', { type: 'geojson', data: halosGeoJSON })
          map.addLayer({
            id: 'pravaah-halos-fill',
            type: 'fill',
            source: 'pravaah-halos-src',
            paint: {
              'fill-color': [
                'interpolate', ['linear'], ['get', 'display_pressure'],
                0,  '#14B8A6',
                40, '#2563EB',
                60, '#F59E0B',
                75, '#F97316',
                85, '#DC2626'
              ],
              'fill-opacity': ['get', 'halo_opacity']
            }
          })
        }
      }

      // 2. Zone Boundaries
      if (zonesGeoJSON) {
        if (map.getSource('pravaah-zones-src')) {
          map.getSource('pravaah-zones-src').setData(zonesGeoJSON)
        } else {
          map.addSource('pravaah-zones-src', { type: 'geojson', data: zonesGeoJSON })
          map.addLayer({
            id: 'pravaah-zones-fill',
            type: 'fill',
            source: 'pravaah-zones-src',
            paint: {
              'fill-color': ['get', 'fill_color'],
              'fill-opacity': 0.22
            }
          })
          map.addLayer({
            id: 'pravaah-zones-line',
            type: 'line',
            source: 'pravaah-zones-src',
            paint: {
              'line-color': ['get', 'border_color'],
              'line-width': 2.2,
              'line-opacity': 0.90
            }
          })
          map.on('click', 'pravaah-zones-fill', (e) => {
            if (e.features && e.features[0]) {
              const f = e.features[0]
              setSelectedFeature({ type: 'zone', properties: f.properties })
              if (onSelectZone) onSelectZone(f.properties)
            }
          })
        }
      }

      // 3. Transit Rail Lines
      if (mapData?.geojson?.transit_lines) {
        if (map.getSource('pravaah-transit-src')) {
          map.getSource('pravaah-transit-src').setData(mapData.geojson.transit_lines)
        } else {
          map.addSource('pravaah-transit-src', { type: 'geojson', data: mapData.geojson.transit_lines })
          map.addLayer({
            id: 'pravaah-transit-line',
            type: 'line',
            source: 'pravaah-transit-src',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': activeMode === 'NETWORK' ? 6.5 : 3.5,
              'line-opacity': 0.90
            }
          })
        }
      }

      // 4. Crowd Flow Vectors (Directional Animated Lines)
      if (mapData?.geojson?.flows) {
        if (map.getSource('pravaah-flows-src')) {
          map.getSource('pravaah-flows-src').setData(mapData.geojson.flows)
        } else {
          map.addSource('pravaah-flows-src', { type: 'geojson', data: mapData.geojson.flows })
          map.addLayer({
            id: 'pravaah-flows-casing',
            type: 'line',
            source: 'pravaah-flows-src',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 7.5,
              'line-opacity': 0.85
            }
          })
          map.addLayer({
            id: 'pravaah-flows-line',
            type: 'line',
            source: 'pravaah-flows-src',
            paint: {
              'line-width': [
                'interpolate', ['linear'], ['get', 'load_pct'],
                0, 3.5,
                40, 4.5,
                60, 5.5,
                75, 7.0,
                85, 8.5
              ],
              'line-color': [
                'step', ['get', 'load_pct'],
                '#14B8A6',
                20, '#2563EB',
                40, '#F59E0B',
                60, '#F97316',
                85, '#DC2626'
              ],
              'line-dasharray': [3, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 5. Disrupted Corridor Overlay
      if (mapData?.geojson?.disrupted_corridors) {
        if (map.getSource('pravaah-disruptions-src')) {
          map.getSource('pravaah-disruptions-src').setData(mapData.geojson.disrupted_corridors)
        } else {
          map.addSource('pravaah-disruptions-src', { type: 'geojson', data: mapData.geojson.disrupted_corridors })
          map.addLayer({
            id: 'pravaah-disruptions-line',
            type: 'line',
            source: 'pravaah-disruptions-src',
            paint: {
              'line-color': '#DC2626',
              'line-width': 8.5,
              'line-dasharray': [2, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 6. Intervention Redirection Flow
      if (mapData?.geojson?.intervention_flow) {
        if (map.getSource('pravaah-intervention-src')) {
          map.getSource('pravaah-intervention-src').setData(mapData.geojson.intervention_flow)
        } else {
          map.addSource('pravaah-intervention-src', { type: 'geojson', data: mapData.geojson.intervention_flow })
          map.addLayer({
            id: 'pravaah-intervention-line',
            type: 'line',
            source: 'pravaah-intervention-src',
            paint: {
              'line-color': '#14B8A6',
              'line-width': 7.5,
              'line-dasharray': [3, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 7. Explicit Visibility Matrix
      const setVis = (layerId, isVisible) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none')
        }
      }

      const showTransit = (activeMode === 'NETWORK' || activeMode === 'CURRENT' || activeMode === 'DISRUPTIONS')
      const showFlows   = (activeMode === 'CURRENT' || activeMode === 'FORECAST' || activeMode === 'DISRUPTIONS' || activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF')
      const showDisrupt = (activeMode === 'DISRUPTIONS')
      const showInterv  = (activeMode === 'INTERVENTION' || (activeMode === 'WHAT_IF' && whatIfView === 'AFTER'))

      setVis('pravaah-halos-fill', true)
      setVis('pravaah-zones-fill', true)
      setVis('pravaah-zones-line', true)
      setVis('pravaah-transit-line', showTransit)
      setVis('pravaah-flows-casing', showFlows)
      setVis('pravaah-flows-line', showFlows)
      setVis('pravaah-disruptions-line', showDisrupt)
      setVis('pravaah-intervention-line', showInterv)

      if (map.getLayer('pravaah-transit-line')) {
        map.setPaintProperty('pravaah-transit-line', 'line-width', activeMode === 'NETWORK' ? 6.5 : 3.5)
      }

      // 60 FPS Flow Animation Loop
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      let dashOffset = 0
      const animateFlow = () => {
        dashOffset = (dashOffset - 0.35) % 100
        if (map && map.getLayer('pravaah-flows-line')) {
          try { map.setPaintProperty('pravaah-flows-line', 'line-dashoffset', dashOffset) } catch (_) {}
        }
        if (map && map.getLayer('pravaah-disruptions-line')) {
          try { map.setPaintProperty('pravaah-disruptions-line', 'line-dashoffset', -dashOffset * 0.5) } catch (_) {}
        }
        if (map && map.getLayer('pravaah-intervention-line')) {
          try { map.setPaintProperty('pravaah-intervention-line', 'line-dashoffset', dashOffset * 1.5) } catch (_) {}
        }
        animFrameRef.current = requestAnimationFrame(animateFlow)
      }
      animFrameRef.current = requestAnimationFrame(animateFlow)

      // Update DOM Badges
      updateMapMarkers(map)

    } catch (err) {
      console.error('[MAP ERROR] Layer sync failed:', err)
    }
  }, [halosGeoJSON, zonesGeoJSON, mapData, activeMode, whatIfView, updateMapMarkers, onSelectZone])

  // Mount MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    setMapStatus('loading')
    setErrorMsg(null)

    try {
      const map = createMapInstance(mapContainerRef.current, { interactive })

      const handleReady = () => {
        setMapStatus('ready')
        setMapReady(true)
        if (onMapReadyRef.current) {
          try { onMapReadyRef.current(map) } catch (_) {}
        }
        syncMapLayers(map)
      }

      map.once('load', handleReady)
      map.on('styledata', () => {
        requestAnimationFrame(() => {
          if (map && map.isStyleLoaded()) {
            map.resize()
            syncMapLayers(map)
          }
        })
      })

      const safetyTimer = setTimeout(() => {
        if (map) {
          map.resize()
          if (map.isStyleLoaded()) handleReady()
          else setMapStatus('ready')
        }
      }, 800)

      mapInstanceRef.current = map

      let resizeObserver = null
      if (mapContainerRef.current && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) resizeMap(mapInstanceRef.current)
        })
        resizeObserver.observe(mapContainerRef.current)
      }

      return () => {
        clearTimeout(safetyTimer)
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        if (resizeObserver) resizeObserver.disconnect()
        clearMarkers()
        if (mapInstanceRef.current) {
          try { mapInstanceRef.current.remove() } catch (_) {}
          mapInstanceRef.current = null
        }
        setMapReady(false)
      }
    } catch (err) {
      console.error('Map mount error:', err)
      setMapStatus('error')
    }
  }, [interactive, syncMapLayers, clearMarkers])

  // Sync layers on state update
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      syncMapLayers(mapInstanceRef.current)
    }
  }, [mapReady, syncMapLayers])

  const handleZoomIn    = () => mapInstanceRef.current?.zoomIn({ duration: 250 })
  const handleZoomOut   = () => mapInstanceRef.current?.zoomOut({ duration: 250 })
  const handleResetView = () => { if (mapInstanceRef.current) resetMapCamera(mapInstanceRef.current) }

  const handleFocusHotspot = (zone) => {
    if (!mapInstanceRef.current) return
    setSelectedFeature({ type: 'zone', properties: zone })
    if (onSelectZone) onSelectZone(zone)
    mapInstanceRef.current.easeTo({ center: [zone.lng, zone.lat], zoom: 13.0, duration: 500 })
  }

  return (
    <div
      className={`relative w-full rounded-card overflow-hidden border border-border bg-surface-muted/20 flex flex-col ${className}`}
      style={{ minHeight: '460px', ...style }}
      role="region"
      aria-label="PRAVAAH Live Crowd Flow & Saturation Canvas"
    >
      {/* Top Intelligence Mode Switcher */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto z-10 flex flex-wrap items-center gap-1 bg-surface/95 backdrop-blur-md p-1.5 rounded-card border border-border shadow-subtle">
        <button
          onClick={() => setActiveMode('CURRENT')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'CURRENT' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-teal" />
          <span>Current Flow</span>
        </button>

        <button
          onClick={() => setActiveMode('FORECAST')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'FORECAST' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-orange" />
          <span>Forecast</span>
        </button>

        <button
          onClick={() => setActiveMode('NETWORK')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'NETWORK' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <Train className="w-3.5 h-3.5 text-brand-blue" />
          <span>Network & Trains</span>
        </button>

        <button
          onClick={() => setActiveMode('DISRUPTIONS')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'DISRUPTIONS' ? 'bg-critical text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span>Disruptions</span>
        </button>

        <button
          onClick={() => setActiveMode('INTERVENTION')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'INTERVENTION' ? 'bg-brand-blue text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-orange" />
          <span>Action</span>
        </button>

        <button
          onClick={() => setActiveMode('WHAT_IF')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'WHAT_IF' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange" />
          <span>What-If</span>
        </button>
      </div>

      {/* Sub-Controls: Forecast Horizon */}
      {activeMode === 'FORECAST' && (
        <div className="absolute top-15 sm:top-14 left-3 z-10 flex items-center gap-1 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-card border border-border shadow-subtle text-xs">
          <span className="text-[10px] uppercase font-bold text-text-muted mr-1">Forecast Horizon:</span>
          {[30, 60, 120, 180].map(h => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                forecastHorizon === h ? 'bg-navy text-white' : 'text-text-secondary hover:bg-surface-muted'
              }`}
            >
              +{h}m
            </button>
          ))}
        </div>
      )}

      {/* Sub-Controls: What-If Selector */}
      {activeMode === 'WHAT_IF' && (
        <div className="absolute top-15 sm:top-14 left-3 z-10 flex items-center gap-1.5 bg-surface/95 backdrop-blur-md p-1 rounded-card border border-border shadow-subtle text-xs">
          <button
            onClick={() => setWhatIfView('BEFORE')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              whatIfView === 'BEFORE' ? 'bg-critical text-white' : 'text-text-secondary hover:bg-surface-muted'
            }`}
          >
            Before Action (Curry Rd: 94%)
          </button>
          <button
            onClick={() => setWhatIfView('AFTER')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              whatIfView === 'AFTER' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
            }`}
          >
            After Action (-18 pts)
          </button>
        </div>
      )}

      {/* Top Hotspots Bar */}
      {mapData?.hotspots && mapData.hotspots.length > 0 && (
        <div className="absolute top-15 sm:top-14 right-3 z-10 hidden sm:flex items-center gap-1 bg-surface/95 backdrop-blur-md p-1 rounded-card border border-border shadow-subtle text-[11px]">
          <span className="text-[9.5px] uppercase font-bold text-text-muted px-1.5 flex items-center gap-1">
            <Flame className="w-3 h-3 text-critical" /> Hotspots:
          </span>
          {mapData.hotspots.slice(0, 3).map(h => (
            <button
              key={h.id}
              onClick={() => handleFocusHotspot(h)}
              className="px-2 py-0.5 rounded bg-surface-muted/80 hover:bg-surface-muted border border-border/60 font-semibold text-text-primary hover:border-terracotta transition-colors flex items-center gap-1"
            >
              <span>{h.name.split(' ')[0]}</span>
              <span className="font-mono text-[10px] text-critical font-bold">{h.pressure}%</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottleneck Callout */}
      {activeMode === 'CURRENT' && mapData?.bottlenecks && mapData.bottlenecks.length > 0 && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[280px] bg-surface/95 backdrop-blur-md border border-critical/40 rounded-card p-2.5 shadow-elevated space-y-1">
          <div className="flex items-center gap-1.5 text-critical font-bold text-[10.5px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Active Network Bottleneck</span>
          </div>
          <p className="text-[11.5px] font-semibold text-text-primary leading-tight">
            {mapData.bottlenecks[0].corridor}
          </p>
          <div className="flex items-center justify-between text-[10.5px] text-text-secondary pt-0.5 border-t border-border/50">
            <span>Throughput Load: <strong className="text-critical">{mapData.bottlenecks[0].load_pct}%</strong></span>
            <span className="text-text-muted">Heavy Inflow</span>
          </div>
        </div>
      )}

      {/* Intervention Callout */}
      {(activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF') && mapData?.recommendation && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[300px] bg-surface/95 backdrop-blur-md border border-brand-blue/40 rounded-card p-3 shadow-elevated space-y-1.5">
          <div className="flex items-center gap-1.5 text-brand-blue font-extrabold text-[10.5px] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-orange" />
            <span>PRAVAAH Recommended Flow</span>
          </div>
          <p className="text-xs font-bold text-text-primary leading-snug">
            Redirect {mapData.recommendation.dosage_pct}% flow: {mapData.recommendation.source_name} &rarr; {mapData.recommendation.destination_name} Buffer
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
            <span className="text-teal font-bold">Reduction: -{mapData.recommendation.reduction} pts</span>
            <span className="text-text-muted">Buffer load: +{mapData.recommendation.side_effect_increase} pts</span>
          </div>
        </div>
      )}

      {/* Disruption Callout */}
      {activeMode === 'DISRUPTIONS' && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[290px] bg-critical-bg border border-critical/40 rounded-card p-3 shadow-elevated space-y-1">
          <div className="flex items-center gap-1.5 text-critical font-bold text-[10.5px] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Corridor Blockage Active</span>
          </div>
          <p className="text-xs text-text-primary leading-snug">
            Central Railway Mainline (Parel &ndash; Curry Road) throughput constrained to 0 pass/hr. Local trains halting/reversing.
          </p>
        </div>
      )}

      {/* MapLibre Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Fast Loading Overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-navy-dark/80 backdrop-blur-[1px]">
          <div className="w-7 h-7 border-2 border-orange border-t-transparent rounded-full animate-spin mb-2.5" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">
            Loading Mumbai Crowd Flow Map
          </span>
        </div>
      )}

      {/* Selected Feature Popup (Zones & Trains) */}
      {selectedFeature && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <LocationPopup
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            onSimulateAction={onSimulateAction}
          />
        </div>
      )}

      {/* Dynamic Map Legend */}
      {mapStatus === 'ready' && (
        <MapLegend 
          mode={activeMode} 
          horizon={forecastHorizon} 
          isAfter={whatIfView === 'AFTER'}
        />
      )}

      {/* Map Controls */}
      {mapStatus === 'ready' && (
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />
      )}
    </div>
  )
}
