import React, { useState, useEffect } from 'react'
import { GitBranch, AlertTriangle, CheckCircle2, ArrowRight, RotateCcw, Clock, Navigation } from 'lucide-react'
import { calculateRoute, closeEdge, openEdge, resetNetwork } from '../../services/networkService'

export function NetworkDemoPanel({ className = '' }) {
  const [routeData, setRouteData] = useState(null)
  const [isDisrupted, setIsDisrupted] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchRoute = async () => {
    try {
      setLoading(true)
      const data = await calculateRoute('thane', 'lalbaug')
      setRouteData(data)
    } catch (err) {
      console.error('Failed to fetch network route:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoute()
  }, [])

  const handleDisrupt = async () => {
    setLoading(true)
    try {
      const closedEdgeId = 'edge-stn-curry-road-loc-lalbaugcha-raja'
      await closeEdge(closedEdgeId)
      setIsDisrupted(true)
      await fetchRoute()
    } catch (err) {
      console.error('Disruption failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setLoading(true)
    try {
      await resetNetwork()
      setIsDisrupted(false)
      await fetchRoute()
    } catch (err) {
      console.error('Network restore failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const primary = routeData?.primary_route
  const alt = routeData?.alternative_route

  return (
    <div className={`bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-card-sm bg-slate/10 text-slate flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Dynamic Network Connectivity</h3>
            <span className="text-[11px] text-text-secondary">Route-aware crowd movement & live disruption simulation</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDisrupted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-critical-bg text-critical border border-critical/30">
              <AlertTriangle className="w-3 h-3" /> Connection Disrupted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-low/15 text-low border border-low/30">
              <CheckCircle2 className="w-3 h-3" /> Network Optimal
            </span>
          )}
        </div>
      </div>

      {/* Corridor Route Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Active Route Card */}
        <div className={`p-3.5 rounded-card-sm border transition-all ${
          isDisrupted 
            ? 'bg-critical-bg/20 border-critical/40' 
            : 'bg-surface-muted/50 border-border/80'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
              {isDisrupted ? 'Disrupted Central Route' : 'Primary Transit Corridor'}
            </span>
            <span className="text-[12px] font-bold font-mono text-text-primary">
              {primary ? `${primary.total_travel_time_min} min` : '—'}
            </span>
          </div>
          <div className="text-[12.5px] font-semibold text-text-primary mb-2 flex items-center gap-1.5 flex-wrap">
            <span>Thane</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span>Dadar Central</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span className={isDisrupted ? 'line-through text-critical' : ''}>Curry Road</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span>Lalbaugcha Raja</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            {isDisrupted 
              ? 'Pedestrian egress at Curry Road is closed due to platform bottleneck.' 
              : 'Fastest direct rail transit via Central Mainline.'}
          </p>
        </div>

        {/* Dynamic Alternative Route Card */}
        <div className={`p-3.5 rounded-card-sm border transition-all ${
          isDisrupted 
            ? 'bg-terracotta-soft/60 border-terracotta' 
            : 'bg-surface-muted/20 border-border/50 opacity-80'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase font-bold text-terracotta-dark tracking-wider">
              PRAVAAH Recalculated Alternative
            </span>
            <span className="text-[12px] font-bold font-mono text-text-primary">
              {alt ? `${alt.total_travel_time_min} min` : '—'}
            </span>
          </div>
          <div className="text-[12.5px] font-semibold text-text-primary mb-2 flex items-center gap-1.5 flex-wrap">
            <span>Thane</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span>Dadar TT</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span>Bharat Mata Junction</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted inline" />
            <span>Lalbaug</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            {isDisrupted
              ? 'Diverting incoming flow along Bharat Mata eastern roadway corridor (+8 min travel time).'
              : 'Standby alternate corridor via Dr. Ambedkar Road arterial.'}
          </p>
        </div>
      </div>

      {/* Demonstration Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2 border-t border-border/60">
        <span className="text-[11px] text-text-muted">
          Simulate real-time network resilience and alternative route discovery:
        </span>
        <div className="flex items-center gap-2">
          {isDisrupted ? (
            <button
              onClick={handleRestore}
              disabled={loading}
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[34px] px-4 bg-terracotta text-white hover:bg-terracotta-dark rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Connection</span>
            </button>
          ) : (
            <button
              onClick={handleDisrupt}
              disabled={loading}
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[34px] px-4 bg-surface border border-critical/50 text-critical hover:bg-critical-bg/30 rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Disrupt Curry Road Link</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
