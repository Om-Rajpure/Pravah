/**
 * MumbaiMap — PRAVAAH Live Crowd Flow, Saturation & Train Simulation Canvas
 * MapLibre GL JS + OpenFreeMap Bright (No API keys required)
 * 
 * Quantity Classification Taxonomy:
 * - SPARSE:   0–20%    (#0D9488) Teal
 * - LIGHT:    20–40%   (#2563EB) Blue
 * - MODERATE: 40–60%   (#D97706) Amber
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
  const [forecastHorizon, setForecastHorizon] = useState(60)
  const [whatIfView, setWhatIfView] = useState('AFTER')
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
          fill_color: p.fill_color || '#0D9488',
          border_color: p.border_color || '#0D9488',
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
          fill_color: p.fill_color || '#0D9488',
          halo_opacity: p.display_pressure >= 85 ? 0.50 : p.display_pressure >= 60 ? 0.38 : 0.20
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

  // Render Interactive Hotspot & Train DOM Markers (12-13px typography)
  const updateMapMarkers = useCallback((map) => {
    if (!map) return
    clearMarkers()

    // 1. Zone Hotspot Badges
    const targetZones = processedZones.filter(z => z.display_pressure >= 55 || z.id === selectedZoneId)
    targetZones.forEach(zone => {
      if (!zone.lat || !zone.lng) return

      const isCritical = zone.display_pressure >= 85
      const isSelected = selectedZoneId === zone.id

      const el = document.createElement('div')
      el.className = 'group cursor-pointer select-none transition-transform hover:scale-105 active:scale-95'
      el.style.zIndex = isCritical ? '25' : '15'

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${isCritical ? `
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
          ` : ''}
          <div class="px-2.5 py-1 rounded-[8px] shadow-elevated flex items-center gap-1.5 border text-[12px] sm:text-[13px] font-bold transition-all ${
            isSelected ? 'ring-2 ring-navy scale-105' : ''
          }" style="background-color: ${zone.fill_color}; color: #FFFFFF; border-color: rgba(255,255,255,0.7);">
            <span class="tracking-tight">${zone.name.split(' ')[0]}</span>
            <span class="bg-black/25 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">${zone.display_pressure}%</span>
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

    // 2. Train Fleet Badges (Local 12-Car Rakes)
    if (activeMode === 'NETWORK' || activeMode === 'CURRENT' || activeMode === 'DISRUPTIONS') {
      const trains = mapData?.trains || crowdSimEngine.getState().trains
      trains.forEach(train => {
        if (!train.coord) return

        const cl = train.classification || classifyQuantity(train.occupancy || 1400, 2000)
        const tEl = document.createElement('div')
        tEl.className = 'group cursor-pointer select-none transition-transform hover:scale-110'
        tEl.style.zIndex = '30'

        tEl.innerHTML = `
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] shadow-sm border text-[11px] font-bold text-white" style="background-color: ${cl.color}; border-color: #FFFFFF;">
            <svg class="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16M6 6v12M18 6v12" />
            </svg>
            <span class="font-mono text-[10.5px]">${cl.pct}%</span>
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
                0,  '#0D9488',
                40, '#2563EB',
                60, '#D97706',
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
              'fill-opacity': 0.18
            }
          })
          map.addLayer({
            id: 'pravaah-zones-line',
            type: 'line',
            source: 'pravaah-zones-src',
            paint: {
              'line-color': ['get', 'border_color'],
              'line-width': 2.0,
              'line-opacity': 0.85
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
              'line-width': activeMode === 'NETWORK' ? 5.5 : 3.0,
              'line-opacity': 0.85
            }
          })
        }
      }

      // 4. Crowd Flow Vectors
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
              'line-width': 6.5,
              'line-opacity': 0.80
            }
          })
          map.addLayer({
            id: 'pravaah-flows-line',
            type: 'line',
            source: 'pravaah-flows-src',
            paint: {
              'line-width': [
                'interpolate', ['linear'], ['get', 'load_pct'],
                0, 3.0,
                40, 4.0,
                60, 5.0,
                75, 6.5,
                85, 8.0
              ],
              'line-color': [
                'step', ['get', 'load_pct'],
                '#0D9488',
                20, '#2563EB',
                40, '#D97706',
                60, '#F97316',
                85, '#DC2626'
              ],
              'line-dasharray': [3, 2],
              'line-opacity': 0.90
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
              'line-width': 7.5,
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
              'line-color': '#0D9488',
              'line-width': 6.5,
              'line-dasharray': [3, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 7. Visibility Matrix
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
        map.setPaintProperty('pravaah-transit-line', 'line-width', activeMode === 'NETWORK' ? 5.5 : 3.0)
      }

      // Smooth Flow Animation Loop
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      let dashOffset = 0
      const animateFlow = () => {
        dashOffset = (dashOffset - 0.3) % 100
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
      console.error('[PRAVAAH Map] Layer sync error:', err)
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
      }, 700)

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
    mapInstanceRef.current.easeTo({ center: [zone.lng, zone.lat], zoom: 13.0, duration: 450 })
  }

  return (
    <div
      className={`relative w-full rounded-[14px] overflow-hidden border border-border bg-surface-muted flex flex-col ${className}`}
      style={{ minHeight: '480px', ...style }}
      role="region"
      aria-label="PRAVAAH Live Crowd Flow & Saturation Map"
    >
      {/* Top Operations Toolbar (13-14px) */}
      <div className="absolute top-3.5 left-3.5 right-14 sm:right-auto z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-[10px] border border-border shadow-subtle">
        <button
          onClick={() => setActiveMode('CURRENT')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'CURRENT' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Activity className="w-4 h-4 text-teal" />
          <span>Current Flow</span>
        </button>

        <button
          onClick={() => setActiveMode('FORECAST')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'FORECAST' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-orange" />
          <span>Forecast</span>
        </button>

        <button
          onClick={() => setActiveMode('NETWORK')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'NETWORK' ? 'bg-navy text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Train className="w-4 h-4 text-blue" />
          <span>Network & Trains</span>
        </button>

        <button
          onClick={() => setActiveMode('DISRUPTIONS')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'DISRUPTIONS' ? 'bg-critical text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-warning-border" />
          <span>Disruptions</span>
        </button>

        <button
          onClick={() => setActiveMode('INTERVENTION')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'INTERVENTION' ? 'bg-orange text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Zap className="w-4 h-4 text-white" />
          <span>Action Flow</span>
        </button>

        <button
          onClick={() => setActiveMode('WHAT_IF')}
          className={`px-3 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
            activeMode === 'WHAT_IF' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>What-If</span>
        </button>
      </div>

      {/* Sub-Controls: Forecast Horizon */}
      {activeMode === 'FORECAST' && (
        <div className="absolute top-16 left-3.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-[8px] border border-border shadow-subtle text-[13px]">
          <span className="text-[12px] font-semibold text-text-muted mr-1">Forecast Horizon:</span>
          {[30, 60, 120, 180].map(h => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-2.5 py-0.5 rounded-[6px] text-[12px] sm:text-[13px] font-semibold transition-all ${
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
        <div className="absolute top-16 left-3.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-[8px] border border-border shadow-subtle text-[13px]">
          <button
            onClick={() => setWhatIfView('BEFORE')}
            className={`px-3 py-1 rounded-[6px] text-[12px] sm:text-[13px] font-semibold transition-all ${
              whatIfView === 'BEFORE' ? 'bg-critical text-white' : 'text-text-secondary hover:bg-surface-muted'
            }`}
          >
            Before Action (Curry Rd: 94%)
          </button>
          <button
            onClick={() => setWhatIfView('AFTER')}
            className={`px-3 py-1 rounded-[6px] text-[12px] sm:text-[13px] font-semibold transition-all ${
              whatIfView === 'AFTER' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:bg-surface-muted'
            }`}
          >
            After Action (-18 pts)
          </button>
        </div>
      )}

      {/* Top Hotspots Bar (12-13px) */}
      {mapData?.hotspots && mapData.hotspots.length > 0 && (
        <div className="absolute top-16 right-3.5 z-10 hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-[8px] border border-border shadow-subtle text-[13px]">
          <span className="text-[12px] font-semibold text-text-muted px-1.5 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-critical" /> Hotspots:
          </span>
          {mapData.hotspots.slice(0, 3).map(h => (
            <button
              key={h.id}
              onClick={() => handleFocusHotspot(h)}
              className="px-2 py-0.5 rounded-[6px] bg-surface-muted hover:bg-surface-subtle border border-border font-semibold text-text-primary hover:border-orange transition-colors flex items-center gap-1"
            >
              <span>{h.name.split(' ')[0]}</span>
              <span className="font-mono text-[12px] text-critical font-bold">{h.pressure}%</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottleneck Callout */}
      {activeMode === 'CURRENT' && mapData?.bottlenecks && mapData.bottlenecks.length > 0 && (
        <div className="absolute bottom-16 sm:bottom-3.5 right-3.5 z-10 max-w-[320px] bg-white/95 backdrop-blur-sm border border-critical/40 rounded-[10px] p-3.5 shadow-elevated space-y-1.5">
          <div className="flex items-center gap-1.5 text-critical font-bold text-[12px] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Active Network Bottleneck</span>
          </div>
          <p className="text-[13.5px] font-semibold text-text-primary leading-snug">
            {mapData.bottlenecks[0].corridor}
          </p>
          <div className="flex items-center justify-between text-[12px] text-text-secondary pt-1 border-t border-border/60">
            <span>Throughput: <strong className="text-critical font-bold">{mapData.bottlenecks[0].load_pct}% Load</strong></span>
            <span className="text-text-muted font-medium">High Inflow</span>
          </div>
        </div>
      )}

      {/* MapLibre Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Loading Overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-navy/80 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-[13px] font-semibold text-white tracking-wide">
            Loading Mumbai Geography & Overlays...
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

      {/* Map Legend */}
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
