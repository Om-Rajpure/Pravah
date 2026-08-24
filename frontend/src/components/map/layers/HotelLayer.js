/**
 * Hotel Cluster Layer configuration for MapLibre GL JS
 */

export function setupHotelLayer(map, hotelsGeoJSON) {
  if (!map || !hotelsGeoJSON) return

  if (map.getSource('pravaah-hotels-source')) {
    map.getSource('pravaah-hotels-source').setData(hotelsGeoJSON)
  } else {
    map.addSource('pravaah-hotels-source', {
      type: 'geojson',
      data: hotelsGeoJSON,
    })

    // Outer Halo
    map.addLayer({
      id: 'pravaah-hotels-halo',
      type: 'circle',
      source: 'pravaah-hotels-source',
      paint: {
        'circle-radius': 9.0,
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.25,
        'circle-stroke-width': 1.0,
        'circle-stroke-color': ['get', 'color']
      }
    })

    // Inner Core Marker
    map.addLayer({
      id: 'pravaah-hotels-circle',
      type: 'circle',
      source: 'pravaah-hotels-source',
      paint: {
        'circle-radius': 5.0,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#FBFAF7'
      }
    })

    // Label
    map.addLayer({
      id: 'pravaah-hotels-labels',
      type: 'symbol',
      source: 'pravaah-hotels-source',
      layout: {
        'text-field': ['concat', ['get', 'name'], '\n', ['get', 'occupancy_rate'], '% occ'],
        'text-size': 9.5,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
        'text-anchor': 'bottom',
        'text-offset': [0, -0.8],
        'text-optional': true
      },
      paint: {
        'text-color': '#292827',
        'text-halo-color': '#FBFAF7',
        'text-halo-width': 1.2
      }
    })
  }
}

export function toggleHotelLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-hotels-halo')) map.setLayoutProperty('pravaah-hotels-halo', 'visibility', visibility)
  if (map.getLayer('pravaah-hotels-circle')) map.setLayoutProperty('pravaah-hotels-circle', 'visibility', visibility)
  if (map.getLayer('pravaah-hotels-labels')) map.setLayoutProperty('pravaah-hotels-labels', 'visibility', visibility)
}
