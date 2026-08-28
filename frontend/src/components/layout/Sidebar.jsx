import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NAV_ITEMS } from '../../lib/constants'

export default function Sidebar({ mobileOpen = false, onClose }) {
  const location = useLocation()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg w-[240px]">
      {/* Brand Header — PRAVAAH Logo */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/[0.08]">
        <Link to="/control-room/overview" className="flex items-center gap-2.5 min-w-0" onClick={() => { if (onClose) onClose() }}>
          <img
            src="/pravaah-logo.png"
            alt="PRAVAAH"
            className="h-8 w-auto object-contain flex-shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-[16px] tracking-tight leading-none">PRAVAAH</span>
            <span className="text-sidebar-text-secondary text-[11px] tracking-[0.1em] uppercase font-medium mt-1 leading-none">
              City Intelligence
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded text-sidebar-text-secondary hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-1.5">
        <span className="text-[12px] font-bold text-sidebar-text-secondary uppercase tracking-wider">
          Control Room
        </span>
      </div>

      {/* Navigation Links (14-15px) */}
      <nav className="flex-1 px-2.5 pb-2 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon]
          const isActive = location.pathname === item.path ||
            (item.path === '/control-room/overview' && location.pathname === '/control-room')
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => { if (onClose) onClose() }}
              className={`flex items-center px-3 py-2.5 rounded-[8px] text-[14px] font-semibold transition-all duration-100 ${
                isActive
                  ? 'bg-sidebar-selected text-white border-l-[3px] border-orange -ml-[3px] pl-[9px]'
                  : 'text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text'
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-[18px] h-[18px] mr-2.5 flex-shrink-0 ${isActive ? 'text-orange' : ''}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              )}
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer: View switcher + build info (12-13px) */}
      <div className="px-3.5 py-3 border-t border-white/[0.08] space-y-1.5">
        <Link
          to="/visitor/plan"
          onClick={() => { if (onClose) onClose() }}
          className="text-[13px] text-sidebar-text-secondary hover:text-sidebar-text transition-colors flex items-center gap-2 px-2.5 py-2 rounded-[6px] hover:bg-white/5 font-medium"
        >
          <Icons.Users className="w-4 h-4 text-teal flex-shrink-0" />
          <span>Visitor Experience</span>
          <Icons.ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
        </Link>
        <p className="text-[11px] text-white/30 px-2.5 pt-1 leading-snug">
          Ganesh Chaturthi 2026 · Live Telemetry
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-[240px] fixed top-0 bottom-0 left-0 flex-col h-screen z-20 shadow-[2px_0_12px_rgba(11,35,66,0.4)]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-[260px] w-full z-50 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
