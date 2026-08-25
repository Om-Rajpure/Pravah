/**
 * PRAVAAH Demo Mode Service
 * Phase 12 — Demo controls, status polling, event sequencing
 */

import axios from 'axios'

export async function getDemoStatus() {
  const res = await axios.get('/api/demo/status')
  return res.data
}

export async function resetDemo() {
  const res = await axios.post('/api/demo/reset')
  return res.data
}

export async function nextDemoEvent() {
  const res = await axios.post('/api/demo/next-event')
  return res.data
}

export async function getHealth() {
  const res = await axios.get('/api/health')
  return res.data
}
