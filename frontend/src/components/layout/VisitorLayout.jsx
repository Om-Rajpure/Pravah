import { Outlet, Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { VISITOR_NAV_ITEMS } from '../../lib/constants'

export default function VisitorLayout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-[68px]">
      <header className="bg-navy h-12 flex items-center justify-between px-4 border-b border-navy-light/30 sticky top-0 z-10 shadow-[0_2px_8px_rgba(11,35,66,0.25)]">
        <div className="flex items-center gap-2">
          <img
            src="/pravaah-logo.png"
            alt="PRAVAAH"
            className="h-6 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <span className="text-white font-bold text-sm tracking-tight">PRAVAAH</span>
          <span className="text-[10px] text-white/40 font-medium">Visitor</span>
        </div>
        <Link to="/control-room/overview" className="text-[11px] text-white/60 font-medium hover:text-white transition-colors flex items-center gap-1">
          <Icons.LayoutDashboard className="w-3 h-3" />
          Control Room
        </Link>
      </header>
      
      <main className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-[480px]">
          <Outlet />
        </div>
      </main>
      
      <nav className="fixed bottom-0 w-full bg-surface border-t border-border flex justify-center">
        <div className="w-full max-w-[480px] flex justify-around items-center h-14">
          {VISITOR_NAV_ITEMS.map(item => {
            const Icon = Icons[item.icon]
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link 
                key={item.id} 
                to={item.path} 
                className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 transition-colors ${isActive ? 'text-navy' : 'text-text-muted hover:text-text-primary'}`}
              >
                {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
