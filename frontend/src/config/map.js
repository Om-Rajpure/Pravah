/**
 * PRAVAAH Central Map Configuration
 * MapLibre GL JS + OpenStreetMap raster tiles (primary, zero API key, always works)
 * OpenFreeMap vector style (optional, attempted on load success)
 */

// Primary: OpenStreetMap Standard Raster — inline style object, zero network round-trip
// OSM tiles are free, no API key needed, and display real Mumbai geography
export const OSM_RASTER_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
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

// Secondary (lighter, clean light style): Stamen Toner-Lite via OSM
// Same as OSM_RASTER_STYLE — kept as alias for fallback
export const FALLBACK_STYLE = OSM_RASTER_STYLE

// Default style: OSM raster — guaranteed to work everywhere, no API key
export const DEFAULT_MAP_STYLE = OSM_RASTER_STYLE

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
  [72.6, 18.75],  // Southwest [lng, lat]
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
