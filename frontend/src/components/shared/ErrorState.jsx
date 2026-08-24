import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
      <AlertTriangle className="w-10 h-10 mb-3 text-critical" strokeWidth={1.5} />
      <p className="text-base font-medium text-text-primary mb-1">{title}</p>
      {message && <p className="text-sm text-text-secondary text-center max-w-sm mb-4">{message}</p>}
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>}
    </div>
  )
}
