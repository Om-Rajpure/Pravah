import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/shared/ErrorBoundary'
import './styles/index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallbackMessage="PRAVAAH encountered an unexpected error. Please reload the page.">
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)

// Dismiss the HTML splash loader after React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (typeof window.__hideLoader === 'function') window.__hideLoader()
  })
})
