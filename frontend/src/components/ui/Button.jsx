export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-card-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:ring-offset-1'
  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark active:bg-brand-orange-dark shadow-subtle',
    secondary: 'bg-surface text-text-primary border border-border-strong hover:bg-surface-muted active:bg-surface-muted',
    ghost: 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-[12px]',
    md: 'px-4 py-2 text-[13px]',
    lg: 'px-5 py-2.5 text-[14px]',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
