/**
 * PRAVAAH Action & Intervention Engine API Client
 * Phase 8 — Multi-candidate recommendations, counterfactual simulation, and approvals
 */

import axios from 'axios'

const API_BASE = '/api/actions'

export async function getActionRecommendations() {
  const res = await axios.get(`${API_BASE}/recommendations`)
  return res.data
}

export async function simulateAction(actionId) {
  const res = await axios.post(`${API_BASE}/simulate`, { action_id: actionId })
  return res.data
}

export async function approveAction(actionId) {
  const res = await axios.post(`${API_BASE}/${actionId}/approve`)
  return res.data
}

export async function resetActions() {
  const res = await axios.post(`${API_BASE}/reset`)
  return res.data
}
