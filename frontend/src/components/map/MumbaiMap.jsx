import React, { useEffect, useRef, useState, useCallback } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapControls } from './MapControls'
import { createMapInstance, resetMapCamera, resizeMap } from '../../services/mapService'

export function MumbaiMap({ 
  className = '',
  onMapReady,
  interactive = true 
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const isInitializingRef = useRef(false)

  const [mapLoading, setMapLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(null)

  // Initialize MapLibre GL instance cleanly
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || isInitializingRef.current) return
    if (mapInstanceRef.current) return // Avoid duplicate instantiation in Strict Mode

    isInitializingRef.current = true
    setMapLoading(true)
    setMapError(null)

    try {
      const map = createMapInstance(mapContainerRef.current, {
        interactive,
      })

      map.on('load', () => {
        isInitializingRef.current = false
        setMapLoading(false)
        setMapReady(true)
        if (onMapReady) onMapReady(map)
      })

      map.on('error', (e) => {
        // Non-fatal style/tile notices
        console.warn('MapLibre notice:', e)
      })

      mapInstanceRef.current = map
    } catch (err) {
      console.error('MapLibre GL Initialization Error:', err)
      isInitializingRef.current = false
      setMapLoading(false)
      setMapError('PRAVAAH could not load the geographic map.')
    }
  }, [interactive, onMapReady])

  useEffect(() => {
    initializeMap()

    // ResizeObserver ensures MapLibre resizes cleanly when responsive layout changes
    let resizeObserver = null
    if (mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          resizeMap(mapInstanceRef.current)
        }
      })
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      isInitializingRef.current = false
    }
  }, [initializeMap])

  // Camera control handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn({ duration: 300 })
  }

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut({ duration: 300 })
  }

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      resetMapCamera(mapInstanceRef.current)
    }
  }

  return (
    <div 
      className={`relative w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] bg-surface-muted/40 rounded-card overflow-hidden border border-border ${className}`}
      role="region"
      aria-label="Mumbai Geographic Operations Map"
    >
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading State Overlay */}
      {mapLoading && (
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-[2px] flex flex-col items-center justify-center z-30 animate-in fade-in duration-150">
          <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">
            Loading Mumbai Map...
          </span>
          <span className="text-[10px] text-text-muted mt-0.5">
            Calibrating geographic canvas
          </span>
        </div>
      )}

      {/* Error Fallback State */}
      {mapError && (
        <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-10 h-10 rounded-full bg-critical-bg text-critical flex items-center justify-center mb-3">
            <span className="font-bold text-base">!</span>
          </div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Map Temporarily Unavailable</h4>
          <p className="text-xs text-text-secondary max-w-[280px] mb-4">
            PRAVAAH could not initialize the geographic map tiles.
          </p>
          <button
            onClick={initializeMap}
            className="px-4 py-2 bg-surface text-text-primary border border-border rounded-card-sm text-xs font-medium hover:bg-surface-muted transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Basic Accessible Map Navigation Controls */}
      {mapReady && !mapError && (
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />
      )}
    </div>
  )
}
