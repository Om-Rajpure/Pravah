import React from 'react'
import { Zap } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Actions() {
  return (
    <div className="bg-surface border border-border rounded-card p-8 min-h-[400px] flex items-center justify-center">
      <EmptyState icon={Zap} title="Actions" message="Intervention management and execution will be available in Phase 10." />
    </div>
  )
}
