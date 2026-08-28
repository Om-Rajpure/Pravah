import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react'
import api from '../../lib/api'
import { getWeather } from '../../services/weatherService'

export function SystemStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState({
    frontend: true,
    backend: null,
    weather: null,
    map: null
  })

  useEffect(() => {
    async function checkStatus() {
      // Check backend
      let backendOk = false
      try {
        await api.get('/health', { timeout: 3000 })
        backendOk = true
      } catch (err) {
        backendOk = false
      }

      // Check weather
      let weatherOk = false
      try {
        const weather = await getWeather()
        weatherOk = !!weather
      } catch (err) {
        weatherOk = false
      }

      // Check map
      let mapOk = false
      try {
        const maplibre = await import('maplibre-gl')
        mapOk = !!maplibre
      } catch (err) {
        mapOk = false
      }

      setStatus(prev => ({
        ...prev,
        backend: backendOk,
        weather: weatherOk,
        map: mapOk
      }))
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const allGood = status.backend && status.weather && status.map

  const StatusIcon = ({ ok }) => {
    if (ok === null) return <span className="w-4 h-4 rounded-full bg-surface-muted animate-pulse" />
    return ok ? <CheckCircle2 size={16} className="text-[#2D9C8F]" /> : <XCircle size={16} className="text-critical" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-surface border border-border rounded-card shadow-elevated flex flex-col w-64 text-sm font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 w-full text-left"
      >
        <div className="flex items-center gap-2">
          <StatusIcon ok={allGood} />
          <span className="font-semibold text-text-primary">System Status</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronUp size={16} className="text-text-muted" />}
      </button>

      {isOpen && (
        <div className="p-3 border-t border-border flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Frontend UI</span>
            <StatusIcon ok={status.frontend} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Backend API</span>
            <StatusIcon ok={status.backend} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Weather Service</span>
            <StatusIcon ok={status.weather} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">MapLibre GL</span>
            <StatusIcon ok={status.map} />
          </div>
        </div>
      )}
    </div>
  )
}
