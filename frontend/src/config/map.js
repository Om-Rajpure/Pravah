/**
 * PRAVAAH Central Map Configuration
 * Phase 13 — Environment-aware MapLibre GL JS & OpenFreeMap Infrastructure
 */

export const MAP_STYLES = {
  OPENFREEMAP_POSITRON: 'https://tiles.openfreemap.org/styles/positron',
  OPENFREEMAP_LIBERTY: 'https://tiles.openfreemap.org/styles/liberty',
  CARTO_POSITRON: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}

// Default style: OpenFreeMap Positron (clean, light, restrained, free)
export const DEFAULT_MAP_STYLE = import.meta.env.VITE_MAP_STYLE_URL || MAP_STYLES.OPENFREEMAP_POSITRON

// Central Mumbai operational view coordinates [lng, lat]
export const DEFAULT_CENTER = [72.8400, 18.9950]

export const DEFAULT_ZOOM = 11.6
export const DESKTOP_DEFAULT_ZOOM = 11.6
export const MOBILE_DEFAULT_ZOOM = 10.8
export const TABLET_DEFAULT_ZOOM = 11.2

export const MIN_ZOOM = 9.5
export const MAX_ZOOM = 16.0

export const DEFAULT_MUMBAI_VIEW = {
  latitude: 18.9950,
  longitude: 72.8400,
  zoom: DEFAULT_ZOOM,
}

// Mumbai Metropolitan Region geographic bounding box [SW, NE]
export const MUMBAI_BOUNDS = [
  [72.7000, 18.8500], // Southwest coordinates [lng, lat]
  [73.1500, 19.3500], // Northeast coordinates [lng, lat]
]

export const MAP_CONFIG = {
  style: DEFAULT_MAP_STYLE,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  maxBounds: MUMBAI_BOUNDS,
  attributionControl: false,
  dragRotate: false,
  pitchWithRotate: false,
}
