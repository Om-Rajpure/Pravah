import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapControls } from './MapControls'
import { MapLayerControl } from './MapLayerControl'
import { MapLegend } from './MapLegend'
import { LocationPopup } from './LocationPopup'
import { LocationDrawer } from './LocationDrawer'
import { setupPressureLayer, updatePressureSelection, togglePressureLayer } from './layers/PressureLayer'
import { setupTransportLayer, toggleTransportLayer } from './layers/TransportLayer'
import { setupHotelLayer, toggleHotelLayer } from './layers/HotelLayer'
import { setupRoadClosureLayer, toggleRoadClosureLayer } from './layers/RoadClosureLayer'
import { setupWelfareLayer, toggleWelfareLayer } from './layers/WelfareLayer'
import { setupCrowdFlowLayer, toggleCrowdFlowLayer } from './layers/CrowdFlowLayer'

// High-reliability light & neutral map styles with fallback
const MAP_STYLES = [
  'https://tiles.openfreemap.org/styles/positron',
  'https://tiles.openfreemap.org/styles/liberty',
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
]

const DEFAULT_CENTER = [72.8400, 18.9950] // [lng, lat] Lalbaug / Curry Road corridor
const DEFAULT_ZOOM = 11.6

export function MumbaiMap({ 
  mapData, 
  selectedZoneId, 
  onSelectZone, 
  onSimulateAction, 
  className = '' 
}) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [layersOpen, setLayersOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [popupPos, setPopupPos] = useState(null)

  const [activeLayers, setActiveLayers] = useState({
    pressure: true,
    transport: true,
    hotels: false,
    roads: true,
    welfare: false,
    crowdFlow: false
  })

  // Layer toggle helper
  const handleToggleLayer = (key) => {
    setActiveLayers(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (mapInstance.current) {
        if (key === 'pressure') togglePressureLayer(mapInstance.current, next.pressure)
        if (key === 'transport') toggleTransportLayer(mapInstance.current, next.transport)
        if (key === 'hotels') toggleHotelLayer(mapInstance.current, next.hotels)
        if (key === 'roads') toggleRoadClosureLayer(mapInstance.current, next.roads)
        if (key === 'welfare') toggleWelfareLayer(mapInstance.current, next.welfare)
        if (key === 'crowdFlow') toggleCrowdFlowLayer(mapInstance.current, next.crowdFlow)
      }
      return next
    })
  }

  // Count active layers
  const activeLayerCount = Object.values(activeLayers).filter(Boolean).length

  // Zoom controls
  const handleZoomIn = () => mapInstance.current?.zoomIn({ duration: 300 })
  const handleZoomOut = () => mapInstance.current?.zoomOut({ duration: 300 })
  const handleResetView = () => {
    mapInstance.current?.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      essential: true,
      duration: 800
    })
    setSelectedFeature(null)
    setPopupPos(null)
  }

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current) return

    let map = null
    try {
      const MapClass = maplibregl.Map
      const AttributionClass = maplibregl.AttributionControl

      map = new MapClass({
        container: mapContainer.current,
        style: MAP_STYLES[0],
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 9.5,
        maxZoom: 16,
        attributionControl: false
      })

      if (AttributionClass) {
        map.addControl(new AttributionClass({ compact: true }), 'bottom-right')
      }

      map.on('load', () => {
        setMapLoaded(true)
        setMapError(null)
      })

      map.on('error', (e) => {
        console.warn('MapLibre style/tile notice:', e)
      })

      mapInstance.current = map
    } catch (err) {
      console.error('Failed to initialize MapLibre GL:', err)
      setMapError('Map initialized with local vector fallback.')
      setMapLoaded(true)
    }

    // Resize observer for responsive layout changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.resize()
      }
    })
    resizeObserver.observe(mapContainer.current)

    return () => {
      resizeObserver.disconnect()
      if (map) {
        map.remove()
      }
      mapInstance.current = null
    }
  }, [])

  // Sync Layers and GeoJSON Sources when map is loaded and data is ready
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current || !mapData?.geojson) return

    const map = mapInstance.current

    try {
      // 1. Setup Pressure Zones
      if (mapData.geojson.zones) {
        setupPressureLayer(map, mapData.geojson.zones, selectedZoneId)
        togglePressureLayer(map, activeLayers.pressure)
      }

      // 2. Setup Transport Nodes & Lines
      if (mapData.geojson.stations || mapData.geojson.transit_lines) {
        setupTransportLayer(map, mapData.geojson.stations, mapData.geojson.transit_lines)
        toggleTransportLayer(map, activeLayers.transport)
      }

      // 3. Setup Hotels
      if (mapData.geojson.hotels) {
        setupHotelLayer(map, mapData.geojson.hotels)
        toggleHotelLayer(map, activeLayers.hotels)
      }

      // 4. Setup Roads
      if (mapData.geojson.roads) {
        setupRoadClosureLayer(map, mapData.geojson.roads)
        toggleRoadClosureLayer(map, activeLayers.roads)
      }

      // 5. Setup Welfare
      if (mapData.geojson.welfare) {
        setupWelfareLayer(map, mapData.geojson.welfare)
        toggleWelfareLayer(map, activeLayers.welfare)
      }

      // 6. Setup Crowd Flow
      setupCrowdFlowLayer(map, null)
      toggleCrowdFlowLayer(map, activeLayers.crowdFlow)

      // Attach Interactions (Click & Hover)
      // Zone Click
      map.on('click', 'pravaah-zones-fill', (e) => {
        if (!e.features || !e.features[0]) return
        const feature = e.features[0]
        const zoneId = feature.properties.id
        setSelectedFeature({ type: 'zone', properties: feature.properties })
        setPopupPos(e.lngLat)
        if (onSelectZone) onSelectZone(feature.properties)
        updatePressureSelection(map, zoneId)
      })

      // Station Click
      map.on('click', 'pravaah-stations-circle', (e) => {
        if (!e.features || !e.features[0]) return
        const feature = e.features[0]
        setSelectedFeature({ type: 'station', properties: feature.properties })
        setPopupPos(e.lngLat)
      })

      // Hotel Click
      map.on('click', 'pravaah-hotels-circle', (e) => {
        if (!e.features || !e.features[0]) return
        const feature = e.features[0]
        setSelectedFeature({ type: 'hotel', properties: feature.properties })
        setPopupPos(e.lngLat)
      })

      // Welfare Click
      map.on('click', 'pravaah-welfare-circle', (e) => {
        if (!e.features || !e.features[0]) return
        const feature = e.features[0]
        setSelectedFeature({ type: 'welfare', properties: feature.properties })
        setPopupPos(e.lngLat)
      })

      // Cursor Pointers on interactive layers
      const interactiveLayers = ['pravaah-zones-fill', 'pravaah-stations-circle', 'pravaah-hotels-circle', 'pravaah-welfare-circle']
      interactiveLayers.forEach(layerId => {
        map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = '' })
      })

    } catch (err) {
      console.warn('Error setting up map layers:', err)
    }
  }, [mapLoaded, mapData])

  // Sync external selectedZoneId changes
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      updatePressureSelection(mapInstance.current, selectedZoneId)
    }
  }, [selectedZoneId, mapLoaded])

  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-surface-muted/40 rounded-card overflow-hidden border border-border ${className}`}>
      {/* MapLibre DOM Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading State Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-surface/90 flex flex-col items-center justify-center z-30">
          <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Loading Mumbai Geography...</span>
        </div>
      )}

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onToggleLayers={() => setLayersOpen(prev => !prev)}
        layersOpen={layersOpen}
        activeLayerCount={activeLayerCount}
      />

      {/* Layer Control Panel */}
      {layersOpen && (
        <MapLayerControl
          layers={activeLayers}
          onToggleLayer={handleToggleLayer}
          onClose={() => setLayersOpen(false)}
        />
      )}

      {/* Map Legend */}
      <MapLegend />

      {/* Desktop Location Popup (anchored to top-left overlay inside map) */}
      {selectedFeature && (
        <div className="hidden sm:block absolute top-3 left-3 z-20">
          <LocationPopup
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            onSimulateAction={onSimulateAction}
          />
        </div>
      )}

      {/* Mobile Location Drawer (bottom sheet) */}
      {selectedFeature && (
        <LocationDrawer
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          onSimulateAction={onSimulateAction}
        />
      )}
    </div>
  )
}
