/**
 * PRAVAAH Prediction Engine API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getPredictions(zoneId = null) {
  const params = zoneId ? { zone: zoneId } : {}
  const res = await api.get('/predictions', { params })
  return res.data
}

export async function getPredictionsOverview() {
  const res = await api.get('/predictions/overview')
  return res.data
}

export async function getZonePrediction(zoneId) {
  const res = await api.get(`/predictions/zone/${zoneId}`)
  return res.data
}
