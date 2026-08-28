import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export function KPICard({ title, value, subtitle, trend, status }) {
  return (
    <div className="bg-surface border border-border rounded-[14px] shadow-subtle p-4 sm:p-4.5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2.5">
        <h3 className="text-[13px] sm:text-[14px] text-text-secondary font-semibold">{title}</h3>
        {status && <StatusBadge status={status} size="sm" />}
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="text-[32px] sm:text-[36px] font-bold text-text-primary leading-none tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`flex items-center text-[12px] sm:text-[13px] font-semibold ${
                trend.direction === 'up'
                  ? (trend.isPositive ? 'text-teal' : 'text-critical')
                  : trend.direction === 'down'
                    ? (trend.isPositive ? 'text-teal' : 'text-critical')
                    : 'text-text-secondary'
              }`}>
                {trend.direction === 'up'   && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-[12px] sm:text-[13px] text-text-muted">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
