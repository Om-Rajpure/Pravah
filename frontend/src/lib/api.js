import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  response => response,
  error => {
    const errorData = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network request failed'
    }
    return Promise.reject(errorData)
  }
)

export const checkHealth = () => api.get('/health').then(r => r.data)
export const checkReadiness = () => api.get('/ready').then(r => r.data)
export const getOverview = () => api.get('/overview').then(r => r.data)
export const getZones = () => api.get('/zones').then(r => r.data)
export const getZone = (id) => api.get(`/zones/${id}`).then(r => r.data)
export const getHotels = () => api.get('/hotels').then(r => r.data)
export const getTransport = () => api.get('/transport').then(r => r.data)
export const getMapState = () => api.get('/map/state').then(r => r.data)
export const getWelfare = () => api.get('/welfare').then(r => r.data)
export const getWeather = () => api.get('/weather').then(r => r.data)

/**
 * Check if the backend API is reachable.
 * Returns true if healthy, false otherwise.
 */
export async function isBackendReachable() {
  try {
    await api.get('/health', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

export default api
