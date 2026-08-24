/**
 * PRAVAAH Map Service
 * Developer Note:
 * - MapLibre GL JS is the primary mapping engine.
 * - OpenFreeMap is the open-source tile provider (no paid API keys required).
 * - Map configuration and Mumbai defaults are centralized in src/config/map.js.
 * - Geographic intelligence layers (Pressure, Transport, Hospitality, etc.) will be added modularly in subsequent steps.
 */

import * as maplibregl from 'maplibre-gl'
import { MAP_CONFIG, DEFAULT_CENTER, DEFAULT_ZOOM } from '../config/map'

/**
 * Creates and initializes a MapLibre GL map instance
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

  // Add compact attribution control at bottom-right
  const attribution = new maplibregl.AttributionControl({
    compact: true,
    customAttribution: '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  })
  map.addControl(attribution, 'bottom-right')

  return map
}

/**
 * Resets map camera to default Mumbai operational overview
 * @param {maplibregl.Map} map - Map instance
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
 * Safely triggers resize calculation
 * @param {maplibregl.Map} map - Map instance
 */
export function resizeMap(map) {
  if (map && typeof map.resize === 'function') {
    map.resize()
  }
}
