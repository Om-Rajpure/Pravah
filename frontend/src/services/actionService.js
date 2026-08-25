/**
 * PRAVAAH Action & Intervention Engine API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getActionRecommendations() {
  const res = await api.get('/actions/recommendations')
  return res.data
}

export async function simulateAction(actionId) {
  const res = await api.post('/actions/simulate', { action_id: actionId })
  return res.data
}

export async function approveAction(actionId) {
  const res = await api.post(`/actions/${actionId}/approve`)
  return res.data
}

export async function resetActions() {
  const res = await api.post('/actions/reset')
  return res.data
}
