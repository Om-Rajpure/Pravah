import { StatusBadge } from './StatusBadge'

export function AlertCard({ severity, title, description, timeframe }) {
  const borderColors = {
    CRITICAL: 'border-critical',
    HIGH: 'border-high',
    MODERATE: 'border-warning',
    LOW: 'border-low'
  }
  const borderColor = borderColors[severity] || 'border-border'
  
  return (
    <div className={`bg-surface border border-border border-l-[3px] ${borderColor} rounded-card-sm p-3`}>
      <div className="flex justify-between items-start mb-1.5">
        <StatusBadge status={severity} />
        {timeframe && <span className="text-[11px] text-text-muted">{timeframe}</span>}
      </div>
      <h4 className="text-[13px] font-medium text-text-primary mb-0.5">{title}</h4>
      <p className="text-[12px] text-text-secondary leading-snug">{description}</p>
    </div>
  )
}
