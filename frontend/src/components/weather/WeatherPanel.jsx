import React, { useState, useEffect } from 'react'
import { Cloud, Droplets, Wind, AlertCircle } from 'lucide-react'
import { getWeather } from '../../services/weatherService'
import { DataSourceBadge } from '../ui/DataSourceBadge'

export function WeatherPanel() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchWeather() {
      try {
        setLoading(true)
        const data = await getWeather()
        if (isMounted) {
          if (data) {
            setWeather(data)
            setError(false)
          } else {
            setError(true)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(true)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading && !weather) {
    return (
      <div className="bg-surface border border-border rounded-[14px] p-5 w-full text-[13px] text-text-muted flex items-center justify-center min-h-[100px]">
        Loading Mumbai weather telemetry...
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-surface border border-border rounded-[14px] p-5 w-full text-[13px] text-text-muted flex flex-col items-center justify-center min-h-[100px] gap-2">
        <AlertCircle size={18} className="text-warning" />
        <span>Weather telemetry temporarily offline</span>
      </div>
    )
  }

  const impactValue = Math.round((weather.weather_factor - 1.0) * 100)
  const impactText = impactValue > 0 ? `+${impactValue}% crowd pressure` : 'Normal Flow'

  return (
    <div className="bg-surface border border-border rounded-[14px] p-4 sm:p-5 flex flex-col gap-3.5 w-full shadow-subtle">
      {/* Top row: Condition & Live Badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="text-[34px] leading-none" title={weather.current.condition}>
            {weather.current.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] sm:text-[36px] font-bold text-text-primary leading-none tracking-tight">
              {Math.round(weather.current.temperature)}°C
            </span>
            <span className="text-[14px] font-medium text-text-secondary mt-1">
              {weather.current.condition}
            </span>
          </div>
        </div>
        <DataSourceBadge type="live" source={weather.source || 'Open-Meteo'} />
      </div>

      {/* Weather Sub-Metrics */}
      <div className="flex items-center justify-between text-[12px] sm:text-[13px] text-text-secondary border-t border-border/60 pt-3">
        <div className="flex items-center gap-1.5" title="Humidity">
          <Droplets size={14} className="text-teal" />
          <span>{weather.current.humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-1.5" title="Wind">
          <Wind size={14} className="text-teal" />
          <span>{Math.round(weather.current.wind_speed)} km/h</span>
        </div>
        <div className="flex items-center gap-1.5" title="Precipitation">
          <Cloud size={14} className="text-teal" />
          <span>{weather.current.rain || 0} mm</span>
        </div>
      </div>

      {/* 3-Hour Forecast Chips */}
      {weather.hourly && weather.hourly.length > 0 && (
        <div className="flex gap-2 justify-between border-t border-border/60 pt-3">
          {weather.hourly.slice(0, 3).map((hour, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 text-[12px]">
              <span className="text-text-muted text-[11px]">{hour.hour}</span>
              <span className="text-base">{hour.icon}</span>
              <span className="font-semibold text-text-primary">{Math.round(hour.temperature)}°</span>
            </div>
          ))}
        </div>
      )}

      {/* Weather Impact */}
      <div className="text-[12px] sm:text-[13px] font-medium text-text-secondary bg-surface-subtle p-2.5 rounded-[8px] border border-border flex justify-between items-center">
        <span>Weather Impact:</span>
        <span className={`${impactValue > 0 ? 'text-warning font-semibold' : 'text-teal font-semibold'}`}>
          {impactText}
        </span>
      </div>
    </div>
  )
}
