/**
 * PRAVAAH Prediction Engine API Client
 * Phase 7 — Multi-horizon pressure forecasts, explainability drivers, and zone trajectories
 */

import axios from 'axios'

const API_BASE = '/api/predictions'

export async function getPredictions(zoneId = null) {
  const params = zoneId ? { zone: zoneId } : {}
  const res = await axios.get(API_BASE, { params })
  return res.data
}

export async function getPredictionsOverview() {
  const res = await axios.get(`${API_BASE}/overview`)
  return res.data
}

export async function getZonePrediction(zoneId) {
  const res = await axios.get(`${API_BASE}/zone/${zoneId}`)
  return res.data
}
