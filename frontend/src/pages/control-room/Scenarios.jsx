import React from 'react'
import { FlaskConical } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function Scenarios() {
  return (
    <div className="bg-surface border border-border rounded-card p-8 min-h-[400px] flex items-center justify-center">
      <EmptyState icon={FlaskConical} title="Scenario Injector" message="Scenario simulation will be available in Phase 9." />
    </div>
  )
}
