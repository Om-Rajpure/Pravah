import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bed, Building2, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Train } from 'lucide-react'
import { getVisitorStay } from '../../services/visitorService'

export default function VisitorStay() {
  const [stayData, setStayData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'BUFFER' | 'CORE'

  useEffect(() => {
    getVisitorStay()
      .then(setStayData)
      .catch(err => {
        console.error('Failed to load stay guidance:', err)
        setError('Could not fetch accommodation data.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-xs text-text-muted gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-navy" />
        <span>Loading festival accommodation capacity…</span>
      </div>
    )
  }

  if (error || !stayData) {
    return (
      <div className="bg-surface border border-border rounded-card p-8 text-center space-y-3 max-w-md mx-auto my-10">
        <AlertCircle className="w-5 h-5 text-warning mx-auto" />
        <h3 className="text-sm font-bold text-text-primary">Accommodation Data Unavailable</h3>
        <p className="text-xs text-text-secondary">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-1 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy-soft text-navy flex items-center justify-center">
            <Bed className="w-4 h-4 text-orange" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-text-primary">Visitor Accommodation Guide</h1>
            <p className="text-[11px] text-text-muted">Live room availability & suburban buffer guidance</p>
          </div>
        </div>

        <Link
          to="/visitor"
          className="text-xs text-navy font-semibold hover:underline"
        >
          Destinations
        </Link>
      </div>

      {/* Summary KPI Strip */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-subtle grid grid-cols-3 gap-3 text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Available Rooms</span>
          <span className="text-lg sm:text-2xl font-extrabold text-teal leading-none">
            {stayData.summary.available_rooms?.toLocaleString() || '8,500'}
          </span>
        </div>

        <div className="space-y-0.5 border-x border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Total Monitored</span>
          <span className="text-lg sm:text-2xl font-extrabold text-text-primary leading-none">
            {stayData.summary.total_rooms?.toLocaleString() || '15,000'}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Avg Festival Rate</span>
          <span className="text-lg sm:text-2xl font-extrabold text-navy leading-none">
            ₹{stayData.summary.avg_price_inr?.toLocaleString() || '3,800'}
          </span>
        </div>
      </div>

      {/* Smart Buffer Recommendation Banner */}
      <div className="bg-teal-soft border border-teal/40 rounded-card p-4 shadow-subtle space-y-2">
        <div className="flex items-center gap-2 text-teal-dark">
          <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            PRAVAAH Travel Advice
          </h3>
        </div>
        <p className="text-xs text-text-primary leading-relaxed font-medium">
          {stayData.recommendation}
        </p>
      </div>

      {/* Regional Capacity Comparison Cards */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider px-1">
          Regional Accommodation Hubs
        </h2>

        <div className="space-y-3">
          {stayData.zones?.map((zone, idx) => {
            const isBuffer = zone.region.includes('Suburban')
            return (
              <div 
                key={idx}
                className={`bg-surface border rounded-card p-4 sm:p-5 shadow-subtle space-y-3 ${
                  isBuffer ? 'border-teal/40' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-0.5">
                      {isBuffer ? 'Recommended Buffer Region' : 'High-Density Core'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-text-primary">
                      {zone.region}
                    </h3>
                  </div>

                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${
                    isBuffer ? 'bg-teal-soft text-teal-dark border-teal/40' : 'bg-orange-soft text-orange-dark border-orange/40'
                  }`}>
                    {zone.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-background p-3 rounded-card-sm border border-border/60 text-xs">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-semibold">Occupancy Rate</span>
                    <span className="font-extrabold text-sm text-text-primary">{zone.occupancy_rate}%</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-semibold">Available Rooms</span>
                    <span className="font-extrabold text-sm text-teal">{zone.available_rooms?.toLocaleString()} rooms</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-snug">
                  {zone.advice}
                </p>

                <div className="pt-1 flex items-center justify-between border-t border-border/50 text-xs">
                  <span className="text-text-muted flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-navy" />
                    <span>Direct Fast Trains to Dadar / Parel</span>
                  </span>

                  <Link
                    to="/visitor/route?from=stn-thane&to=lalbaugcha-raja"
                    className="text-navy font-semibold hover:underline inline-flex items-center gap-1 text-xs"
                  >
                    <span>View Transit Route</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-text-muted">
          Aggregated hotel occupancy data &middot; Updated hourly &middot; No individual booking data stored
        </p>
      </div>
    </div>
  )
}
