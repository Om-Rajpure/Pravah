import React from 'react'
import { Plus, Minus, RotateCcw, Layers } from 'lucide-react'

export function MapControls({ onZoomIn, onZoomOut, onResetView, onToggleLayers, layersOpen, activeLayerCount }) {
  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 shadow-subtle">
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom In"
        className="w-10 h-10 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom Out"
        className="w-10 h-10 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Reset Camera View */}
      <button
        onClick={onResetView}
        title="Reset to Mumbai Overview"
        aria-label="Reset Map Camera"
        className="w-10 h-10 sm:w-9 sm:h-9 bg-surface border border-border rounded-card-sm flex items-center justify-center text-text-primary hover:bg-surface-muted active:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Layer Toggle */}
      <button
        onClick={onToggleLayers}
        title="Toggle Map Layers"
        aria-label="Toggle Map Layers"
        className={`w-10 h-10 sm:w-9 sm:h-9 border rounded-card-sm flex items-center justify-center transition-colors relative focus:outline-none focus:ring-2 focus:ring-terracotta/30 ${
          layersOpen 
            ? 'bg-sidebar-selected text-white border-sidebar-bg' 
            : 'bg-surface text-text-primary border-border hover:bg-surface-muted'
        }`}
      >
        <Layers className="w-4 h-4" />
        {activeLayerCount > 0 && !layersOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center">
            {activeLayerCount}
          </span>
        )}
      </button>
    </div>
  )
}
