import React from 'react'
import { X, Check } from 'lucide-react'

export function MapLayerControl({ layers, onToggleLayer, onClose }) {
  const layerItems = [
    { key: 'pressure', label: 'Crowd Pressure Zones', description: 'Translucent H3/administrative saturation polygons' },
    { key: 'transport', label: 'Transit & Railway Nodes', description: 'Stations & capacity load indicators' },
    { key: 'hotels', label: 'Hotel Capacity Clusters', description: 'Monitored room availability & occupancy' },
    { key: 'roads', label: 'Arterial Roads & Restrictions', description: 'Corridor traffic times & closures' },
    { key: 'welfare', label: 'Welfare & Aid Amenities', description: 'Water, medical, toilets, rest shelters' },
    { key: 'crowdFlow', label: 'Crowd Flow Vectors', description: 'Dynamic movement paths (Phase 4+)' }
  ]

  return (
    <div className="absolute top-3 right-14 z-20 w-[270px] bg-surface border border-border rounded-card shadow-elevated p-3 text-[12px] animate-in fade-in zoom-in-95 duration-100">
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-border">
        <div>
          <h4 className="font-bold text-text-primary text-[12px]">Map Layers</h4>
          <span className="text-[10px] text-text-muted">Toggle geographic intelligence</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Layer Controls"
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        {layerItems.map((item) => {
          const isActive = !!layers[item.key]
          return (
            <label
              key={item.key}
              className="flex items-start gap-2.5 p-1.5 rounded cursor-pointer hover:bg-surface-muted/50 transition-colors"
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggleLayer(item.key)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  isActive ? 'bg-terracotta border-terracotta text-white' : 'border-border-strong bg-surface'
                }`}>
                  {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <div className="flex-1 leading-tight">
                <span className="font-medium text-text-primary block text-[11px]">{item.label}</span>
                <span className="text-[9.5px] text-text-muted block">{item.description}</span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
