/**
 * Pressure Layer configuration for MapLibre GL JS
 */

export function setupPressureLayer(map, geojsonData, selectedZoneId = null) {
  if (!map || !geojsonData) return

  // 1. Add or Update Source
  if (map.getSource('pravaah-zones-source')) {
    map.getSource('pravaah-zones-source').setData(geojsonData)
  } else {
    map.addSource('pravaah-zones-source', {
      type: 'geojson',
      data: geojsonData,
    })

    // Zone Fill Layer (Translucent to keep base map geography visible)
    map.addLayer({
      id: 'pravaah-zones-fill',
      type: 'fill',
      source: 'pravaah-zones-source',
      paint: {
        'fill-color': ['get', 'fill_color'],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.45,
          ['==', ['get', 'id'], selectedZoneId || ''],
          0.50,
          0.28
        ]
      }
    })

    // Zone Boundary Outline Layer
    map.addLayer({
      id: 'pravaah-zones-outline',
      type: 'line',
      source: 'pravaah-zones-source',
      paint: {
        'line-color': ['get', 'border_color'],
        'line-width': [
          'case',
          ['==', ['get', 'id'], selectedZoneId || ''],
          3.0,
          ['boolean', ['feature-state', 'hover'], false],
          2.2,
          1.2
        ],
        'line-opacity': 0.85
      }
    })

    // Zone Label Symbol Layer
    map.addLayer({
      id: 'pravaah-zones-labels',
      type: 'symbol',
      source: 'pravaah-zones-source',
      layout: {
        'text-field': ['concat', ['get', 'name'], '\n', ['get', 'pressure'], '/100'],
        'text-size': 11,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-anchor': 'center',
        'text-offset': [0, 0],
        'text-allow-overlap': false
      },
      paint: {
        'text-color': '#292827',
        'text-halo-color': '#FBFAF7',
        'text-halo-width': 1.5
      }
    })
  }
}

export function updatePressureSelection(map, selectedZoneId) {
  if (!map || !map.getLayer('pravaah-zones-fill')) return

  map.setPaintProperty('pravaah-zones-fill', 'fill-opacity', [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.45,
    ['==', ['get', 'id'], selectedZoneId || ''],
    0.50,
    0.28
  ])

  map.setPaintProperty('pravaah-zones-outline', 'line-width', [
    'case',
    ['==', ['get', 'id'], selectedZoneId || ''],
    3.0,
    ['boolean', ['feature-state', 'hover'], false],
    2.2,
    1.2
  ])
}

export function togglePressureLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-zones-fill')) map.setLayoutProperty('pravaah-zones-fill', 'visibility', visibility)
  if (map.getLayer('pravaah-zones-outline')) map.setLayoutProperty('pravaah-zones-outline', 'visibility', visibility)
  if (map.getLayer('pravaah-zones-labels')) map.setLayoutProperty('pravaah-zones-labels', 'visibility', visibility)
}
