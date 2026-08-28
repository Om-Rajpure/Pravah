/**
 * PRAVAAH Map Service
 * MapLibre GL JS + OpenStreetMap raster tiles (No API key required)
 */

import * as maplibregl from 'maplibre-gl'
import { MAP_CONFIG, DEFAULT_CENTER, DEFAULT_ZOOM } from '../config/map'

/**
 * Creates and initializes a MapLibre GL map instance.
 * @param {HTMLElement} container - DOM container element
 * @param {Object} customOptions - Overrides for MAP_CONFIG
 * @returns {maplibregl.Map} map instance
 */
export function createMapInstance(container, customOptions = {}) {
  const options = {
    ...MAP_CONFIG,
    container,
    ...customOptions,
  }

  const map = new maplibregl.Map(options)

  // Compact OpenStreetMap + OpenFreeMap attribution at bottom-right
  const attribution = new maplibregl.AttributionControl({
    compact: true,
    customAttribution:
      '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  })
  map.addControl(attribution, 'bottom-right')

  return map
}

/**
 * Resets the map camera to the default Mumbai operational view.
 * @param {maplibregl.Map} map
 */
export function resetMapCamera(map) {
  if (!map) return
  map.flyTo({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    essential: true,
    duration: 800,
  })
}

/**
 * Safely triggers MapLibre's resize calculation.
 * @param {maplibregl.Map} map
 */
export function resizeMap(map) {
  if (map && typeof map.resize === 'function') {
    map.resize()
  }
}
