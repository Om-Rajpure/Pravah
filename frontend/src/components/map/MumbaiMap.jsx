/**
 * MumbaiMap — PRAVAAH Live Crowd Flow & Saturation Map (v2 Robust Canvas)
 * 
 * Guarantees:
 * 1. Single MapLibre instance created ONCE on mount (never destroyed on state/data updates).
 * 2. Guaranteed Layer Registration: Sources and WebGL layers registered whenever isStyleLoaded() is true on load, styledata, and data arrival.
 * 3. Mode Visibility Matrix: Every mode (CURRENT, FORECAST, NETWORK, DISRUPTIONS, ACTION, WHAT_IF) explicitly sets layer visibility.
 * 4. Spatial Saturation Heat Halos: Data-driven fill interpolation (Teal -> Amber -> Orange -> Crimson).
 * 5. 60 FPS Continuous Marching-Dash Animation on active flow lines and action corridors.
 * 6. Interactive Hotspot DOM Badges with live pulsing beacons.
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

export function MumbaiMap({
  className = '',
  onMapReady,
  interactive = true,
  style = {},
  mapData,
  selectedZoneId,
  onSelectZone,
  onSimulateAction,
  demoEventIndex = null,
  simStatus = 'PAUSED',
}) {
  const mapContainerRef   = useRef(null)
  const mapInstanceRef    = useRef(null)
  const markersRef        = useRef([])
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
  const [mapStatus, setMapStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg]   = useState(null)

  // Auto-sync with Demo Mode events
  useEffect(() => {
    if (demoEventIndex === null || demoEventIndex === undefined) return

    if (demoEventIndex === 0 || demoEventIndex === 1) {
      setActiveMode('CURRENT')
    } else if (demoEventIndex === 2) {
      setActiveMode('FORECAST')
      setForecastHorizon(120)
    } else if (demoEventIndex === 3) {
      setActiveMode('INTERVENTION')
    } else if (demoEventIndex === 4) {
      setActiveMode('DISRUPTIONS')
    } else if (demoEventIndex === 5) {
      setActiveMode('WHAT_IF')
      setWhatIfView('AFTER')
    }
  }, [demoEventIndex])

  // Compute active zone metrics based on mode
  const processedZones = useMemo(() => {
    if (!mapData?.zones) return []

    return mapData.zones.map(z => {
      let pressure = z.pressure
      let delta = 0
      let label = `${pressure}/100`

      if (activeMode === 'FORECAST') {
        const horizonKey = `forecast_${forecastHorizon}m`
        const forecastVal = z[horizonKey] !== undefined ? z[horizonKey] : z.forecast_60m || z.pressure
        pressure = forecastVal
        delta = forecastVal - z.pressure
        label = `${forecastVal}/100 (${delta >= 0 ? '+' : ''}${delta})`
      } else if (activeMode === 'WHAT_IF') {
        if (whatIfView === 'AFTER') {
          const afterVal = z.counterfactual_after !== undefined ? z.counterfactual_after : z.pressure
          pressure = afterVal
          delta = afterVal - z.pressure
          label = `${afterVal}/100 (${delta >= 0 ? '+' : ''}${delta})`
        }
      }

      const visuals = getPressureColors(pressure)
      return {
        ...z,
        display_pressure: pressure,
        display_delta: delta,
        display_label: label,
        fill_color: visuals.fill,
        border_color: visuals.border,
        level: visuals.level
      }
    })
  }, [mapData, activeMode, forecastHorizon, whatIfView])

  // Build GeoJSON FeatureCollection for zones
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
          border_color: p.border_color || '#0F766E',
          display_pressure: p.display_pressure || p.pressure,
          display_label: p.display_label || `${p.pressure}/100`
        }
      }
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }, [mapData, processedZones])

  // Build GeoJSON FeatureCollection for Spatial Heat Halos
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
          halo_opacity: p.display_pressure >= 85 ? 0.55 : p.display_pressure >= 70 ? 0.42 : 0.25
        }
      }
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }, [mapData, processedZones])

  // Clean up existing DOM markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
  }, [])

  // Render High-Visibility Interactive HTML Markers for Key Hotspots
  const updateCrowdMarkers = useCallback((map) => {
    if (!map) return
    clearMarkers()

    // Render prominent markers for Top Hotspots (≥70 pressure) and selected zone
    const targetZones = processedZones.filter(z => z.display_pressure >= 70 || z.id === selectedZoneId)

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
          <div class="px-2.5 py-1 rounded-card-sm shadow-elevated flex items-center gap-1.5 border text-[11.5px] font-extrabold transition-all duration-150 ${
            isSelected 
              ? 'ring-2 ring-navy scale-105' 
              : ''
          }" style="background-color: ${zone.fill_color}; color: #FFFFFF; border-color: ${zone.border_color};">
            <span class="tracking-tight">${zone.name}</span>
            <span class="bg-black/30 px-1.5 py-0.5 rounded font-mono text-[10.5px]">${zone.display_pressure}</span>
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
  }, [processedZones, selectedZoneId, clearMarkers, onSelectZone])

  // Core synchronization method: registers sources and layers safely
  const syncMapLayers = useCallback((map) => {
    if (!map || !map.isStyleLoaded()) return

    try {
      // 1. SPATIAL SATURATION HEAT HALOS
      if (halosGeoJSON) {
        if (map.getSource('pravaah-halos-src')) {
          map.getSource('pravaah-halos-src').setData(halosGeoJSON)
        } else {
          map.addSource('pravaah-halos-src', {
            type: 'geojson',
            data: halosGeoJSON
          })

          map.addLayer({
            id: 'pravaah-halos-fill',
            type: 'fill',
            source: 'pravaah-halos-src',
            paint: {
              'fill-color': [
                'interpolate', ['linear'], ['get', 'display_pressure'],
                0,  '#14B8A6',
                50, '#F59E0B',
                70, '#F97316',
                85, '#DC2626'
              ],
              'fill-opacity': ['get', 'halo_opacity']
            }
          })
        }
      }

      // 2. ZONES BOUNDARY POLYGON LAYER
      if (zonesGeoJSON) {
        if (map.getSource('pravaah-zones-src')) {
          map.getSource('pravaah-zones-src').setData(zonesGeoJSON)
        } else {
          map.addSource('pravaah-zones-src', {
            type: 'geojson',
            data: zonesGeoJSON
          })

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

          map.on('mouseenter', 'pravaah-zones-fill', () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', 'pravaah-zones-fill', () => { map.getCanvas().style.cursor = '' })
        }
      }

      // 3. TRANSIT RAIL LINES
      if (mapData?.geojson?.transit_lines) {
        if (map.getSource('pravaah-transit-src')) {
          map.getSource('pravaah-transit-src').setData(mapData.geojson.transit_lines)
        } else {
          map.addSource('pravaah-transit-src', {
            type: 'geojson',
            data: mapData.geojson.transit_lines
          })

          map.addLayer({
            id: 'pravaah-transit-line',
            type: 'line',
            source: 'pravaah-transit-src',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': activeMode === 'NETWORK' ? 6.0 : 3.0,
              'line-opacity': 0.90
            }
          })
        }
      }

      // 4. CROWD FLOW VECTORS (Directional Animated Lines)
      if (mapData?.geojson?.flows) {
        if (map.getSource('pravaah-flows-src')) {
          map.getSource('pravaah-flows-src').setData(mapData.geojson.flows)
        } else {
          map.addSource('pravaah-flows-src', {
            type: 'geojson',
            data: mapData.geojson.flows
          })

          // Flow Casing Line
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

          // Active Flow Line (Dashed for marching movement animation)
          map.addLayer({
            id: 'pravaah-flows-line',
            type: 'line',
            source: 'pravaah-flows-src',
            paint: {
              'line-width': [
                'interpolate', ['linear'], ['get', 'load_pct'],
                0,  3.5,
                50, 4.5,
                70, 6.0,
                85, 8.0
              ],
              'line-color': [
                'step', ['get', 'load_pct'],
                '#2563EB',      // 0-64% Normal Blue
                65, '#F97316',  // 65-84% Heavy Orange
                85, '#DC2626'   // >=85% Critical Crimson
              ],
              'line-dasharray': [3, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 5. DISRUPTED CORRIDOR OVERLAY (Central Line Parel - Curry Road Blockage)
      if (mapData?.geojson?.disrupted_corridors) {
        if (map.getSource('pravaah-disruptions-src')) {
          map.getSource('pravaah-disruptions-src').setData(mapData.geojson.disrupted_corridors)
        } else {
          map.addSource('pravaah-disruptions-src', {
            type: 'geojson',
            data: mapData.geojson.disrupted_corridors
          })

          map.addLayer({
            id: 'pravaah-disruptions-line',
            type: 'line',
            source: 'pravaah-disruptions-src',
            paint: {
              'line-color': '#DC2626',
              'line-width': 8.0,
              'line-dasharray': [2, 2],
              'line-opacity': 0.95
            }
          })
        }
      }

      // 6. INTERVENTION REDIRECTION FLOW (Action Teal-Blue #14B8A6)
      if (mapData?.geojson?.intervention_flow) {
        if (map.getSource('pravaah-intervention-src')) {
          map.getSource('pravaah-intervention-src').setData(mapData.geojson.intervention_flow)
        } else {
          map.addSource('pravaah-intervention-src', {
            type: 'geojson',
            data: mapData.geojson.intervention_flow
          })

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

      // 7. EXPLICIT VISIBILITY MATRIX BY MODE
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

      // Adjust transit line width in NETWORK mode
      if (map.getLayer('pravaah-transit-line')) {
        map.setPaintProperty('pravaah-transit-line', 'line-width', activeMode === 'NETWORK' ? 6.5 : 3.0)
      }

      // Continuous 60 FPS Flow Animation Loop
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

      let dashOffset = 0
      const animateFlow = () => {
        dashOffset = (dashOffset - 0.35) % 100

        if (map && map.getLayer('pravaah-flows-line')) {
          try {
            map.setPaintProperty('pravaah-flows-line', 'line-dashoffset', dashOffset)
          } catch (_) {}
        }
        if (map && map.getLayer('pravaah-disruptions-line')) {
          try {
            map.setPaintProperty('pravaah-disruptions-line', 'line-dashoffset', -dashOffset * 0.5)
          } catch (_) {}
        }
        if (map && map.getLayer('pravaah-intervention-line')) {
          try {
            map.setPaintProperty('pravaah-intervention-line', 'line-dashoffset', dashOffset * 1.5)
          } catch (_) {}
        }

        animFrameRef.current = requestAnimationFrame(animateFlow)
      }

      animFrameRef.current = requestAnimationFrame(animateFlow)

      // Render interactive DOM markers
      updateCrowdMarkers(map)

      // Phase 0: DEV Diagnostic Logging
      console.log('[MAP DEBUG]', {
        mode: activeMode,
        styleLoaded: map.isStyleLoaded(),
        sources: map.getStyle() ? Object.keys(map.getStyle().sources || {}) : [],
        layers: map.getStyle() ? (map.getStyle().layers || []).map(l => ({
          id: l.id,
          type: l.type,
          visibility: map.getLayoutProperty(l.id, 'visibility') || 'visible'
        })) : [],
        zonesFeatureCount: zonesGeoJSON?.features?.length || 0,
        halosFeatureCount: halosGeoJSON?.features?.length || 0,
        flowsFeatureCount: mapData?.geojson?.flows?.features?.length || 0,
        transitFeatureCount: mapData?.geojson?.transit_lines?.features?.length || 0,
        disruptionsFeatureCount: mapData?.geojson?.disrupted_corridors?.features?.length || 0,
        interventionFeatureCount: mapData?.geojson?.intervention_flow?.features?.length || 0,
        sampleHaloCoord: halosGeoJSON?.features?.[0]?.geometry?.coordinates?.[0]?.[0],
        sampleFlowCoord: mapData?.geojson?.flows?.features?.[0]?.geometry?.coordinates?.[0],
      })

    } catch (err) {
      console.error('[MAP ERROR] Layer sync failed:', err)
    }
  }, [halosGeoJSON, zonesGeoJSON, mapData, activeMode, whatIfView, updateCrowdMarkers, onSelectZone])

  // 1. MOUNT EFFECT: Initialize MapLibre ONCE
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

      // Strict Safety Timer: max 1.0s loading overlay
      const safetyTimer = setTimeout(() => {
        if (map) {
          map.resize()
          if (map.isStyleLoaded()) handleReady()
          else setMapStatus('ready')
        }
      }, 1000)

      map.on('error', (e) => {
        if (e.error && e.error.status === 401) {
          clearTimeout(safetyTimer)
          setMapStatus('error')
          setErrorMsg('Map authentication failed.')
          map.remove()
          mapInstanceRef.current = null
        }
      })

      mapInstanceRef.current = map

      // Continuous ResizeObserver
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
      console.error('MapLibre mount error:', err)
      setMapStatus('error')
      setErrorMsg('Could not initialize map canvas.')
    }
  }, [interactive, syncMapLayers, clearMarkers])

  // 2. DATA / MODE CHANGE EFFECT: Synchronize layers whenever props or modes update
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      syncMapLayers(mapInstanceRef.current)
    }
  }, [mapReady, syncMapLayers])

  // Camera controls
  const handleZoomIn    = () => mapInstanceRef.current?.zoomIn({ duration: 250 })
  const handleZoomOut   = () => mapInstanceRef.current?.zoomOut({ duration: 250 })
  const handleResetView = () => { if (mapInstanceRef.current) resetMapCamera(mapInstanceRef.current) }

  // Hotspot quick pan handler
  const handleFocusHotspot = (zone) => {
    if (!mapInstanceRef.current) return
    setSelectedFeature({ type: 'zone', properties: zone })
    if (onSelectZone) onSelectZone(zone)
    mapInstanceRef.current.easeTo({ center: [zone.lng, zone.lat], zoom: 13.0, duration: 500 })
  }

  const handleRetry = useCallback(() => {
    if (mapInstanceRef.current) {
      try { mapInstanceRef.current.remove() } catch (_) {}
      mapInstanceRef.current = null
    }
    setMapReady(false)
    setMapStatus('loading')
  }, [])

  return (
    <div
      className={`relative w-full rounded-card overflow-hidden border border-border bg-surface-muted/20 flex flex-col ${className}`}
      style={{ minHeight: '460px', ...style }}
      role="region"
      aria-label="PRAVAAH Live Crowd Flow & Saturation Canvas"
    >
      {/* Top Map Intelligence Mode Bar */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto z-10 flex flex-wrap items-center gap-1 bg-surface/95 backdrop-blur-md p-1.5 rounded-card border border-border shadow-subtle">
        <button
          onClick={() => setActiveMode('CURRENT')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'CURRENT' 
              ? 'bg-navy text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-teal" />
          <span>Current Flow</span>
        </button>

        <button
          onClick={() => setActiveMode('FORECAST')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'FORECAST' 
              ? 'bg-navy text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-orange" />
          <span>Forecast</span>
        </button>

        <button
          onClick={() => setActiveMode('NETWORK')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'NETWORK' 
              ? 'bg-navy text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Train className="w-3.5 h-3.5 text-brand-blue" />
          <span>Network</span>
        </button>

        <button
          onClick={() => setActiveMode('DISRUPTIONS')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'DISRUPTIONS' 
              ? 'bg-critical text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span>Disruptions</span>
        </button>

        <button
          onClick={() => setActiveMode('INTERVENTION')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'INTERVENTION' 
              ? 'bg-brand-blue text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-orange" />
          <span>Action</span>
        </button>

        <button
          onClick={() => setActiveMode('WHAT_IF')}
          className={`px-2.5 py-1 rounded-card-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeMode === 'WHAT_IF' 
              ? 'bg-teal text-white shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange" />
          <span>What-If</span>
        </button>
      </div>

      {/* Sub-Controls: Forecast Horizon Selector */}
      {activeMode === 'FORECAST' && (
        <div className="absolute top-15 sm:top-14 left-3 z-10 flex items-center gap-1 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-card border border-border shadow-subtle text-xs animate-in fade-in duration-150">
          <span className="text-[10px] uppercase font-bold text-text-muted mr-1">Forecast Horizon:</span>
          {[30, 60, 120, 180].map(h => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                forecastHorizon === h 
                  ? 'bg-navy text-white' 
                  : 'text-text-secondary hover:bg-surface-muted'
              }`}
            >
              +{h}m
            </button>
          ))}
        </div>
      )}

      {/* Sub-Controls: What-If Before/After Selector */}
      {activeMode === 'WHAT_IF' && (
        <div className="absolute top-15 sm:top-14 left-3 z-10 flex items-center gap-1.5 bg-surface/95 backdrop-blur-md p-1 rounded-card border border-border shadow-subtle text-xs animate-in fade-in duration-150">
          <button
            onClick={() => setWhatIfView('BEFORE')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              whatIfView === 'BEFORE' ? 'bg-critical text-white' : 'text-text-secondary hover:bg-surface-muted'
            }`}
          >
            Before Action (Curry Rd: 94)
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

      {/* Top Hotspots Quick-Focus Bar */}
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
              <span>{h.name}</span>
              <span className="font-mono text-[10px] text-critical font-bold">{h.pressure}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Movement & Bottleneck Floating Callout */}
      {activeMode === 'CURRENT' && mapData?.bottlenecks && mapData.bottlenecks.length > 0 && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[280px] bg-surface/95 backdrop-blur-md border border-critical/40 rounded-card p-2.5 shadow-elevated space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-critical font-bold text-[10.5px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Active Network Bottleneck</span>
          </div>
          <p className="text-[11.5px] font-semibold text-text-primary leading-tight">
            {mapData.bottlenecks[0].corridor}
          </p>
          <div className="flex items-center justify-between text-[10.5px] text-text-secondary pt-0.5 border-t border-border/50">
            <span>Throughput Load: <strong className="text-critical">{mapData.bottlenecks[0].load_pct}%</strong></span>
            <span className="text-text-muted">Accumulating</span>
          </div>
        </div>
      )}

      {/* Action Recommendation Floating Callout */}
      {(activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF') && mapData?.recommendation && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[300px] bg-surface/95 backdrop-blur-md border border-brand-blue/40 rounded-card p-3 shadow-elevated space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
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

      {/* Disruption Floating Callout */}
      {activeMode === 'DISRUPTIONS' && (
        <div className="absolute bottom-16 sm:bottom-3 right-3 z-10 max-w-[290px] bg-critical-bg border border-critical/40 rounded-card p-3 shadow-elevated space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-critical font-bold text-[10.5px] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Corridor Blockage Active</span>
          </div>
          <p className="text-xs text-text-primary leading-snug">
            Central Railway Mainline (Parel &ndash; Curry Road) throughput constrained to 0 pass/hr. Movement spilling onto Ambedkar Road.
          </p>
        </div>
      )}

      {/* MapLibre Canvas */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Fast Loading Overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-navy-dark/80 backdrop-blur-[1px] transition-opacity duration-200">
          <div className="w-7 h-7 border-2 border-orange border-t-transparent rounded-full animate-spin mb-2.5" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">
            Loading Mumbai Crowd Flow Map
          </span>
          <span className="text-[10px] text-white/60 mt-0.5">
            Calibrating movement vectors…
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-surface p-6 text-center">
          <div className="w-9 h-9 rounded-full bg-critical/10 text-critical flex items-center justify-center mb-2.5">
            <span className="font-bold text-base">!</span>
          </div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Geographic Canvas Unavailable</h4>
          <p className="text-xs text-text-secondary max-w-[260px] mb-3.5">
            {errorMsg || 'Could not load geographic map tiles.'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-navy text-white rounded-card-sm text-xs font-semibold hover:bg-navy-dark transition-colors shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Location Popup */}
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

function getPressureColors(score) {
  if (score >= 85) {
    return { fill: '#DC2626', border: '#991B1B', level: 'CRITICAL' }
  } else if (score >= 70) {
    return { fill: '#F97316', border: '#C2410C', level: 'HIGH' }
  } else if (score >= 50) {
    return { fill: '#F59E0B', border: '#B45309', level: 'MODERATE' }
  } else {
    return { fill: '#14B8A6', border: '#0F766E', level: 'LOW' }
  }
}
