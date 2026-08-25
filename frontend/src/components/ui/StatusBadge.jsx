import React from 'react'
import { getPressureStatus } from '../../lib/constants'

export function StatusBadge({ status, value }) {
  const config = typeof value === 'number' ? getPressureStatus(value) : null
  const statusMap = {
    LOW:      { bg: 'bg-teal-soft',      text: 'text-teal-dark',   label: 'LOW' },
    MODERATE: { bg: 'bg-warning-bg',     text: 'text-warning',     label: 'MODERATE' },
    HIGH:     { bg: 'bg-orange-soft',    text: 'text-orange-dark', label: 'HIGH' },
    CRITICAL: { bg: 'bg-critical-bg',   text: 'text-critical',    label: 'CRITICAL' },
  }
  const s = statusMap[status] || (config ? statusMap[config.label] : statusMap.LOW)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}
