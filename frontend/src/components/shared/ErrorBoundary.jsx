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
      return (
        <div className="bg-surface border border-critical/20 rounded-card p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[120px]">
          <p className="text-[10px] uppercase font-bold text-critical tracking-wider">Component Unavailable</p>
          <p className="text-sm text-text-secondary max-w-sm">
            {this.props.fallbackMessage || 'This section encountered an error and could not be rendered.'}
          </p>
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
