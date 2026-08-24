/**
 * PRAVAAH Crowd Simulation API Client
 * Phase 5 — Dynamic simulation state and discrete lifecycle control
 */

import axios from 'axios'

const API_BASE = '/api/simulation'

export async function getSimulationState() {
  const res = await axios.get(`${API_BASE}/state`)
  return res.data
}

export async function getSimulationTime() {
  const res = await axios.get(`${API_BASE}/time`)
  return res.data
}

export async function stepSimulation() {
  const res = await axios.post(`${API_BASE}/step`)
  return res.data
}

export async function startSimulation() {
  const res = await axios.post(`${API_BASE}/start`)
  return res.data
}

export async function pauseSimulation() {
  const res = await axios.post(`${API_BASE}/pause`)
  return res.data
}

export async function resetSimulation() {
  const res = await axios.post(`${API_BASE}/reset`)
  return res.data
}
