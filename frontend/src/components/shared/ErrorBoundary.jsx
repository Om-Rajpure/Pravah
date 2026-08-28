import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[PRAVAAH] Component error caught by boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV !== 'production'
      
      return (
        <div className="bg-surface border border-critical/20 rounded-card p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[120px]">
          <p className="text-[10px] uppercase font-bold text-critical tracking-wider">Something went wrong</p>
          <p className="text-sm text-text-secondary max-w-sm">
            {this.props.fallbackMessage || 'The application encountered an error while communicating with the server. We are currently using offline fallback data where possible.'}
          </p>
          {isDev && this.state.error && (
            <div className="mt-2 text-left bg-surface-muted p-2 rounded text-[10px] text-text-muted overflow-auto max-w-full">
              <code>{this.state.error.toString()}</code>
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs font-semibold text-terracotta hover:text-terracotta-dark transition-colors underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
