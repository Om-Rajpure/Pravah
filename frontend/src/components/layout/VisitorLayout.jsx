import { Outlet, Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { VISITOR_NAV_ITEMS } from '../../lib/constants'

export default function VisitorLayout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-[68px]">
      <header className="bg-surface h-12 flex items-center justify-between px-4 border-b border-border sticky top-0 z-10">
        <div className="flex items-center">
          <span className="text-text-primary font-bold text-base tracking-tight">PRAVAAH</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange ml-1 mt-0.5"></span>
        </div>
        <Link to="/control-room/overview" className="text-[12px] text-text-secondary font-medium hover:text-text-primary transition-colors">
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
                className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 transition-colors ${isActive ? 'text-brand-orange-dark' : 'text-text-muted hover:text-text-primary'}`}
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
