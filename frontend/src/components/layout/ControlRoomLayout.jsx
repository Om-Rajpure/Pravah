import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function ControlRoomLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
          <Outlet />
        </main>
      </div>
    </div>
  )
}
