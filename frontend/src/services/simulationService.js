/**
 * PRAVAAH Crowd Simulation API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getSimulationState() {
  const res = await api.get('/simulation/state')
  return res.data
}

export async function getSimulationTime() {
  const res = await api.get('/simulation/time')
  return res.data
}

export async function stepSimulation() {
  const res = await api.post('/simulation/step')
  return res.data
}

export async function startSimulation() {
  const res = await api.post('/simulation/start')
  return res.data
}

export async function pauseSimulation() {
  const res = await api.post('/simulation/pause')
  return res.data
}

export async function resetSimulation() {
  const res = await api.post('/simulation/reset')
  return res.data
}
