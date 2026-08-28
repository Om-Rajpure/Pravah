/**
 * PRAVAAH Weather Service
 * Integrates Open-Meteo real-time weather data for Mumbai
 */

import api from '../lib/api'

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const MUMBAI_LAT = 19.0760
const MUMBAI_LON = 72.8777

const WEATHER_CODES = {
  0: { condition: 'Clear sky', icon: '☀️' },
  1: { condition: 'Mainly clear', icon: '🌤️' },
  2: { condition: 'Partly cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Rime fog', icon: '🌫️' },
  51: { condition: 'Light drizzle', icon: '🌦️' },
  53: { condition: 'Drizzle', icon: '🌦️' },
  55: { condition: 'Dense drizzle', icon: '🌧️' },
  61: { condition: 'Slight rain', icon: '🌧️' },
  63: { condition: 'Moderate rain', icon: '🌧️' },
  65: { condition: 'Heavy rain', icon: '🌧️' },
  71: { condition: 'Slight snow', icon: '❄️' },
  73: { condition: 'Moderate snow', icon: '❄️' },
  75: { condition: 'Heavy snow', icon: '❄️' },
  80: { condition: 'Rain showers', icon: '🌦️' },
  81: { condition: 'Moderate showers', icon: '🌧️' },
  82: { condition: 'Violent showers', icon: '⛈️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm + hail', icon: '⛈️' },
  99: { condition: 'Severe thunderstorm', icon: '⛈️' }
}

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { condition: 'Unknown', icon: '🌡️' }
}

function calculateWeatherFactor(weatherCode, rainMm) {
  if (weatherCode >= 95) return 1.25 // Thunderstorm
  if (weatherCode >= 65 || rainMm > 7) return 1.20 // Heavy rain
  if (weatherCode >= 61 || rainMm > 2.5) return 1.15 // Moderate rain
  if (weatherCode >= 51 || rainMm > 0) return 1.10 // Light rain/drizzle
  if (weatherCode >= 45) return 1.05 // Fog
  return 1.0 // Clear/cloudy
}

let weatherCache = null
let cacheTimestamp = 0
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

/**
 * Fetch weather data.
 * First tries the backend /api/weather endpoint.
 * Falls back to calling Open-Meteo directly from frontend (it supports CORS).
 */
export async function getWeather() {
  // Return cached if fresh
  if (weatherCache && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    return { ...weatherCache, cached: true }
  }

  // Try backend first
  try {
    const res = await api.get('/weather')
    weatherCache = res.data
    cacheTimestamp = Date.now()
    return weatherCache
  } catch (_) {
    // Backend unavailable, try direct Open-Meteo
  }

  // Direct Open-Meteo call (CORS supported)
  try {
    const params = new URLSearchParams({
      latitude: MUMBAI_LAT,
      longitude: MUMBAI_LON,
      current: 'temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code',
      hourly: 'temperature_2m,precipitation_probability,precipitation,rain,wind_speed_10m,weather_code',
      timezone: 'Asia/Kolkata',
      forecast_days: 1
    })

    const response = await fetch(`${OPEN_METEO_URL}?${params}`)
    if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`)
    const raw = await response.json()

    const currentCode = raw.current?.weather_code ?? 0
    const currentInfo = getWeatherInfo(currentCode)
    const currentRain = raw.current?.rain ?? 0

    // Find current hour index
    const now = new Date()
    const currentHour = now.getHours()
    const hourlyTimes = raw.hourly?.time || []

    // Get next 6 hours of forecast
    const hourlyForecasts = []
    for (let i = 0; i < hourlyTimes.length && hourlyForecasts.length < 6; i++) {
      const forecastHour = new Date(hourlyTimes[i]).getHours()
      const forecastDate = new Date(hourlyTimes[i])
      if (forecastDate >= now || forecastHour >= currentHour) {
        const code = raw.hourly.weather_code?.[i] ?? 0
        hourlyForecasts.push({
          time: hourlyTimes[i],
          hour: `${String(forecastHour).padStart(2, '0')}:00`,
          temperature: raw.hourly.temperature_2m?.[i] ?? 0,
          rain_probability: raw.hourly.precipitation_probability?.[i] ?? 0,
          rain: raw.hourly.rain?.[i] ?? 0,
          wind_speed: raw.hourly.wind_speed_10m?.[i] ?? 0,
          weather_code: code,
          condition: getWeatherInfo(code).condition,
          icon: getWeatherInfo(code).icon
        })
      }
    }

    const weather = {
      location: {
        name: 'Mumbai',
        latitude: MUMBAI_LAT,
        longitude: MUMBAI_LON,
        timezone: 'Asia/Kolkata'
      },
      current: {
        temperature: raw.current?.temperature_2m ?? 0,
        humidity: raw.current?.relative_humidity_2m ?? 0,
        rain: currentRain,
        precipitation: raw.current?.precipitation ?? 0,
        wind_speed: raw.current?.wind_speed_10m ?? 0,
        weather_code: currentCode,
        condition: currentInfo.condition,
        icon: currentInfo.icon
      },
      hourly: hourlyForecasts,
      weather_factor: calculateWeatherFactor(currentCode, currentRain),
      source: 'Open-Meteo',
      cached: false,
      timestamp: new Date().toISOString()
    }

    weatherCache = weather
    cacheTimestamp = Date.now()
    return weather
  } catch (err) {
    console.error('[PRAVAAH] Weather fetch failed:', err)
    // Return cached if available, null otherwise
    if (weatherCache) return { ...weatherCache, cached: true }
    return null
  }
}

export { getWeatherInfo, calculateWeatherFactor, WEATHER_CODES }
