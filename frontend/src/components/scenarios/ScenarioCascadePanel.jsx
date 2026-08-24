import React from 'react'
import { GitBranch, AlertCircle, ArrowDown, ShieldCheck, Zap } from 'lucide-react'

export function ScenarioCascadePanel({ cascade = [] }) {
  if (!cascade || cascade.length === 0) return null

  const getStageColor = (stage) => {
    switch (stage) {
      case 'TRIGGER':
        return 'bg-critical/10 text-critical border-critical/30'
      case 'NETWORK':
        return 'bg-slate/10 text-slate border-slate/30'
      case 'FLOW':
        return 'bg-warning/10 text-warning-dark border-warning/30'
      case 'PRESSURE':
        return 'bg-critical-bg text-critical border-critical/40'
      case 'RESPONSE':
        return 'bg-low/15 text-low border-low/30'
      default:
        return 'bg-surface-muted text-text-secondary border-border'
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-3">
      <div>
        <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
          Cause & Effect Propagation Cascade
        </span>
        <h3 className="text-sm font-bold text-text-primary">
          From Initial Trigger to PRAVAAH Response
        </h3>
      </div>

      <div className="relative space-y-2 pt-1">
        {cascade.map((item, idx) => {
          const isLast = idx === cascade.length - 1
          return (
            <div key={idx} className="flex items-start gap-3 relative">
              {/* Step Number Circle */}
              <div className="w-6 h-6 rounded-full bg-surface-muted border border-border flex items-center justify-center text-[11px] font-bold text-text-secondary flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 bg-surface-muted/30 p-2.5 rounded-card-sm border border-border/70 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStageColor(item.stage)}`}>
                    {item.stage}
                  </span>
                  <span className="font-bold text-text-primary">{item.title}</span>
                </div>
                <p className="text-text-secondary leading-snug">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
