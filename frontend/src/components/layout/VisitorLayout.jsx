import { Outlet, Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { VISITOR_NAV_ITEMS } from '../../lib/constants.js'
import { PravaahBrandLogo } from '../shared/PravaahLogo'

export default function VisitorLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background flex flex-col pb-[72px] sm:pb-[76px]">
      {/* Top Header */}
      <header className="bg-navy h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-navy-light/30 sticky top-0 z-30 shadow-[0_2px_8px_rgba(11,35,66,0.25)]">
        <div className="flex items-center gap-2.5">
          <Link to="/visitor" className="flex items-center">
            <PravaahBrandLogo variant="dark" size="sm" showTagline={false} />
            <span className="text-[10px] text-tealLight font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full ml-2.5">
              Visitor Guide
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-[12px] text-white/70 font-semibold hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Icons.Home className="w-3.5 h-3.5 text-white/60" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="/control-room/overview"
            className="text-[12px] text-white/70 font-semibold hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Icons.LayoutDashboard className="w-3.5 h-3.5 text-orange" />
            <span className="hidden sm:inline">Operator</span> Control Room
          </Link>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 flex justify-center p-3 sm:p-5 lg:p-6">
        <div className="w-full max-w-2xl lg:max-w-4xl animate-in fade-in duration-200">
          <Outlet />
        </div>
      </main>

      {/* Fixed Bottom Navigation (Mobile & Desktop App Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-center z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-2xl flex justify-around items-center h-14 sm:h-15 px-2">
          {VISITOR_NAV_ITEMS.map(item => {
            const Icon = Icons[item.icon] || Icons.Circle
            const isExactHome = item.path === '/visitor' && (location.pathname === '/visitor' || location.pathname === '/visitor/')
            const isActive = isExactHome || (item.path !== '/visitor' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 space-y-0.5 transition-colors touch-target ${
                  isActive ? 'text-navy font-bold' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-navy-soft text-navy' : ''}`}>
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={isActive ? 2.25 : 1.75} />
                </div>
                <span className="text-[10px] sm:text-[11px] leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
