/**
 * Menu Store (Zustand)
 *
 * Manages menu state for the application
 * Integrates with Laravel backend menu API
 *
 * Features:
 * - Smart caching (sessionStorage)
 * - Permission-based filtering (already done by backend)
 * - Locale support
 * - Active menu tracking
 *
 * @version 1.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as menuApi from '@/lib/api/menu'
import { MenuItem } from '@/types'

// ============================================
// INTERFACES
// ============================================

interface MenuStore {
  // State
  menu: MenuItem[]
  permissions: string[]
  locale: string
  loading: boolean
  error: string | null
  cached: boolean
  cacheExpiresAt: number | null
  activeMenuId: string | null

  // Actions
  fetchMenu: (locale?: string) => Promise<void>
  clearCache: () => Promise<void>
  setActiveMenu: (menuId: string | null) => void
  canAccessPath: (path: string) => boolean
  findMenuByUrl: (url: string) => MenuItem | undefined
  getMenuBreadcrumbs: (menuId: string) => MenuItem[]
  refreshMenu: () => Promise<void>
}

// ============================================
// SESSION STORAGE ADAPTER
// ============================================

const sessionStorageAdapter = {
  getItem: (name: string) => {
    const value = sessionStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name)
  },
}

// ============================================
// STORE
// ============================================

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      // Initial state
      menu: [],
      permissions: [],
      locale: 'uz',
      loading: false,
      error: null,
      cached: false,
      cacheExpiresAt: null,
      activeMenuId: null,

      /**
       * Fetch menu from backend
       *
       * Automatically uses cached version if valid
       * Backend handles permission filtering
       */
      fetchMenu: async (locale?: string) => {
        set({ loading: true, error: null })

        try {
          const currentLocale = locale || get().locale || 'uz'

          console.log('🔄 [MenuStore] Fetching menu', { locale: currentLocale })

          const response = await menuApi.getMenu(currentLocale)

          // Axios interceptor unwraps Laravel format and adds _success, _meta
          if (response._success !== false) {
            console.log('✅ [MenuStore] Menu loaded successfully!', {
              items: response.menu.length,
              permissions: response.permissions.length,
              cached: response._meta?.cached,
              menuItems: response.menu.map((m: any) => m.label).join(', ')
            })

            set({
              menu: response.menu,
              permissions: response.permissions,
              locale: response.locale,
              cached: response._meta?.cached || false,
              cacheExpiresAt: response._meta?.cache_expires_at || null,
              loading: false,
              error: null,
            })

            console.log('✅ [MenuStore] State updated, menu length:', response.menu.length)
          } else {
            throw new Error('Failed to load menu')
          }
        } catch (error: any) {
          console.error('❌ [MenuStore] Failed to fetch menu', error)

          // If 401 error, don't set error state - let API interceptor redirect to login
          if (error.response?.status === 401) {
            console.log('🔒 [MenuStore] 401 error - API interceptor will redirect to login')
            set({ loading: false, error: null })
            // Don't set error - interceptor will redirect
            return
          }

          set({
            loading: false,
            error: error.response?.data?.message || error.message || 'Failed to load menu',
          })
        }
      },

      /**
       * Clear menu cache on backend
       */
      clearCache: async () => {
        try {
          console.log('[MenuStore] Clearing cache')

          await menuApi.clearMenuCache()

          // Refresh menu after clearing cache
          await get().fetchMenu()
        } catch (error: any) {
          console.error('[MenuStore] Failed to clear cache', error)

          // If 401 error, let API interceptor redirect to login
          if (error.response?.status === 401) {
            console.log('🔒 [MenuStore] 401 error - redirecting to login')
            return
          }

          set({ error: error.message || 'Failed to clear cache' })
        }
      },

      /**
       * Set active menu ID
       *
       * Used for highlighting current menu item
       */
      setActiveMenu: (menuId: string | null) => {
        set({ activeMenuId: menuId })
        sessionStorage.setItem('activeMenuId', menuId || '')
      },

      /**
       * Check if user can access a path
       *
       * Uses permissions from menu response
       */
      canAccessPath: (path: string): boolean => {
        const { permissions } = get()

        if (permissions.length === 0) {
          return false
        }

        // Admin wildcard
        if (permissions.includes('*')) {
          return true
        }

        // Normalize path
        const normalizedPath = path.replace(/^\/+|\/+$/g, '')

        // Convert path to permission format (e.g., 'student/student' → 'student.view')
        const pathParts = normalizedPath.split('/')
        const resource = pathParts[0]
        const action = pathParts[1] || 'view'

        const permission = `${resource}.${action}`

        // Exact match
        if (permissions.includes(permission)) {
          return true
        }

        // Wildcard pattern (e.g., 'student.*' matches 'student.view')
        const wildcardPermission = `${resource}.*`
        if (permissions.includes(wildcardPermission)) {
          return true
        }

        return false
      },

      /**
       * Find menu item by URL
       */
      findMenuByUrl: (url: string): MenuItem | undefined => {
        const { menu } = get()

        const findInItems = (items: MenuItem[]): MenuItem | undefined => {
          for (const item of items) {
            if (item.url === url) {
              return item
            }

            if (item.items && item.items.length > 0) {
              const found = findInItems(item.items)
              if (found) {
                return found
              }
            }
          }

          return undefined
        }

        return findInItems(menu)
      },

      /**
       * Get breadcrumbs for a menu item
       */
      getMenuBreadcrumbs: (menuId: string): MenuItem[] => {
        const { menu } = get()
        const breadcrumbs: MenuItem[] = []

        const findPath = (items: MenuItem[], id: string, path: MenuItem[]): boolean => {
          for (const item of items) {
            path.push(item)

            if (item.id === id) {
              breadcrumbs.push(...path)
              return true
            }

            if (item.items && item.items.length > 0) {
              if (findPath(item.items, id, path)) {
                return true
              }
            }

            path.pop()
          }

          return false
        }

        findPath(menu, menuId, [])
        return breadcrumbs
      },

      /**
       * Refresh menu (force fetch)
       */
      refreshMenu: async () => {
        await get().clearCache()
      },
    }),
    {
      name: 'menu-storage',
      storage: sessionStorageAdapter,
      partialize: (state) => ({
        menu: state.menu,
        permissions: state.permissions,
        locale: state.locale,
        cached: state.cached,
        cacheExpiresAt: state.cacheExpiresAt,
        activeMenuId: state.activeMenuId,
      }),
    }
  )
)

// ============================================
// HOOKS (Optional)
// ============================================

/**
 * Hook to get active menu item
 */
export const useActiveMenu = (): MenuItem | undefined => {
  const { menu, activeMenuId } = useMenuStore()

  if (!activeMenuId) {
    return undefined
  }

  const findInItems = (items: MenuItem[]): MenuItem | undefined => {
    for (const item of items) {
      if (item.id === activeMenuId) {
        return item
      }

      if (item.items && item.items.length > 0) {
        const found = findInItems(item.items)
        if (found) {
          return found
        }
      }
    }

    return undefined
  }

  return findInItems(menu)
}

/**
 * Hook to check if user can access a permission
 */
export const usePermission = (permission?: string): boolean => {
  const { permissions } = useMenuStore()

  if (!permission) {
    return true
  }

  // Admin wildcard
  if (permissions.includes('*')) {
    return true
  }

  // Exact match
  if (permissions.includes(permission)) {
    return true
  }

  // Wildcard pattern
  const parts = permission.split('.')
  if (parts.length >= 2) {
    const wildcardPermission = `${parts[0]}.*`
    if (permissions.includes(wildcardPermission)) {
      return true
    }
  }

  return false
}
