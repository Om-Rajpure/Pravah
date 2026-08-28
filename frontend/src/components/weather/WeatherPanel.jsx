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
      <div className="bg-surface border border-border rounded-card p-4 w-full text-sm text-text-muted flex items-center justify-center min-h-[80px]">
        Loading weather...
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-surface border border-border rounded-card p-4 w-full text-sm text-text-muted flex flex-col items-center justify-center min-h-[80px] gap-2">
        <AlertCircle size={16} className="text-warning" />
        <span>Weather temporarily unavailable</span>
      </div>
    )
  }

  const impactValue = Math.round((weather.weather_factor - 1.0) * 100)
  const impactText = impactValue > 0 ? `+${impactValue}% crowd pressure` : 'Normal'

  return (
    <div className="bg-surface border border-border rounded-card p-4 flex flex-col gap-3 w-full shadow-subtle">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="text-3xl leading-none" title={weather.current.condition}>
            {weather.current.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-text-primary">
              {Math.round(weather.current.temperature)}°C
            </span>
            <span className="text-xs font-medium text-text-secondary">
              {weather.current.condition}
            </span>
          </div>
        </div>
        <DataSourceBadge type="live" source={weather.source} />
      </div>

      <div className="flex items-center gap-4 text-[11px] text-text-secondary border-t border-border/60 pt-2.5">
        <div className="flex items-center gap-1" title="Humidity">
          <Droplets size={13} className="text-low" />
          <span>{weather.current.humidity}%</span>
        </div>
        <div className="flex items-center gap-1" title="Wind">
          <Wind size={13} className="text-low" />
          <span>{Math.round(weather.current.wind_speed)} km/h</span>
        </div>
        <div className="flex items-center gap-1" title="Precipitation">
          <Cloud size={13} className="text-low" />
          <span>{weather.current.rain} mm</span>
        </div>
      </div>

      <div className="flex gap-2 justify-between border-t border-border/60 pt-2.5">
        {weather.hourly.slice(0, 3).map((hour, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 text-[11px]">
            <span className="text-text-muted">{hour.hour}</span>
            <span className="text-base">{hour.icon}</span>
            <span className="font-medium text-text-primary">{Math.round(hour.temperature)}°</span>
          </div>
        ))}
      </div>

      <div className="text-[11px] font-medium text-text-secondary bg-surface-muted/50 p-2 rounded-card-sm flex justify-between items-center">
        <span>Weather Impact:</span>
        <span className={`${impactValue > 0 ? 'text-warning font-semibold' : 'text-low'}`}>
          {impactText}
        </span>
      </div>
    </div>
  )
}
