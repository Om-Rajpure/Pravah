/**
 * PRAVAAH Central Map Configuration
 * High-reliability, sub-second initialization using inline raster style objects.
 * Eliminates remote style.json and PBF fontstack download latency.
 */

// 1. Primary: Carto Positron Raster (Ultra-clean civic look, loads in < 500ms)
export const CARTO_POSITRON_RASTER = {
  version: 8,
  sources: {
    'carto-positron': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-positron-base',
      type: 'raster',
      source: 'carto-positron',
      minzoom: 0,
      maxzoom: 19
    }
  ]
}

// 2. Secondary Fast Fallback: OpenStreetMap Standard
export const OSM_RASTER = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-base',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
}

// Default in-memory style object (Zero network style.json round-trip!)
export const DEFAULT_MAP_STYLE = CARTO_POSITRON_RASTER

// Central Mumbai operational view [lng, lat]
export const DEFAULT_CENTER = [72.84, 18.995]

export const DEFAULT_ZOOM         = 11.6
export const DESKTOP_DEFAULT_ZOOM = 11.6
export const MOBILE_DEFAULT_ZOOM  = 10.8
export const TABLET_DEFAULT_ZOOM  = 11.2

export const MIN_ZOOM = 9.0
export const MAX_ZOOM = 18.0

export const DEFAULT_MUMBAI_VIEW = {
  latitude: 18.995,
  longitude: 72.84,
  zoom: DEFAULT_ZOOM,
}

// Mumbai Metropolitan Region bounding box [SW, NE]
export const MUMBAI_BOUNDS = [
  [72.6, 18.75], // Southwest [lng, lat]
  [73.25, 19.45], // Northeast [lng, lat]
]

export const MAP_CONFIG = {
  style:              DEFAULT_MAP_STYLE,
  center:             DEFAULT_CENTER,
  zoom:               DEFAULT_ZOOM,
  minZoom:            MIN_ZOOM,
  maxZoom:            MAX_ZOOM,
  maxBounds:          MUMBAI_BOUNDS,
  attributionControl: false,
  dragRotate:         false,
  pitchWithRotate:    false,
}
