import React from 'react'

export function DataSourceBadge({ type, source }) {
  const typeStyles = {
    live: 'text-[#2D9C8F]',
    simulated: 'text-[#2563EB]',
    predicted: 'text-[#E69A2E]',
    modeled: 'text-[#7A8591]'
  }

  const colorClass = typeStyles[type] || typeStyles.modeled

  return (
    <div className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider ${colorClass}`}>
      <span className="text-[8px]">●</span>
      <span>{type} · {source}</span>
    </div>
  )
}
