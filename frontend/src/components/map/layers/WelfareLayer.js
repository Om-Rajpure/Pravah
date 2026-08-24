/**
 * Welfare & Civic Support Amenities Layer for MapLibre GL JS
 */

export function setupWelfareLayer(map, welfareGeoJSON) {
  if (!map || !welfareGeoJSON) return

  if (map.getSource('pravaah-welfare-source')) {
    map.getSource('pravaah-welfare-source').setData(welfareGeoJSON)
  } else {
    map.addSource('pravaah-welfare-source', {
      type: 'geojson',
      data: welfareGeoJSON,
    })

    // Welfare Circle Marker
    map.addLayer({
      id: 'pravaah-welfare-circle',
      type: 'circle',
      source: 'pravaah-welfare-source',
      paint: {
        'circle-radius': 5.0,
        'circle-color': [
          'match',
          ['get', 'type'],
          'medical', '#A94338',
          'water', '#536873',
          'toilet', '#B8893D',
          'rest', '#52755F',
          'food', '#B85C3E',
          '#6B6761'
        ],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#FBFAF7'
      }
    })

    // Label
    map.addLayer({
      id: 'pravaah-welfare-labels',
      type: 'symbol',
      source: 'pravaah-welfare-source',
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 9.0,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
        'text-anchor': 'top',
        'text-offset': [0, 0.6],
        'text-optional': true
      },
      paint: {
        'text-color': '#6B6761',
        'text-halo-color': '#FBFAF7',
        'text-halo-width': 1.2
      }
    })
  }
}

export function toggleWelfareLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-welfare-circle')) map.setLayoutProperty('pravaah-welfare-circle', 'visibility', visibility)
  if (map.getLayer('pravaah-welfare-labels')) map.setLayoutProperty('pravaah-welfare-labels', 'visibility', visibility)
}
