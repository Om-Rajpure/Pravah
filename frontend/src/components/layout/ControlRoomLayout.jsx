import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function ControlRoomLayout() {
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <Header />
        <main className="flex-1 mt-[52px] p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
