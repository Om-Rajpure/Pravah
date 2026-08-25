import React, { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { DemoModeBar } from '../shared/DemoModeBar'
import ErrorBoundary from '../shared/ErrorBoundary'

export default function ControlRoomLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [demoKey, setDemoKey] = useState(0)

  // When demo resets, bump demoKey to re-mount the Outlet and refresh all pages
  const handleDemoReset = useCallback(() => {
    setDemoKey(k => k + 1)
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar (Desktop Fixed + Mobile Overlay) */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col w-full lg:ml-[240px] transition-all duration-150">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 mt-[52px] p-3.5 sm:p-5 lg:p-6 overflow-x-hidden">
          {/* Demo Mode Control Bar — always visible in control room */}
          <div className="mb-4">
            <ErrorBoundary fallbackMessage="Demo controls temporarily unavailable.">
              <DemoModeBar onReset={handleDemoReset} />
            </ErrorBoundary>
          </div>
          <ErrorBoundary fallbackMessage="This page encountered an error. Use the sidebar to navigate to another section.">
            <Outlet key={demoKey} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
