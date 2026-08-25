export function Panel({ title, children, className = '', actions }) {
  return (
    <div className={`bg-surface border border-border rounded-card shadow-subtle ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.12em]">{title}</h3>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
