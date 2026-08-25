/**
 * MumbaiMap — PRAVAAH Live Spatial Intelligence Canvas
 * 
 * Capabilities:
 * 1. Modes: CURRENT, FORECAST, NETWORK, DISRUPTIONS, INTERVENTION, WHAT-IF.
 * 2. Real-Time Telemetry: Zone pressure polygons, flow vectors, station loads.
 * 3. Multi-Horizon Forecast: +30m, +60m, +120m, +180m with hotspot halos.
 * 4. Disruption Overlay: Red dashed line on blocked rail/road corridors.
 * 5. Counterfactual Simulation: Before vs After intervention pressure delta.
 * 6. Demo Mode & Judge Tour Synchronization.
 * 7. Sub-second initial render using inline Carto Positron raster tiles.
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { 
  Activity, 
  TrendingUp, 
  Train, 
  AlertTriangle, 
  Zap, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
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
}) {
  const mapContainerRef   = useRef(null)
  const mapInstanceRef    = useRef(null)
  const isInitializingRef = useRef(false)
  const onMapReadyRef     = useRef(onMapReady)

  useEffect(() => {
    onMapReadyRef.current = onMapReady
  }, [onMapReady])

  // Map Modes: 'CURRENT' | 'FORECAST' | 'NETWORK' | 'DISRUPTIONS' | 'INTERVENTION' | 'WHAT_IF'
  const [activeMode, setActiveMode] = useState('CURRENT')
  const [forecastHorizon, setForecastHorizon] = useState(60) // 30 | 60 | 120 | 180
  const [whatIfView, setWhatIfView] = useState('AFTER') // 'BEFORE' | 'AFTER'
  const [selectedFeature, setSelectedFeature] = useState(null)
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

  // Build dynamic GeoJSON for active mode
  const dynamicGeoJSON = useMemo(() => {
    if (!mapData || !mapData.geojson) return null

    const baseZones = mapData.geojson.zones
    if (!baseZones || !baseZones.features) return mapData.geojson

    const updatedFeatures = baseZones.features.map(f => {
      const p = f.properties
      let displayPressure = p.pressure
      let displayColor = p.fill_color
      let displayBorder = p.border_color
      let displayLabel = `${p.name}\n${p.pressure}/100`

      if (activeMode === 'FORECAST') {
        const horizonKey = `forecast_${forecastHorizon}m`
        const forecastVal = p[horizonKey] !== undefined ? p[horizonKey] : p.forecast_60m || p.pressure
        displayPressure = forecastVal
        const visuals = getPressureColors(forecastVal)
        displayColor = visuals.fill
        displayBorder = visuals.border
        const delta = forecastVal - p.pressure
        const deltaSign = delta > 0 ? `+${delta}` : `${delta}`
        displayLabel = `${p.name}\n${forecastVal}/100 (${deltaSign})`
      } else if (activeMode === 'WHAT_IF') {
        if (whatIfView === 'AFTER') {
          const afterVal = p.counterfactual_after !== undefined ? p.counterfactual_after : p.pressure
          displayPressure = afterVal
          const visuals = getPressureColors(afterVal)
          displayColor = visuals.fill
          displayBorder = visuals.border
          const delta = afterVal - p.pressure
          const deltaSign = delta > 0 ? `+${delta}` : `${delta}`
          displayLabel = `${p.name}\n${afterVal}/100 (${deltaSign})`
        }
      }

      return {
        ...f,
        properties: {
          ...p,
          display_pressure: displayPressure,
          display_fill: displayColor,
          display_border: displayBorder,
          display_label: displayLabel,
        }
      }
    })

    return {
      ...mapData.geojson,
      zones: {
        type: 'FeatureCollection',
        features: updatedFeatures
      }
    }
  }, [mapData, activeMode, forecastHorizon, whatIfView])

  // Setup / Update MapLibre layers
  const updateMapLayers = useCallback((map, gData) => {
    if (!map || !map.isStyleLoaded() || !gData) return

    try {
      // 1. ZONES LAYER
      if (gData.zones) {
        if (map.getSource('pravaah-zones-src')) {
          map.getSource('pravaah-zones-src').setData(gData.zones)
        } else {
          map.addSource('pravaah-zones-src', {
            type: 'geojson',
            data: gData.zones
          })

          map.addLayer({
            id: 'pravaah-zones-fill',
            type: 'fill',
            source: 'pravaah-zones-src',
            paint: {
              'fill-color': ['get', 'display_fill'],
              'fill-opacity': 0.38
            }
          })

          map.addLayer({
            id: 'pravaah-zones-line',
            type: 'line',
            source: 'pravaah-zones-src',
            paint: {
              'line-color': ['get', 'display_border'],
              'line-width': [
                'case',
                ['>=', ['get', 'display_pressure'], 85],
                3.2,
                ['>=', ['get', 'display_pressure'], 70],
                2.4,
                1.5
              ],
              'line-opacity': 0.9
            }
          })

          map.addLayer({
            id: 'pravaah-zones-symbol',
            type: 'symbol',
            source: 'pravaah-zones-src',
            layout: {
              'text-field': ['get', 'display_label'],
              'text-size': 10.5,
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-anchor': 'center',
              'text-allow-overlap': false
            },
            paint: {
              'text-color': '#17212B',
              'text-halo-color': '#FFFFFF',
              'text-halo-width': 1.5
            }
          })

          // Click on zone
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

      // 2. TRANSIT LINES LAYER
      if (gData.transit_lines) {
        if (map.getSource('pravaah-transit-src')) {
          map.getSource('pravaah-transit-src').setData(gData.transit_lines)
        } else {
          map.addSource('pravaah-transit-src', {
            type: 'geojson',
            data: gData.transit_lines
          })

          map.addLayer({
            id: 'pravaah-transit-line',
            type: 'line',
            source: 'pravaah-transit-src',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 3,
              'line-opacity': 0.85
            }
          })
        }
      }

      // 3. STATIONS LAYER
      if (gData.stations) {
        if (map.getSource('pravaah-stations-src')) {
          map.getSource('pravaah-stations-src').setData(gData.stations)
        } else {
          map.addSource('pravaah-stations-src', {
            type: 'geojson',
            data: gData.stations
          })

          map.addLayer({
            id: 'pravaah-stations-circle',
            type: 'circle',
            source: 'pravaah-stations-src',
            paint: {
              'circle-radius': 5.5,
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF'
            }
          })

          map.on('click', 'pravaah-stations-circle', (e) => {
            if (e.features && e.features[0]) {
              setSelectedFeature({ type: 'station', properties: e.features[0].properties })
            }
          })
        }
      }

      // 4. INTERVENTION CORRIDOR LAYER
      if (gData.intervention_flow) {
        if (map.getSource('pravaah-flow-src')) {
          map.getSource('pravaah-flow-src').setData(gData.intervention_flow)
        } else {
          map.addSource('pravaah-flow-src', {
            type: 'geojson',
            data: gData.intervention_flow
          })

          map.addLayer({
            id: 'pravaah-flow-line',
            type: 'line',
            source: 'pravaah-flow-src',
            paint: {
              'line-color': '#E69A2E',
              'line-width': 4.5,
              'line-dasharray': [3, 1.5],
              'line-opacity': 0.95
            }
          })
        }

        // Toggle flow visibility based on mode
        const showFlow = (activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF')
        if (map.getLayer('pravaah-flow-line')) {
          map.setLayoutProperty('pravaah-flow-line', 'visibility', showFlow ? 'visible' : 'none')
        }
      }

      // Layer visibilities for DISRUPTIONS mode
      if (map.getLayer('pravaah-transit-line')) {
        const isDisrupted = activeMode === 'DISRUPTIONS' || mapData?.active_scenario?.is_active
        if (isDisrupted) {
          map.setPaintProperty('pravaah-transit-line', 'line-dasharray', [2, 1])
        } else {
          map.setPaintProperty('pravaah-transit-line', 'line-dasharray', [1, 0])
        }
      }

    } catch (err) {
      console.warn('MapLibre layer update notice:', err)
    }
  }, [activeMode, forecastHorizon, whatIfView, mapData, onSelectZone])

  // Initialize MapLibre
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current)    return
    if (isInitializingRef.current)   return
    if (mapInstanceRef.current)      return

    isInitializingRef.current = true
    setMapStatus('loading')
    setErrorMsg(null)

    try {
      const map = createMapInstance(mapContainerRef.current, { interactive })

      const markReady = () => {
        isInitializingRef.current = false
        setMapStatus('ready')
        if (onMapReadyRef.current) {
          try {
            onMapReadyRef.current(map)
          } catch (_) {}
        }
        if (dynamicGeoJSON) {
          updateMapLayers(map, dynamicGeoJSON)
        }
      }

      map.once('load', markReady)
      map.once('styledata', () => {
        requestAnimationFrame(() => { if (map) map.resize() })
      })

      // Strict Safety Timer: max 1.2s loading overlay
      const safetyTimer = setTimeout(() => {
        if (map && mapInstanceRef.current) {
          map.resize()
          markReady()
        }
      }, 1200)

      map.on('error', (e) => {
        if (e.error && e.error.status === 401) {
          clearTimeout(safetyTimer)
          isInitializingRef.current = false
          setMapStatus('error')
          setErrorMsg('Map authentication failed.')
          map.remove()
          mapInstanceRef.current = null
        }
      })

      mapInstanceRef.current = map

      requestAnimationFrame(() => {
        if (map) map.resize()
      })
    } catch (err) {
      console.error('MapLibre initialization failed:', err)
      isInitializingRef.current = false
      setMapStatus('error')
      setErrorMsg('Could not initialize map canvas.')
    }
  }, [interactive, dynamicGeoJSON, updateMapLayers])

  const handleRetry = useCallback(() => {
    if (mapInstanceRef.current) {
      try { mapInstanceRef.current.remove() } catch (_) {}
      mapInstanceRef.current = null
    }
    isInitializingRef.current = false
    initializeMap()
  }, [initializeMap])

  useEffect(() => {
    initializeMap()

    let resizeObserver = null
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) resizeMap(mapInstanceRef.current)
      })
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove() } catch (_) {}
        mapInstanceRef.current = null
      }
      isInitializingRef.current = false
    }
  }, [initializeMap])

  // Sync layers when GeoJSON or modes change
  useEffect(() => {
    if (mapInstanceRef.current && dynamicGeoJSON) {
      updateMapLayers(mapInstanceRef.current, dynamicGeoJSON)
    }
  }, [dynamicGeoJSON, updateMapLayers])

  // Camera controls
  const handleZoomIn    = () => mapInstanceRef.current?.zoomIn({ duration: 250 })
  const handleZoomOut   = () => mapInstanceRef.current?.zoomOut({ duration: 250 })
  const handleResetView = () => { if (mapInstanceRef.current) resetMapCamera(mapInstanceRef.current) }

  return (
    <div
      className={`relative w-full rounded-card overflow-hidden border border-border bg-surface-muted/20 flex flex-col ${className}`}
      style={{ minHeight: '440px', ...style }}
      role="region"
      aria-label="PRAVAAH Live Spatial Intelligence Canvas"
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
          <span>Current</span>
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
              ? 'bg-orange text-navy-dark font-extrabold shadow-sm' 
              : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-navy" />
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
        <div className="absolute top-15 sm:top-14 left-3 z-10 flex items-center gap-1 bg-surface/95 backdrop-blur-md px-2 py-1 rounded-card border border-border shadow-subtle text-xs animate-in fade-in duration-150">
          <span className="text-[10px] uppercase font-bold text-text-muted mr-1">Horizon:</span>
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

      {/* Action Recommendation Floating Callout Card (When in Action or What-If mode) */}
      {(activeMode === 'INTERVENTION' || activeMode === 'WHAT_IF') && mapData?.recommendation && (
        <div className="absolute top-15 sm:top-14 right-3 z-10 max-w-[280px] bg-surface/95 backdrop-blur-md border border-orange/40 rounded-card p-3 shadow-elevated space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-orange-dark">
            <Zap className="w-3.5 h-3.5 text-orange flex-shrink-0" />
            <span className="text-[10px] uppercase font-extrabold tracking-wider">
              Recommended Intervention
            </span>
          </div>
          <p className="text-xs font-bold text-text-primary leading-snug">
            Redirect {mapData.recommendation.dosage_pct}% incoming flow from {mapData.recommendation.source_name} &rarr; {mapData.recommendation.destination_name}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
            <span className="text-teal font-bold">Reduction: -{mapData.recommendation.reduction} pts</span>
            <span className="text-text-muted">Side effect: +{mapData.recommendation.side_effect_increase} pts</span>
          </div>
        </div>
      )}

      {/* Disruption Floating Callout Card */}
      {activeMode === 'DISRUPTIONS' && (
        <div className="absolute top-15 sm:top-14 right-3 z-10 max-w-[280px] bg-critical-bg border border-critical/40 rounded-card p-3 shadow-elevated space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-critical">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-[10.5px] uppercase font-bold tracking-wider">
              Corridor Blockage Detected
            </span>
          </div>
          <p className="text-xs text-text-primary leading-snug">
            Central Railway Mainline (Curry Road &ndash; Parel) throughput constrained to 0 pass/hr. Traffic spilling onto Ambedkar Road.
          </p>
        </div>
      )}

      {/* MapLibre Canvas */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Sub-Second Loading Overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-navy-dark/80 backdrop-blur-[1px] transition-opacity duration-200">
          <div className="w-7 h-7 border-2 border-orange border-t-transparent rounded-full animate-spin mb-2.5" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">
            Loading Mumbai Operations Map
          </span>
          <span className="text-[10px] text-white/60 mt-0.5">
            Calibrating geographic intelligence…
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
    return { fill: '#B03A2E', border: '#7A2017' }
  } else if (score >= 70) {
    return { fill: '#E69A2E', border: '#B87518' }
  } else if (score >= 50) {
    return { fill: '#B8893D', border: '#8A6424' }
  } else {
    return { fill: '#2D9C8F', border: '#1D6E64' }
  }
}
