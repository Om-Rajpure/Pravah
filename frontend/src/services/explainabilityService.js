/**
 * PRAVAAH Explainability & Decision Audit API Client
 * Phase 13 — Standardized Axios Client with Timeout & Error Handling
 */

import api from '../lib/api'

export async function getPredictionExplanation(zoneId = 'curry-road', detail = 'operational') {
  const res = await api.get(`/explanations/prediction/${zoneId}`, {
    params: { detail }
  })
  return res.data
}

export async function getInterventionExplanation(actionId = 'act-redirect-curry-road-thane-18', detail = 'operational') {
  const res = await api.get(`/explanations/intervention/${actionId}`, {
    params: { detail }
  })
  return res.data
}

export async function getAuditTrail(type = null) {
  const params = type && type !== 'ALL' ? { type } : {}
  const res = await api.get('/audit', { params })
  return res.data
}
