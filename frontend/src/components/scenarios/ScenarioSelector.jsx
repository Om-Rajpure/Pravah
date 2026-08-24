import React from 'react'
import { Sliders, AlertTriangle, CloudRain, Ban, RefreshCw, CheckCircle2 } from 'lucide-react'

export function ScenarioSelector({
  scenarios = [],
  selectedScenarioId = 'central-line-disruption',
  onSelectScenario,
  onSimulate,
  onReset,
  loading = false,
  isDisrupted = false
}) {
  const getIcon = (id) => {
    switch (id) {
      case 'central-line-disruption':
        return <AlertTriangle className="w-3.5 h-3.5 text-critical" />
      case 'heavy-rain':
        return <CloudRain className="w-3.5 h-3.5 text-slate" />
      case 'road-closure':
        return <Ban className="w-3.5 h-3.5 text-warning" />
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-low" />
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-3 sm:p-4 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-card-sm bg-terracotta/10 text-terracotta flex items-center justify-center">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            What-If Scenario Injector
          </span>
          <span className="text-xs font-semibold text-text-primary">
            Simulate hypothetical city disruptions & evaluate responses
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Scenario Pill Buttons */}
        <div className="flex items-center gap-1 bg-surface-muted/60 p-1 rounded-card-sm border border-border/80 overflow-x-auto no-scrollbar">
          {scenarios.map((s) => {
            const isSelected = selectedScenarioId === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSelectScenario(s.id)}
                aria-label={`Select Scenario ${s.name}`}
                className={`min-h-[44px] sm:min-h-[32px] px-3 rounded-card-sm text-[11.5px] font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-surface text-text-primary shadow-subtle border border-border'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface/50'
                }`}
              >
                {getIcon(s.id)}
                <span>{s.name}</span>
              </button>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSimulate}
            disabled={loading}
            className="min-h-[44px] sm:min-h-[34px] px-3.5 bg-terracotta text-white hover:bg-terracotta-dark rounded-card-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <span>Simulate What-If</span>
          </button>

          {isDisrupted && (
            <button
              onClick={onReset}
              disabled={loading}
              className="min-h-[44px] sm:min-h-[34px] px-3 bg-surface border border-border text-text-secondary hover:text-text-primary rounded-card-sm text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
