import React from 'react'
import { Bed } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Stay() {
  return (
    <div className="bg-surface rounded-card p-8 mt-4 flex items-center justify-center">
      <EmptyState icon={Bed} title="Stay Recommendations" message="Accommodation recommendations will be available in Phase 17." />
    </div>
  )
}
