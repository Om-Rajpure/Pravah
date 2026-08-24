import React from 'react'
import { LifeBuoy } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Support() {
  return (
    <div className="bg-surface rounded-card p-8 mt-4 flex items-center justify-center">
      <EmptyState icon={LifeBuoy} title="Nearby Support" message="Welfare resources and nearby support will be available in Phase 18." />
    </div>
  )
}
