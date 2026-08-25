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
            <span className="text-white font-bold text-[15px] tracking-tight leading-none">PRAVAAH</span>
            <span className="text-sidebar-text-secondary text-[9px] tracking-[0.12em] uppercase font-medium mt-0.5 leading-none">
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
            <Icons.X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-[9px] font-bold text-sidebar-text-secondary uppercase tracking-[0.15em]">
          Control Room
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 pb-2 flex flex-col gap-px overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon]
          const isActive = location.pathname === item.path ||
            (item.path === '/control-room/overview' && location.pathname === '/control-room')
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => { if (onClose) onClose() }}
              className={`flex items-center px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-100 ${
                isActive
                  ? 'bg-sidebar-selected text-white border-l-2 border-orange -ml-[2px] pl-[10px]'
                  : 'text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text'
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-[16px] h-[16px] mr-2.5 flex-shrink-0 ${isActive ? 'text-orange' : ''}`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
              )}
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer: View switcher + build info */}
      <div className="px-3 py-3 border-t border-white/[0.08] space-y-1">
        <Link
          to="/visitor/plan"
          onClick={() => { if (onClose) onClose() }}
          className="text-[11px] text-sidebar-text-secondary hover:text-sidebar-text transition-colors flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5"
        >
          <Icons.Users className="w-3.5 h-3.5 text-teal flex-shrink-0" />
          <span>Visitor Experience</span>
          <Icons.ArrowRight className="w-3 h-3 ml-auto opacity-40" />
        </Link>
        <p className="text-[9px] text-white/20 px-2 pt-1 leading-snug">
          Ganesh Chaturthi 2026 · DEMO_SEED=20260908
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-[260px] w-full z-50 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
