import { Loader2 } from 'lucide-react'

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin text-brand-orange mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
