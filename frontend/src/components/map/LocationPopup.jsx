import React from 'react'
import { X, ArrowRight, Activity, TrainFront, Hotel, HeartHandshake, ShieldAlert, Train } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { Button } from '../ui/Button'

export function LocationPopup({ feature, onClose, onSimulateAction }) {
  if (!feature) return null

  const { type, properties } = feature

  // 1. Train Feature Popup (Local 12-Car Rake Simulation)
  if (type === 'train' || properties?.line !== undefined) {
    const cl = properties.classification || { color: '#2563EB', formatted_label: `${properties.occupancy || 1400} (70%)`, category: 'HEAVY' }
    return (
      <div className="w-[280px] sm:w-[310px] bg-surface border border-border rounded-card shadow-elevated p-4 text-[12px] animate-in fade-in zoom-in-95 duration-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-card-sm bg-navy text-white">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-text-muted">12-Car Local Rake</span>
              <h3 className="text-[14px] font-bold text-text-primary leading-tight">{properties.name || properties.id}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Train Metrics */}
        <div className="space-y-2 my-2.5">
          <div className="bg-surface-muted/60 p-2 rounded-card-sm border border-border/60 flex items-center justify-between">
            <span className="text-[10px] uppercase text-text-muted font-bold">Line Corridor</span>
            <span className="text-[11px] font-extrabold text-brand-blue">{properties.line || 'Central Mainline'}</span>
          </div>

          <div className="bg-surface-muted/60 p-2.5 rounded-card-sm border border-border/60 space-y-1">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-text-muted uppercase font-bold">Rake Occupancy</span>
              <span className="font-extrabold text-[12px]" style={{ color: cl.color }}>
                {cl.formatted_label}
              </span>
            </div>
            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${Math.min(100, cl.pct || 70)}%`, backgroundColor: cl.color }}
              />
            </div>
            <div className="flex justify-between text-[9.5px] text-text-muted pt-0.5">
              <span>Direction: <strong>{properties.direction || 'Downbound'}</strong></span>
              <span>Max Capacity: <strong>{properties.capacity ? properties.capacity.toLocaleString() : '2,000'}</strong></span>
            </div>
          </div>
        </div>

        <div className="text-[9.5px] text-text-muted bg-surface-muted/30 p-2 rounded border border-border/40">
          Simulated passenger boarding/alighting at key interchange halts.
        </div>
      </div>
    )
  }

  // 2. Zone Feature Popup
  if (type === 'zone' || properties?.pressure !== undefined) {
    const isHighOrCritical = properties.pressure >= 70
    const cl = properties.classification || { color: '#DC2626', formatted_label: `${properties.pressure}%` }
    return (
      <div className="w-[280px] sm:w-[320px] bg-surface border border-border rounded-card shadow-elevated p-4 text-[12px] animate-in fade-in zoom-in-95 duration-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-text-muted">Operational Zone</span>
            <h3 className="text-base font-bold text-text-primary leading-tight">{properties.name}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={properties.pressure_level || (properties.pressure >= 85 ? 'CRITICAL' : properties.pressure >= 60 ? 'HIGH' : 'LOW')} />
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-2 my-2.5">
          <div className="bg-surface-muted/60 p-2 rounded-card-sm border border-border/60">
            <span className="text-[9.5px] uppercase text-text-muted block font-semibold">Current Pressure</span>
            <span className="text-[18px] font-bold text-text-primary">{properties.pressure}<span className="text-[11px] font-normal text-text-muted">/100</span></span>
          </div>
          <div className="bg-surface-muted/60 p-2 rounded-card-sm border border-border/60">
            <span className="text-[9.5px] uppercase text-text-muted block font-semibold">Est. Crowd</span>
            <span className="text-[14px] font-bold text-text-secondary mt-0.5 block">{properties.people ? properties.people.toLocaleString() : (properties.current_people ? properties.current_people.toLocaleString() : '—')}</span>
          </div>
        </div>

        {/* Quantity Classification */}
        <div className="bg-surface-muted/40 p-2 rounded-card-sm border border-border/50 mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-text-muted">Quantity Class</span>
          <span className="font-extrabold text-[11px]" style={{ color: cl.color }}>
            {cl.formatted_label}
          </span>
        </div>

        {/* Why Factors */}
        <div className="bg-surface-muted/30 p-2 rounded-card-sm border border-border/50 mb-2.5">
          <span className="text-[9.5px] uppercase font-bold text-text-muted tracking-wider block mb-0.5">Primary Bottleneck Factor</span>
          <p className="text-[11px] text-text-secondary leading-snug">
            {properties.pressure >= 85
              ? 'Station ingress saturation + procession queue spillover onto arterial carriageway.'
              : properties.pressure >= 70
                ? 'High pedestrian concentration approaching primary mandal perimeter.'
                : 'Steady suburban transit movement within civic tolerance.'}
          </p>
        </div>

        {/* Intervention Recommendation */}
        {isHighOrCritical && (
          <div className="bg-terracotta-soft/60 border-l-2 border-terracotta p-2 rounded-r-card-sm mb-3">
            <span className="text-[9.5px] font-bold text-terracotta-dark uppercase tracking-wider block">PRAVAAH Recommendation</span>
            <p className="text-[11px] text-text-primary font-medium mt-0.5 leading-snug">
              Redirect incoming flow toward eastern buffer corridors.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1 border-t border-border/50">
          <Button variant="primary" size="sm" onClick={() => onSimulateAction && onSimulateAction(properties)}>
            Simulate Action
          </Button>
        </div>
      </div>
    )
  }

  // 3. Station Feature Popup
  if (type === 'station' || properties?.capacity !== undefined) {
    return (
      <div className="w-[260px] bg-surface border border-border rounded-card shadow-elevated p-3.5 text-[12px]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5">
            <TrainFront className="w-4 h-4 text-slate" />
            <h3 className="font-bold text-text-primary text-[13px]">{properties.name}</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-[11px] text-text-secondary space-y-1 mb-2">
          <div>Line: <strong className="text-text-primary">{properties.line}</strong></div>
          <div>Capacity: <strong className="text-text-primary">{properties.capacity?.toLocaleString()} /hr</strong></div>
          <div>Current Load: <strong className="text-text-primary">{properties.current_load?.toLocaleString()} ({properties.load_percentage}%)</strong></div>
        </div>
        <StatusBadge status={properties.status} />
      </div>
    )
  }

  return null
}
