import React from 'react'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Impact() {
  return (
    <div className="bg-surface border border-border rounded-card p-8 min-h-[400px] flex items-center justify-center">
      <EmptyState icon={BarChart3} title="Impact & Counterfactual" message="Action impact measurement will be available in Phase 14." />
    </div>
  )
}
