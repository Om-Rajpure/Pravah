import React from 'react'
import { TrendingUp } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Predictions() {
  return (
    <div className="bg-surface border border-border rounded-card p-8 min-h-[400px] flex items-center justify-center">
      <EmptyState icon={TrendingUp} title="Predictions" message="Network-aware crowd predictions will be available in Phase 7." />
    </div>
  )
}
