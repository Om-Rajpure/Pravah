/**
 * Crowd Flow Layer Architecture for MapLibre GL JS
 * Prepared for Phase 4+ Dynamic Simulation
 */

export function setupCrowdFlowLayer(map, flowGeoJSON) {
  if (!map) return

  if (flowGeoJSON && map.getSource('pravaah-flow-source')) {
    map.getSource('pravaah-flow-source').setData(flowGeoJSON)
  }
}

export function toggleCrowdFlowLayer(map, visible) {
  if (!map) return
  const visibility = visible ? 'visible' : 'none'
  if (map.getLayer('pravaah-flow-lines')) {
    map.setLayoutProperty('pravaah-flow-lines', 'visibility', visibility)
  }
}
