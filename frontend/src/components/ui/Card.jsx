export function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`bg-surface border border-border rounded-card shadow-subtle ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
