/**
 * PRAVAAH Explainability & Decision Audit API Client
 * Phase 10 — Glass Box reasoning, decision trace, and audit logs
 */

import axios from 'axios'

export async function getPredictionExplanation(zoneId = 'curry-road', detail = 'operational') {
  const res = await axios.get(`/api/explanations/prediction/${zoneId}`, {
    params: { detail }
  })
  return res.data
}

export async function getInterventionExplanation(actionId = 'act-redirect-curry-road-thane-18', detail = 'operational') {
  const res = await axios.get(`/api/explanations/intervention/${actionId}`, {
    params: { detail }
  })
  return res.data
}

export async function getAuditTrail(type = null) {
  const params = type && type !== 'ALL' ? { type } : {}
  const res = await axios.get('/api/audit', { params })
  return res.data
}
