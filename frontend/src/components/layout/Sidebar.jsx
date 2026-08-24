import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NAV_ITEMS } from '../../lib/constants'

export default function Sidebar({ mobileOpen = false, onClose }) {
  const location = useLocation()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg w-[240px]">
      {/* Brand Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center">
          <span className="text-white font-bold text-lg tracking-tight">PRAVAAH</span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta ml-1.5 mt-0.5"></span>
        </div>
        {/* Mobile close button */}
        {mobileOpen && (
          <button 
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1 rounded text-sidebar-text-secondary hover:text-white lg:hidden"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon]
          const isActive = location.pathname === item.path || 
            (item.path === '/control-room/overview' && location.pathname === '/control-room')
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => { if (onClose) onClose() }}
              className={`flex items-center px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-selected text-white border-l-[3px] border-terracotta -ml-[3px] pl-[9px]'
                  : 'text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text'
              }`}
            >
              {Icon && <Icon className={`w-[17px] h-[17px] mr-3 ${isActive ? 'text-terracotta' : ''}`} strokeWidth={1.75} />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer view switcher */}
      <div className="px-4 py-3 border-t border-white/[0.08]">
        <Link 
          to="/visitor/plan" 
          onClick={() => { if (onClose) onClose() }}
          className="text-[12px] text-sidebar-text-secondary hover:text-sidebar-text transition-colors flex items-center gap-2 py-1"
        >
          <Icons.ArrowLeftRight className="w-3.5 h-3.5 text-terracotta" />
          Visitor Experience
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-[240px] fixed top-0 bottom-0 left-0 bg-sidebar-bg flex-col h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Slide-over Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-[260px] w-full bg-sidebar-bg z-50 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
