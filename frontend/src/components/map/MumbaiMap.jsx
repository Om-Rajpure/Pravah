/**
 * MumbaiMap — Phase 18 Map Reliability Fix
 *
 * Key fixes:
 * 1. Map container has explicit pixel height via style prop (MapLibre requires it)
 * 2. onMapReady stored in a ref — avoids useCallback/useEffect cascade re-runs
 * 3. Single stable initialization guard using isInitializingRef
 * 4. Retry button clears map state correctly
 * 5. Error state shows only on actual initialization failure (not on tile warnings)
 */
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { MapControls } from './MapControls'
import { createMapInstance, resetMapCamera, resizeMap } from '../../services/mapService'

export function MumbaiMap({
  className = '',
  onMapReady,
  interactive = true,
  style = {},
}) {
  const mapContainerRef   = useRef(null)
  const mapInstanceRef    = useRef(null)
  const isInitializingRef = useRef(false)
  const onMapReadyRef     = useRef(onMapReady)  // stable ref — avoids effect re-triggers

  // Keep ref current without triggering re-renders
  useEffect(() => {
    onMapReadyRef.current = onMapReady
  }, [onMapReady])

  const [mapStatus, setMapStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg]   = useState(null)

  const initializeMap = useCallback(() => {
    // Guard: container must exist, not already initializing, not already mounted
    if (!mapContainerRef.current)    return
    if (isInitializingRef.current)   return
    if (mapInstanceRef.current)      return

    isInitializingRef.current = true
    setMapStatus('loading')
    setErrorMsg(null)

    try {
      const map = createMapInstance(mapContainerRef.current, { interactive })

      map.on('load', () => {
        isInitializingRef.current = false
        setMapStatus('ready')
        if (onMapReadyRef.current) onMapReadyRef.current(map)
      })

      map.on('error', (e) => {
        // MapLibre fires non-fatal tile/style notices as 'error' events.
        // Only treat source-level errors that prevent the map from loading at all.
        if (e.error && e.error.status === 401) {
          console.error('MapLibre auth error:', e)
          isInitializingRef.current = false
          setMapStatus('error')
          setErrorMsg('Map tiles require authentication. Check your tile provider.')
          map.remove()
          mapInstanceRef.current = null
          return
        }
        // Log but don't surface other tile warnings
        if (process.env.NODE_ENV !== 'production') {
          console.warn('MapLibre non-fatal notice:', e)
        }
      })

      mapInstanceRef.current = map
    } catch (err) {
      console.error('MapLibre GL initialization failed:', err)
      isInitializingRef.current = false
      setMapStatus('error')
      setErrorMsg('PRAVAAH could not initialize the geographic canvas.')
    }
  }, [interactive]) // onMapReady intentionally NOT a dep — handled via ref

  const handleRetry = useCallback(() => {
    // Full teardown before retry
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
    isInitializingRef.current = false
    initializeMap()
  }, [initializeMap])

  useEffect(() => {
    initializeMap()

    // ResizeObserver — keeps map canvas correct during layout shifts
    let resizeObserver = null
    if (mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) resizeMap(mapInstanceRef.current)
      })
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      isInitializingRef.current = false
    }
  }, [initializeMap])

  // Camera controls
  const handleZoomIn    = () => mapInstanceRef.current?.zoomIn({ duration: 300 })
  const handleZoomOut   = () => mapInstanceRef.current?.zoomOut({ duration: 300 })
  const handleResetView = () => { if (mapInstanceRef.current) resetMapCamera(mapInstanceRef.current) }

  return (
    <div
      className={`relative w-full rounded-card overflow-hidden border border-border bg-surface-muted/40 ${className}`}
      style={{ minHeight: '380px', ...style }}
      role="region"
      aria-label="Mumbai Geographic Operations Map"
    >
      {/* MapLibre Canvas — explicit h-full + w-full so canvas gets real dimensions */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Loading overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-navy-dark/80 backdrop-blur-[2px]">
          <div className="w-7 h-7 border-2 border-orange border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-[12px] font-bold text-white uppercase tracking-widest">
            Loading Mumbai Map
          </span>
          <span className="text-[10px] text-white/50 mt-1">
            Connecting to geographic data
          </span>
        </div>
      )}

      {/* Error state */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-surface p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-critical/10 text-critical flex items-center justify-center mb-3">
            <span className="font-bold text-base">!</span>
          </div>
          <h4 className="text-sm font-bold text-text-primary mb-1">Map Temporarily Unavailable</h4>
          <p className="text-xs text-text-secondary max-w-[260px] mb-4">
            {errorMsg || 'PRAVAAH could not load the geographic map tiles.'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-navy text-white rounded-card-sm text-xs font-semibold hover:bg-navy-dark transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Map controls (only when ready) */}
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
