import { Outlet } from 'react-router-dom'
import DynamicSidebar from './DynamicSidebar'
import Header from './Header'

export default function MainLayout() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--app-bg)' }}>
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

