import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import { menuItems } from '@/config/menu'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { DEFAULT_FAVICON } from '@/utils/favicon'

export default function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useThemeStore()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  if (sidebarCollapsed) {
    return (
      <div className="w-16 flex flex-col" style={{ backgroundColor: 'var(--card-bg)', borderRight: '1px solid var(--border-color)' }}>
        <div className="h-14 flex items-center justify-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-10 h-10 rounded-lg p-1" style={{ backgroundColor: 'var(--active-bg)', border: '1px solid var(--primary)' }}>
            <img
              src={DEFAULT_FAVICON}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <nav className="flex-1 py-3 space-y-1 px-2">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center justify-center p-2 rounded-lg transition-colors',
                isActiveLink(item.path) ? 'border-l-2' : ''
              )}
              style={isActiveLink(item.path) ? {
                backgroundColor: 'var(--active-bg)',
                color: 'var(--primary)',
                borderLeftColor: 'var(--primary)'
              } : {
                color: 'var(--text-secondary)'
              }}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="w-60 flex flex-col" style={{ backgroundColor: 'var(--card-bg)', borderRight: '1px solid var(--border-color)' }}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg p-1" style={{ backgroundColor: 'var(--active-bg)', border: '1px solid var(--primary)' }}>
            <img
              src={DEFAULT_FAVICON}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>HEMIS</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>2025</div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {menuItems.map(item => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm',
                      isActiveLink(item.path)
                        ? 'border-l-2'
                        : ''
                    )}
                    style={isActiveLink(item.path) ? {
                      backgroundColor: 'var(--active-bg)',
                      color: 'var(--primary)',
                      borderLeftColor: 'var(--primary)',
                      fontWeight: 500
                    } : {
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        expandedMenus.includes(item.id) && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map(child => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm',
                            isActiveLink(child.path) ? 'border-l-2' : ''
                          )}
                          style={isActiveLink(child.path) ? {
                            backgroundColor: 'var(--active-bg)',
                            color: 'var(--primary)',
                            borderLeftColor: 'var(--primary)',
                            fontWeight: 500
                          } : {
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm',
                    isActiveLink(item.path) ? 'border-l-2' : ''
                  )}
                  style={isActiveLink(item.path) ? {
                    backgroundColor: 'var(--active-bg)',
                    color: 'var(--primary)',
                    borderLeftColor: 'var(--primary)',
                    fontWeight: 500
                  } : {
                    color: 'var(--text-primary)'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
          v1.0 • 2025
        </div>
      </div>
    </div>
  )
}

