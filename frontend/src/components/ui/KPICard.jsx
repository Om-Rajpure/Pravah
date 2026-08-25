import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export function KPICard({ title, value, subtitle, trend, status }) {
  return (
    <div className="bg-surface border border-border rounded-card shadow-subtle p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.12em] text-text-secondary font-bold">{title}</h3>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="text-[26px] lg:text-[30px] font-bold text-text-primary leading-none tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <span className={`flex items-center text-[11px] font-semibold ${
                trend.direction === 'up'
                  ? (trend.isPositive ? 'text-teal' : 'text-critical')
                  : trend.direction === 'down'
                    ? (trend.isPositive ? 'text-teal' : 'text-critical')
                    : 'text-text-secondary'
              }`}>
                {trend.direction === 'up'   && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {trend.direction === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-[11px] text-text-muted">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
