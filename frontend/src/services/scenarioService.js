/**
 * PRAVAAH Scenario Engine API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getScenarios() {
  const res = await api.get('/scenarios')
  return res.data
}

export async function getScenarioDetail(scenarioId) {
  const res = await api.get(`/scenarios/${scenarioId}`)
  return res.data
}

export async function simulateScenario(scenarioId) {
  const res = await api.post('/scenarios/simulate', { scenario_id: scenarioId })
  return res.data
}

export async function activateScenario(scenarioId) {
  const res = await api.post('/scenarios/activate', { scenario_id: scenarioId })
  return res.data
}

export async function resetScenario() {
  const res = await api.post('/scenarios/reset')
  return res.data
}

export async function getCurrentScenario() {
  const res = await api.get('/scenarios/current')
  return res.data
}
