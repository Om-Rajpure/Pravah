import React from 'react'

export function MapLegend({ mode = 'CURRENT', horizon = 60, isAfter = false, hasDisruption = false }) {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-surface/95 backdrop-blur-md border border-border rounded-card p-2.5 sm:p-3 shadow-elevated text-[11px] max-w-[260px] animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-border/60">
        <span className="text-[10px] uppercase font-bold text-text-primary tracking-wider">
          {mode === 'CURRENT' && 'Live Crowd Pressure'}
          {mode === 'FORECAST' && `Forecast (+${horizon}m)`}
          {mode === 'NETWORK' && 'Transit Network'}
          {mode === 'DISRUPTIONS' && 'Disruption Overlay'}
          {mode === 'INTERVENTION' && 'Intervention Corridor'}
          {mode === 'WHAT_IF' && (isAfter ? 'Counterfactual Impact' : 'Baseline Pressure')}
        </span>
        <span className="text-[9.5px] font-mono text-text-muted">PRAVAAH</span>
      </div>

      {/* Pressure scale (Current, Forecast, What-If) */}
      {(mode === 'CURRENT' || mode === 'FORECAST' || mode === 'WHAT_IF') && (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-critical flex-shrink-0"></span>
            <span className="text-text-primary font-medium">Critical (≥85)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange flex-shrink-0"></span>
            <span className="text-text-primary font-medium">High (70–84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning flex-shrink-0"></span>
            <span className="text-text-primary font-medium">Mod (50–69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal flex-shrink-0"></span>
            <span className="text-text-primary font-medium">Low (&lt;50)</span>
          </div>
        </div>
      )}

      {/* Network mode legend */}
      {mode === 'NETWORK' && (
        <div className="space-y-1 text-[10px] text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-brand-blue rounded-full"></span>
            <span>Central Railway Mainline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-teal rounded-full"></span>
            <span>Western Railway Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border-2 border-navy bg-white"></span>
            <span>Key Transit Station Hubs</span>
          </div>
        </div>
      )}

      {/* Disruption mode legend */}
      {mode === 'DISRUPTIONS' && (
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-2 text-critical font-semibold">
            <span className="w-3.5 h-1 bg-critical border-dashed border-b border-white"></span>
            <span>⚠ Blocked / Disrupted Corridor</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-3.5 h-1 bg-teal"></span>
            <span>Operational Transit Path</span>
          </div>
        </div>
      )}

      {/* Intervention mode legend */}
      {mode === 'INTERVENTION' && (
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-2 text-orange-dark font-semibold">
            <span className="w-3.5 h-1.5 bg-orange rounded"></span>
            <span>18% Recommended Redirection Flow</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-teal"></span>
            <span>Suburban Buffer Destination (Thane)</span>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-1.5 pt-1 border-t border-border/50 text-[9px] text-text-muted flex justify-between">
        <span>Click zone/station to inspect</span>
        <span>Carto Positron</span>
      </div>
    </div>
  )
}
