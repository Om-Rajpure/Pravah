/**
 * PRAVAAH Central Map Configuration — Phase 18
 * Primary: Carto Positron (highly reliable, free, no API key)
 * Fallback: OpenFreeMap Positron
 */

export const MAP_STYLES = {
  // Primary — Carto Positron GL: extremely reliable, no auth
  CARTO_POSITRON: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  // Fallback
  OPENFREEMAP_POSITRON: 'https://tiles.openfreemap.org/styles/positron',
  OPENFREEMAP_LIBERTY: 'https://tiles.openfreemap.org/styles/liberty',
}

// Environment override → Carto Positron (most reliable free option)
export const DEFAULT_MAP_STYLE =
  import.meta.env.VITE_MAP_STYLE_URL || MAP_STYLES.CARTO_POSITRON

// Central Mumbai operational view [lng, lat]
export const DEFAULT_CENTER = [72.84, 18.995]

export const DEFAULT_ZOOM       = 11.6
export const DESKTOP_DEFAULT_ZOOM = 11.6
export const MOBILE_DEFAULT_ZOOM  = 10.8
export const TABLET_DEFAULT_ZOOM  = 11.2

export const MIN_ZOOM = 9.5
export const MAX_ZOOM = 16.0

export const DEFAULT_MUMBAI_VIEW = {
  latitude: 18.995,
  longitude: 72.84,
  zoom: DEFAULT_ZOOM,
}

// Mumbai Metropolitan Region bounding box [SW, NE]
export const MUMBAI_BOUNDS = [
  [72.7, 18.85], // Southwest [lng, lat]
  [73.15, 19.35], // Northeast [lng, lat]
]

export const MAP_CONFIG = {
  style:            DEFAULT_MAP_STYLE,
  center:           DEFAULT_CENTER,
  zoom:             DEFAULT_ZOOM,
  minZoom:          MIN_ZOOM,
  maxZoom:          MAX_ZOOM,
  maxBounds:        MUMBAI_BOUNDS,
  attributionControl: false,
  dragRotate:       false,
  pitchWithRotate:  false,
}
