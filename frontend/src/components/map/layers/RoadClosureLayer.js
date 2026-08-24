/**
 * Road Closures & Restrictions Layer configuration for MapLibre GL JS
 */

export function setupRoadClosureLayer(map, roadsGeoJSON) {
  if (!map || !roadsGeoJSON) return

  if (map.getSource('pravaah-roads-source')) {
    map.getSource('pravaah-roads-source').setData(roadsGeoJSON)
  } else {
    map.addSource('pravaah-roads-source', {
      type: 'geojson',
      data: roadsGeoJSON,
    })

    // Road Line Casing
    map.addLayer({
      id: 'pravaah-roads-casing',
      type: 'line',
      source: 'pravaah-roads-source',
      paint: {
        'line-color': '#FBFAF7',
        'line-width': 5.0,
        'line-opacity': 0.9
      }
    })

    // Road Line
    map.addLayer({
      id: 'pravaah-roads-line',
      type: 'line',
      source: 'pravaah-roads-source',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': [
          'case',
          ['!=', ['get', 'status'], 'OPEN'],
          3.5,
          2.5
        ],
        'line-opacity': 0.9
      }
    })

    // Road Status Text / Label
    map.addLayer({
      id: 'pravaah-roads-labels',
      type: 'symbol',
      source: 'pravaah-roads-source',
      filter: ['!=', ['get', 'status'], 'OPEN'],
      layout: {
        'text-field': ['concat', '⚠ ', ['get', 'status']],
        'text-size': 9.5,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'symbol-placement': 'line-center',
        'text-offset': [0, -1]
      },
      paint: {
        'text-color': '#51423D',
        'text-halo-color': '#FBFAF7',
        'text-halo-width': 1.5
      }
    })
  }
}

export function toggleRoadClosureLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-roads-casing')) map.setLayoutProperty('pravaah-roads-casing', 'visibility', visibility)
  if (map.getLayer('pravaah-roads-line')) map.setLayoutProperty('pravaah-roads-line', 'visibility', visibility)
  if (map.getLayer('pravaah-roads-labels')) map.setLayoutProperty('pravaah-roads-labels', 'visibility', visibility)
}
