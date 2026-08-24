/**
 * PRAVAAH Scenario Engine API Client
 * Phase 9 — What-If Simulation, Scenario Overlays, and 3-Way Scorecards
 */

import axios from 'axios'

const API_BASE = '/api/scenarios'

export async function getScenarios() {
  const res = await axios.get(API_BASE)
  return res.data
}

export async function getScenarioDetail(scenarioId) {
  const res = await axios.get(`${API_BASE}/${scenarioId}`)
  return res.data
}

export async function simulateScenario(scenarioId) {
  const res = await axios.post(`${API_BASE}/simulate`, { scenario_id: scenarioId })
  return res.data
}

export async function activateScenario(scenarioId) {
  const res = await axios.post(`${API_BASE}/activate`, { scenario_id: scenarioId })
  return res.data
}

export async function resetScenario() {
  const res = await axios.post(`${API_BASE}/reset`)
  return res.data
}

export async function getCurrentScenario() {
  const res = await axios.get(`${API_BASE}/current`)
  return res.data
}
