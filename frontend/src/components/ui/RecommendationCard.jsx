import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

export function RecommendationCard({ title, description, expectedResult, actionLabel, onAction }) {
  return (
    <div className="bg-brand-orange-soft border-l-4 border-brand-orange rounded-card-sm p-5">
      <h4 className="text-[10px] uppercase tracking-[0.1em] text-brand-orange-dark font-semibold mb-2">
        {title || 'PRAVAAH RECOMMENDS'}
      </h4>
      <p className="text-[14px] text-text-primary mb-4 font-medium leading-relaxed">{description}</p>
      {expectedResult && (
        <div className="bg-surface/70 rounded-card-sm p-3 mb-4 flex flex-wrap items-center text-sm border border-brand-orange-light/60">
          <span className="text-text-secondary text-[12px] font-medium mr-3">Expected result</span>
          <span className="text-text-primary font-semibold text-[13px]">{expectedResult.before}</span>
          <ArrowRight className="w-3.5 h-3.5 mx-2 text-brand-orange" />
          <span className="text-brand-orange-dark font-bold text-[13px]">{expectedResult.after}</span>
        </div>
      )}
      {actionLabel && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
