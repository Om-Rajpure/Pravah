import React from 'react'

export function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-surface/95 backdrop-blur-sm border border-border rounded-card-sm p-2.5 shadow-subtle text-[11px]">
      <span className="text-[9.5px] uppercase font-bold text-text-muted tracking-wider block mb-1.5">
        Crowd Pressure
      </span>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-critical"></span>
          <span className="text-text-primary font-medium">Critical (≥85)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-high"></span>
          <span className="text-text-primary font-medium">High (70–84)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
          <span className="text-text-primary font-medium">Mod (50–69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-low"></span>
          <span className="text-text-primary font-medium">Low (&lt;50)</span>
        </div>
      </div>
      
      <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center gap-3 text-[10px] text-text-secondary">
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-slate inline-block"></span> Transit Line
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-0.5 bg-[#51423D] inline-block"></span> Road Closure
        </span>
      </div>
    </div>
  )
}
