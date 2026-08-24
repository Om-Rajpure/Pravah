import React from 'react'
import { Menu } from 'lucide-react'
import { EVENT_INFO } from '../../lib/constants'

export default function Header({ onOpenMobileNav }) {
  return (
    <header className="h-[52px] bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 lg:left-[240px] z-10">
      {/* Left: Mobile menu toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open Navigation Menu"
          className="p-1.5 -ml-1.5 rounded-card-sm text-text-secondary hover:text-text-primary hover:bg-surface-muted lg:hidden focus:outline-none focus:ring-2 focus:ring-terracotta/30"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="lg:hidden font-bold text-sm tracking-tight text-text-primary">PRAVAAH</span>
          <span className="hidden sm:inline text-[11px] font-medium text-text-muted uppercase tracking-widest">
            Control Room
          </span>
        </div>
      </div>

      {/* Center: Event title & Day/Slot */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-[13px] sm:text-[14px] font-semibold text-text-primary leading-tight truncate max-w-[180px] sm:max-w-none">
          {EVENT_INFO.name}
        </h1>
        <span className="text-[11px] sm:text-[12px] text-text-secondary">
          {EVENT_INFO.day} &middot; {EVENT_INFO.period}
        </span>
      </div>

      {/* Right: Live Telemetry Indicator */}
      <div className="flex justify-end items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-low opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-low"></span>
        </span>
        <span className="text-[11px] font-semibold text-text-primary tracking-wider uppercase">LIVE</span>
        <span className="hidden md:inline text-[11px] text-text-muted ml-0.5">Telemetry OK</span>
      </div>
    </header>
  )
}
