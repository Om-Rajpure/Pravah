import { EVENT_INFO } from '../../lib/constants'

export default function Header() {
  return (
    <header className="h-[52px] bg-surface border-b border-border flex items-center justify-between px-6 fixed top-0 right-0 left-[240px] z-10">
      <div className="flex-1">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-widest">Control Room</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[14px] font-semibold text-text-primary leading-tight">{EVENT_INFO.name}</h1>
        <span className="text-[12px] text-text-secondary">{EVENT_INFO.day} &middot; {EVENT_INFO.period}</span>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-low opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-low"></span>
        </span>
        <span className="text-[11px] font-semibold text-text-primary tracking-wider uppercase">LIVE</span>
        <span className="text-[11px] text-text-muted ml-1">System Healthy</span>
      </div>
    </header>
  )
}
