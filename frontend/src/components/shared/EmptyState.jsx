import { Inbox } from 'lucide-react'

export function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
      <Icon className="w-10 h-10 mb-3 text-text-muted" strokeWidth={1.5} />
      <p className="text-base font-medium text-text-primary mb-1">{title}</p>
      <p className="text-sm text-text-secondary text-center max-w-sm">{message}</p>
    </div>
  )
}
