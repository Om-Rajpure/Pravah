/**
 * PRAVAAH Visitor API Service
 * Phase 13 — Public-safe visitor recommendation client with Timeout & Interceptors
 */

import api from '../lib/api'

export async function getDestinations() {
  const res = await api.get('/visitor/destinations')
  return res.data
}

export async function getDestinationDetail(destinationId) {
  const res = await api.get(`/visitor/destinations/${destinationId}`)
  return res.data
}

export async function getRecommendation(destinationId, preference = 'LESS_CROWDED') {
  const res = await api.post('/visitor/recommendations', {
    destination_id: destinationId,
    preference,
  })
  return res.data
}

export async function getCurrentConditions() {
  const res = await api.get('/visitor/conditions')
  return res.data
}

export async function getPrivacyPolicy() {
  const res = await api.get('/privacy/policy')
  return res.data
}

export async function getDataCatalog() {
  const res = await api.get('/privacy/data-catalog')
  return res.data
}
