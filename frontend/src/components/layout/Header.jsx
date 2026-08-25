import React from 'react'
import { Menu } from 'lucide-react'
import { EVENT_INFO } from '../../lib/constants'

export default function Header({ onOpenMobileNav }) {
  return (
    <header className="h-[52px] bg-navy border-b border-navy-light/30 flex items-center justify-between px-4 sm:px-5 fixed top-0 right-0 left-0 lg:left-[240px] z-10 shadow-[0_2px_8px_rgba(11,35,66,0.25)]">
      {/* Left: Mobile menu toggle + PRAVAAH wordmark on mobile */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open Navigation Menu"
          className="p-1.5 -ml-1 rounded text-white/60 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none focus:ring-2 focus:ring-orange/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {/* PRAVAAH wordmark on mobile */}
          <span className="lg:hidden font-bold text-sm tracking-tight text-white">PRAVAAH</span>
          <span className="hidden sm:inline text-[10px] font-bold text-white/40 uppercase tracking-[0.18em]">
            Control Room
          </span>
        </div>
      </div>

      {/* Center: Event name + day/period */}
      <div className="flex flex-col items-center justify-center text-center absolute left-1/2 -translate-x-1/2">
        <h1 className="text-[13px] sm:text-[14px] font-semibold text-white leading-tight truncate max-w-[180px] sm:max-w-[320px]">
          {EVENT_INFO.name}
        </h1>
        <span className="text-[11px] text-white/55 leading-tight">
          {EVENT_INFO.day} &middot; {EVENT_INFO.period}
        </span>
      </div>

      {/* Right: LIVE telemetry indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
        </span>
        <span className="text-[11px] font-bold text-white tracking-wider uppercase">LIVE</span>
        <span className="hidden md:inline text-[11px] text-white/40">Telemetry</span>
      </div>
    </header>
  )
}
