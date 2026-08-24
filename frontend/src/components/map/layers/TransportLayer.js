/**
 * Transport Layer configuration (Stations and Railway Lines) for MapLibre GL JS
 */

export function setupTransportLayer(map, stationsGeoJSON, linesGeoJSON, selectedStationId = null) {
  if (!map) return

  // 1. Transit Lines
  if (linesGeoJSON) {
    if (map.getSource('pravaah-transit-lines-source')) {
      map.getSource('pravaah-transit-lines-source').setData(linesGeoJSON)
    } else {
      map.addSource('pravaah-transit-lines-source', {
        type: 'geojson',
        data: linesGeoJSON,
      })

      map.addLayer({
        id: 'pravaah-transit-lines',
        type: 'line',
        source: 'pravaah-transit-lines-source',
        paint: {
          'line-color': '#536873',
          'line-width': 2.5,
          'line-opacity': 0.75,
          'line-dasharray': [2, 1]
        }
      })
    }
  }

  // 2. Stations Nodes
  if (stationsGeoJSON) {
    if (map.getSource('pravaah-stations-source')) {
      map.getSource('pravaah-stations-source').setData(stationsGeoJSON)
    } else {
      map.addSource('pravaah-stations-source', {
        type: 'geojson',
        data: stationsGeoJSON,
      })

      // Station Circle Marker
      map.addLayer({
        id: 'pravaah-stations-circle',
        type: 'circle',
        source: 'pravaah-stations-source',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'id'], selectedStationId || ''],
            8.5,
            6.0
          ],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2.0,
          'circle-stroke-color': '#FBFAF7'
        }
      })

      // Station Label
      map.addLayer({
        id: 'pravaah-stations-labels',
        type: 'symbol',
        source: 'pravaah-stations-source',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
          'text-anchor': 'top',
          'text-offset': [0, 0.7],
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
}

export function toggleTransportLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-transit-lines')) map.setLayoutProperty('pravaah-transit-lines', 'visibility', visibility)
  if (map.getLayer('pravaah-stations-circle')) map.setLayoutProperty('pravaah-stations-circle', 'visibility', visibility)
  if (map.getLayer('pravaah-stations-labels')) map.setLayoutProperty('pravaah-stations-labels', 'visibility', visibility)
}
