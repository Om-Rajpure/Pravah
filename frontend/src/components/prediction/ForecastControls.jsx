import React from 'react'
import { Clock } from 'lucide-react'

export function ForecastControls({ selectedHorizon = 0, onSelectHorizon }) {
  const horizons = [
    { value: 0, label: 'NOW', subtitle: 'Live observed' },
    { value: 30, label: '+30m', subtitle: 'Short-term' },
    { value: 60, label: '+60m', subtitle: '1 Hour' },
    { value: 120, label: '+120m', subtitle: '~2 Hours' },
    { value: 180, label: '+180m', subtitle: '~3 Hours' },
  ]

  return (
    <div className="bg-surface border border-border rounded-card p-2 sm:p-2.5 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-4 h-4 text-terracotta" />
        <div>
          <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block leading-none">
            Temporal Horizon
          </span>
          <span className="text-[11.5px] font-medium text-text-secondary">
            {selectedHorizon === 0 ? 'Live Observed Telemetry' : `Projected Network State (+${selectedHorizon} min)`}
          </span>
        </div>
      </div>

      {/* Segmented Horizon Pills (Touch Targets >= 44px on Mobile) */}
      <div className="flex items-center gap-1 bg-surface-muted/60 p-1 rounded-card-sm border border-border/80 overflow-x-auto no-scrollbar">
        {horizons.map((h) => {
          const isSelected = selectedHorizon === h.value
          return (
            <button
              key={h.value}
              onClick={() => onSelectHorizon(h.value)}
              aria-label={`Select Forecast Horizon ${h.label}`}
              className={`flex-1 sm:flex-initial min-h-[44px] sm:min-h-[32px] px-3.5 rounded-card-sm text-[11.5px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-terracotta/30 ${
                isSelected
                  ? 'bg-surface text-text-primary shadow-subtle border border-border'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface/50'
              }`}
            >
              <span>{h.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
