/**
 * PRAVAAH Network Engine API Client
 * Phase 6 — Graph-based routing, connectivity inspection, and disruption controls
 */

import axios from 'axios'

const API_BASE = '/api/network'

export async function getNetworkSummary() {
  const res = await axios.get(`${API_BASE}`)
  return res.data
}

export async function getNetworkGeoJSON() {
  const res = await axios.get(`${API_BASE}/geojson`)
  return res.data
}

export async function calculateRoute(source = 'thane', target = 'lalbaug') {
  const res = await axios.get(`${API_BASE}/route`, {
    params: { source, target }
  })
  return res.data
}

export async function getNodeDetails(nodeId) {
  const res = await axios.get(`${API_BASE}/node/${nodeId}`)
  return res.data
}

export async function getEdgeDetails(edgeId) {
  const res = await axios.get(`${API_BASE}/edge/${edgeId}`)
  return res.data
}

export async function closeEdge(edgeId) {
  const res = await axios.post(`${API_BASE}/edge/${edgeId}/close`)
  return res.data
}

export async function openEdge(edgeId) {
  const res = await axios.post(`${API_BASE}/edge/${edgeId}/open`)
  return res.data
}

export async function resetNetwork() {
  const res = await axios.post(`${API_BASE}/reset`)
  return res.data
}
