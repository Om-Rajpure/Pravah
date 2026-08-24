import React from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'

export function MapControls({ onZoomIn, onZoomOut, onResetView }) {
  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 shadow-subtle" role="toolbar" aria-label="Map Navigation Controls">
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom In on Mumbai Map"
        className="w-11 h-11 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30 shadow-subtle"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom Out on Mumbai Map"
        className="w-11 h-11 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30 shadow-subtle"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Reset Camera to Mumbai Overview */}
      <button
        onClick={onResetView}
        title="Reset to Mumbai Operational Overview"
        aria-label="Reset Map to Mumbai Overview"
        className="w-11 h-11 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30 shadow-subtle"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
