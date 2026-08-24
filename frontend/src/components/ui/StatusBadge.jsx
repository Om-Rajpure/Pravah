import React from 'react'
import { getPressureStatus } from '../../lib/constants'

export function StatusBadge({ status, value }) {
  const config = typeof value === 'number' ? getPressureStatus(value) : null
  const statusMap = {
    LOW: { bg: 'bg-low/10', text: 'text-low', label: 'LOW' },
    MODERATE: { bg: 'bg-warning/10', text: 'text-warning', label: 'MODERATE' },
    HIGH: { bg: 'bg-high/10', text: 'text-high', label: 'HIGH' },
    CRITICAL: { bg: 'bg-critical/10', text: 'text-critical', label: 'CRITICAL' },
  }
  const s = statusMap[status] || (config ? statusMap[config.label] : statusMap.LOW)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}
