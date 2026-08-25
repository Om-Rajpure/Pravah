import React from 'react'
import { GlassBoxPanel } from '../../components/explainability/GlassBoxPanel'
import { DecisionAuditTimeline } from '../../components/explainability/DecisionAuditTimeline'

export default function GlassBox() {
  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-7">
          <GlassBoxPanel actionId="act-redirect-curry-road-thane-18" />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <DecisionAuditTimeline />
        </div>
      </div>
      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">
          Every PRAVAAH decision is traceable to a computation, not a heuristic.
        </p>
      </div>
    </div>
  )
}
