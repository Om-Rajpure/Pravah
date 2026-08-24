import React from 'react'
import { X, ArrowRight, Activity, TrainFront, Hotel, HeartHandshake } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { Button } from '../ui/Button'

export function LocationDrawer({ feature, onClose, onSimulateAction }) {
  if (!feature) return null

  const { type, properties } = feature

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-surface border-t border-border rounded-t-2xl shadow-elevated p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 sm:hidden">
      {/* Draggable indicator */}
      <div className="w-10 h-1 bg-border-strong rounded-full mx-auto mb-3"></div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {type === 'station' ? 'Transit Station' : type === 'hotel' ? 'Hotel Cluster' : type === 'welfare' ? 'Welfare Amenity' : 'Operational Zone'}
          </span>
          <h3 className="text-lg font-bold text-text-primary leading-tight">{properties?.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {properties?.pressure_level && <StatusBadge status={properties.pressure_level} />}
          {properties?.status && !properties?.pressure_level && <StatusBadge status={properties.status} />}
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-text-muted hover:text-text-primary bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone Details */}
      {(type === 'zone' || properties?.pressure !== undefined) && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/60">
              <span className="text-[10px] uppercase text-text-muted block font-semibold">Current Pressure</span>
              <span className="text-[22px] font-bold text-text-primary">{properties.pressure}<span className="text-xs font-normal text-text-muted">/100</span></span>
            </div>
            <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/60">
              <span className="text-[10px] uppercase text-text-muted block font-semibold">Current Density</span>
              <span className="text-[16px] font-bold text-text-secondary mt-1 block">{properties.current_people ? properties.current_people.toLocaleString() : '—'}</span>
            </div>
          </div>

          <div className="bg-surface-muted/40 p-3 rounded-card-sm border border-border/50 text-[12px]">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">Bottleneck Analysis</span>
            <p className="text-text-secondary leading-snug">
              {properties.pressure >= 85
                ? 'Severe platform queue saturation and procession spillover on Dr. BA Road.'
                : properties.pressure >= 70
                  ? 'Elevated pilgrim density approaching primary mandal.'
                  : 'Operating normally with buffer capacity available.'}
            </p>
          </div>

          {properties.pressure >= 70 && (
            <div className="bg-terracotta-soft/70 border-l-3 border-terracotta p-3 rounded-r-card-sm text-[12px]">
              <span className="text-[10px] font-bold text-terracotta-dark uppercase tracking-wider block mb-0.5">PRAVAAH Recommends</span>
              <p className="text-text-primary font-medium leading-snug">
                Redirect 18% incoming crowd volume toward Thane & Vashi transit corridors.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button variant="primary" size="lg" className="w-full" onClick={() => onSimulateAction && onSimulateAction(properties)}>
              Simulate Intervention
            </Button>
          </div>
        </div>
      )}

      {/* Station Details */}
      {(type === 'station' || properties?.capacity !== undefined) && (
        <div className="space-y-3 text-[13px]">
          <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/60 space-y-1.5">
            <div className="flex justify-between"><span className="text-text-secondary">Line:</span> <strong className="text-text-primary">{properties.line}</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Capacity:</span> <strong className="text-text-primary">{properties.capacity?.toLocaleString()} /hr</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Current Load:</span> <strong className="text-text-primary">{properties.current_load?.toLocaleString()} ({properties.load_percentage}%)</strong></div>
          </div>
        </div>
      )}

      {/* Hotel Details */}
      {(type === 'hotel' || properties?.total_rooms !== undefined) && (
        <div className="space-y-3 text-[13px]">
          <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/60 space-y-1.5">
            <div className="flex justify-between"><span className="text-text-secondary">Zone:</span> <strong className="text-text-primary capitalize">{properties.zone_name}</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Available:</span> <strong className="text-text-primary">{properties.available_rooms?.toLocaleString()} of {properties.total_rooms?.toLocaleString()} rooms</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Occupancy:</span> <strong className="text-text-primary">{properties.occupancy_rate}%</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Avg Nightly Rate:</span> <strong className="text-text-primary">₹{properties.price?.toLocaleString()}</strong></div>
          </div>
          <span className="text-[10px] text-text-muted italic block text-center">Prototype aggregated capacity</span>
        </div>
      )}

      {/* Welfare Details */}
      {(type === 'welfare' || properties?.type !== undefined) && (
        <div className="space-y-3 text-[13px]">
          <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/60 space-y-1.5">
            <div className="flex justify-between"><span className="text-text-secondary">Type:</span> <strong className="text-text-primary uppercase">{properties.type}</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Capacity:</span> <strong className="text-text-primary">{properties.capacity?.toLocaleString()} units/hr</strong></div>
            <div className="flex justify-between"><span className="text-text-secondary">Status:</span> <strong className="text-text-primary">{properties.status || 'ACTIVE'}</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}
