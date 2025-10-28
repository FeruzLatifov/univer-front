import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, X, GraduationCap } from 'lucide-react'
import { menuItems } from '@/config/menu'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

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
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-12 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
        <nav className="flex-1 py-2 space-y-1 px-2">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center justify-center p-2 rounded-lg transition-colors',
                isActiveLink(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
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
    <div className="w-52 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Ultra-Dense Header */}
      <div className="h-10 flex items-center justify-between px-2.5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-gray-900 dark:text-white">HEMIS</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">2025</div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ultra-Dense Navigation */}
      <nav className="flex-1 py-1.5 px-1.5 overflow-y-auto scrollbar-hide">
        <div className="space-y-0.5">
          {menuItems.map(item => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-xs',
                      isActiveLink(item.path)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={item.color}>{item.icon}</div>
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 transition-transform flex-shrink-0',
                        expandedMenus.includes(item.id) && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <div className="ml-2.5 mt-0.5 space-y-0.5">
                      {item.children.map(child => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors text-xs',
                            isActiveLink(child.path)
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          {child.icon}
                          <span className="text-[11px]">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs',
                    isActiveLink(item.path)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div className={item.color}>{item.icon}</div>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Ultra-Dense Footer */}
      <div className="p-1.5 border-t border-gray-200">
        <div className="text-[10px] text-center text-gray-500">
          v1.0 • 2025
        </div>
      </div>
    </div>
  )
}

