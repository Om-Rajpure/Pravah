/**
 * PRAVAAH Demo Mode Service
 * Phase 13 — Demo controls, readiness, and status polling
 */

import api from '../lib/api'

export async function getDemoStatus() {
  const res = await api.get('/demo/status')
  return res.data
}

export async function resetDemo() {
  const res = await api.post('/demo/reset')
  return res.data
}

export async function nextDemoEvent() {
  const res = await api.post('/demo/next-event')
  return res.data
}

export async function getHealth() {
  const res = await api.get('/health')
  return res.data
}

export async function getReadiness() {
  const res = await api.get('/ready')
  return res.data
}
