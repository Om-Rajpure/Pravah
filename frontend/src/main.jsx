import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/shared/ErrorBoundary'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallbackMessage="PRAVAAH encountered an unexpected error. Please reload the page.">
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
