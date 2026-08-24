import React from 'react'
import { Shield } from 'lucide-react'
import { EmptyState } from '../../components/shared/EmptyState'

export default function GlassBox() {
  return (
    <div className="bg-surface border border-border rounded-card p-8 min-h-[400px] flex items-center justify-center">
      <EmptyState icon={Shield} title="Glass Box" message="Privacy-preserving coordination will be available in Phase 19." />
    </div>
  )
}
