import { Link, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NAV_ITEMS } from '../../lib/constants'

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[240px] fixed top-0 bottom-0 left-0 bg-sidebar-bg flex flex-col h-screen z-20">
      <div className="px-5 py-5 flex items-center border-b border-white/[0.08]">
        <span className="text-white font-bold text-lg tracking-tight">PRAVAAH</span>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange ml-1.5 mt-0.5"></span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon]
          const isActive = location.pathname === item.path || 
            (item.path === '/control-room/overview' && location.pathname === '/control-room')
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-selected text-white border-l-[3px] border-brand-orange -ml-[3px] pl-[9px]'
                  : 'text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text'
              }`}
            >
              {Icon && <Icon className={`w-[16px] h-[16px] mr-3 ${isActive ? 'text-brand-orange' : ''}`} strokeWidth={1.75} />}
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-3 border-t border-white/[0.08]">
        <Link to="/visitor/plan" className="text-[12px] text-sidebar-text-secondary hover:text-sidebar-text transition-colors flex items-center gap-2">
          <Icons.ArrowLeftRight className="w-3.5 h-3.5" />
          Visitor View
        </Link>
      </div>
    </aside>
  )
}
