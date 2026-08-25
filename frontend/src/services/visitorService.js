/**
 * PRAVAAH Visitor API Service
 * Phase 11 — Public-safe visitor recommendation client
 */

import axios from 'axios'

export async function getDestinations() {
  const res = await axios.get('/api/visitor/destinations')
  return res.data
}

export async function getDestinationDetail(destinationId) {
  const res = await axios.get(`/api/visitor/destinations/${destinationId}`)
  return res.data
}

export async function getRecommendation(destinationId, preference = 'LESS_CROWDED') {
  const res = await axios.post('/api/visitor/recommendations', {
    destination_id: destinationId,
    preference,
  })
  return res.data
}

export async function getCurrentConditions() {
  const res = await axios.get('/api/visitor/conditions')
  return res.data
}

export async function getPrivacyPolicy() {
  const res = await axios.get('/api/privacy/policy')
  return res.data
}

export async function getDataCatalog() {
  const res = await axios.get('/api/privacy/data-catalog')
  return res.data
}
