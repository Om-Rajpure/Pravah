import React from 'react'
import { Navigation } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Route() {
  return (
    <div className="bg-surface rounded-card p-8 mt-4 flex items-center justify-center">
      <EmptyState icon={Navigation} title="Route Recommendation" message="Personalized route guidance will be available in Phase 17." />
    </div>
  )
}
