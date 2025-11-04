/**
 * Dynamic Sidebar Component
 *
 * Renders menu dynamically from Laravel backend
 * Features:
 * - Permission-based filtering (backend)
 * - Responsive design
 * - Collapsible/expandable
 * - Active state tracking
 * - Icon support
 *
 * @version 2.0 - Dynamic menu with Laravel integration
 */

import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, X, Loader2, AlertCircle } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useMenuStore } from '@/stores/menuStore'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { DEFAULT_FAVICON } from '@/utils/favicon'
import { MenuItem } from '@/types'
import * as LucideIcons from 'lucide-react'

// ============================================
// ICON MAPPER
// ============================================

const getIcon = (iconName: string) => {
  // Convert kebab-case to PascalCase (e.g., 'user-circle' -> 'UserCircle')
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  // @ts-ignore - Dynamic icon import
  const Icon = LucideIcons[pascalCase] || LucideIcons.Circle

  return <Icon className="w-4 h-4" />
}

// ============================================
// MENU ITEM COMPONENT
// ============================================

interface MenuItemProps {
  item: MenuItem
  level?: number
  isCollapsed?: boolean
}

function MenuItemComponent({ item, level = 0, isCollapsed = false }: MenuItemProps) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasChildren = item.items && item.items.length > 0
  const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren && item.items.some((child) => location.pathname.startsWith(child.url))) {
      setIsExpanded(true)
    }
  }, [location.pathname, hasChildren, item.items])

  if (isCollapsed && level === 0) {
    // Collapsed view - only show icons for top-level items
    return (
      <Link
        to={item.url}
        className={cn(
          'flex items-center justify-center p-2 rounded-lg transition-colors',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
        title={item.label}
      >
        {getIcon(item.icon)}
      </Link>
    )
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-xs',
            level > 0 && 'ml-2',
            isActive
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          <div className="flex items-center gap-1.5">
            {getIcon(item.icon)}
            <span className="text-xs">{item.label}</span>
          </div>
          <ChevronDown
            className={cn(
              'w-3 h-3 transition-transform flex-shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        </button>

        {isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {item.items.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                level={level + 1}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.url}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs',
        level > 0 && 'ml-2',
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
    >
      {getIcon(item.icon)}
      <span className={cn(level > 0 && 'text-[11px]')}>{item.label}</span>
    </Link>
  )
}

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

export default function DynamicSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore()
  const { menu, loading, error, fetchMenu } = useMenuStore()

  // Debug: Log menu changes
  useEffect(() => {
    console.log('🎨 [DynamicSidebar] Menu changed:', {
      menuLength: menu.length,
      menuItems: menu.map(m => m.label).join(', ')
    })
  }, [menu])

  // Fetch menu on mount (only once)
  useEffect(() => {
    console.log('🔄 [DynamicSidebar] Initial menu fetch...')
    fetchMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Collapsed view
  if (sidebarCollapsed) {
    return (
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-12 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-700 p-1">
            <img
              src={DEFAULT_FAVICON}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 py-2 space-y-1 px-2 overflow-y-auto scrollbar-hide">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {error && (
            <div className="p-2 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            </div>
          )}

          {!loading && !error && menu.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              isCollapsed={true}
            />
          ))}
        </nav>
      </div>
    )
  }

  // Expanded view
  return (
    <div className="w-52 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-2.5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-700 p-0.5">
            <img
              src={DEFAULT_FAVICON}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-bold text-xs text-gray-900 dark:text-white">HEMIS</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">2025</div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-1.5 px-1.5 overflow-y-auto scrollbar-hide">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading menu...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={() => fetchMenu()}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-0.5">
            {menu.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                isCollapsed={false}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-1.5 border-t border-gray-200 dark:border-gray-700">
        <div className="text-[10px] text-center text-gray-500 dark:text-gray-400">
          v2.0 • Dynamic Menu
        </div>
      </div>
    </div>
  )
}
