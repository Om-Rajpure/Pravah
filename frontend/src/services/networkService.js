/**
 * PRAVAAH Network Engine API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getNetworkSummary() {
  const res = await api.get('/network')
  return res.data
}

export async function getNetworkGeoJSON() {
  const res = await api.get('/network/geojson')
  return res.data
}

export async function calculateRoute(source = 'thane', target = 'lalbaug') {
  const res = await api.get('/network/route', {
    params: { source, target }
  })
  return res.data
}

export async function getNodeDetails(nodeId) {
  const res = await api.get(`/network/node/${nodeId}`)
  return res.data
}

export async function getEdgeDetails(edgeId) {
  const res = await api.get(`/network/edge/${edgeId}`)
  return res.data
}

export async function closeEdge(edgeId) {
  const res = await api.post(`/network/edge/${edgeId}/close`)
  return res.data
}

export async function openEdge(edgeId) {
  const res = await api.post(`/network/edge/${edgeId}/open`)
  return res.data
}

export async function resetNetwork() {
  const res = await api.post('/network/reset')
  return res.data
}
