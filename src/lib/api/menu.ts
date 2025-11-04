/**
 * Menu API Client
 *
 * Handles all menu-related API calls
 * Connected to Laravel backend menu system
 *
 * @version 1.0
 * @author Univer Development Team
 */

import { apiClient } from './client'

// ============================================
// TYPES
// ============================================

export interface MenuItem {
  id: string
  label: string
  url: string
  icon: string
  permission?: string | null
  items: MenuItem[]
  active: boolean
  order?: number | null
}

// Axios interceptor unwraps Laravel format, so actual response is:
export interface MenuResponse {
  menu: MenuItem[]
  permissions: string[]
  locale: string
  _success?: boolean
  _message?: string
  _meta?: {
    cached: boolean
    cache_expires_at: number | null
    generated_at: string
  }
}

export interface CheckAccessRequest {
  path: string
}

export interface CheckAccessResponse {
  success: boolean
  data: {
    path: string
    accessible: boolean
  }
}

export interface MenuStructureResponse {
  success: boolean
  data: {
    menu: Record<string, any>
  }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get filtered menu for authenticated employee user
 *
 * @param locale - Optional locale (uz, oz, ru, en)
 * @returns Filtered menu based on user permissions
 *
 * @example
 * const menu = await getMenu('uz')
 * console.log(menu.data.menu) // Array of menu items
 */
export const getMenu = async (locale?: string): Promise<MenuResponse> => {
  const response = await apiClient.get<MenuResponse>('/v1/employee/menu', {
    params: { locale },
  })

  return response.data
}

/**
 * Check if current user can access a specific path
 *
 * @param path - URL path to check (e.g., 'student/student')
 * @returns Whether user has access to the path
 *
 * @example
 * const result = await checkAccess('student/student')
 * if (result.data.accessible) {
 *   // User can access
 * }
 */
export const checkAccess = async (path: string): Promise<CheckAccessResponse> => {
  const response = await apiClient.post<CheckAccessResponse>('/v1/employee/menu/check-access', {
    path,
  })

  return response.data
}

/**
 * Clear menu cache for current user
 *
 * Useful after role change or permission update
 *
 * @example
 * await clearMenuCache()
 */
export const clearMenuCache = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/v1/employee/menu/clear-cache')
  return response.data
}

/**
 * Get full menu structure (admin only)
 *
 * Returns unfiltered menu configuration
 * Requires admin privileges
 *
 * @example
 * const structure = await getMenuStructure()
 * console.log(structure.data.menu) // Full menu config
 */
export const getMenuStructure = async (): Promise<MenuStructureResponse> => {
  const response = await apiClient.get<MenuStructureResponse>('/v1/employee/menu/structure')
  return response.data
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Flatten menu tree to array
 *
 * @param menu - Menu items array
 * @returns Flattened array of all menu items
 */
export const flattenMenu = (menu: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = []

  const flatten = (items: MenuItem[]) => {
    items.forEach((item) => {
      result.push(item)
      if (item.items && item.items.length > 0) {
        flatten(item.items)
      }
    })
  }

  flatten(menu)
  return result
}

/**
 * Find menu item by ID
 *
 * @param menu - Menu items array
 * @param id - Menu item ID
 * @returns Menu item or undefined
 */
export const findMenuItemById = (menu: MenuItem[], id: string): MenuItem | undefined => {
  const flattened = flattenMenu(menu)
  return flattened.find((item) => item.id === id)
}

/**
 * Find menu item by URL
 *
 * @param menu - Menu items array
 * @param url - Menu item URL
 * @returns Menu item or undefined
 */
export const findMenuItemByUrl = (menu: MenuItem[], url: string): MenuItem | undefined => {
  const flattened = flattenMenu(menu)
  return flattened.find((item) => item.url === url)
}

/**
 * Get breadcrumbs for a menu item
 *
 * @param menu - Menu items array
 * @param itemId - Menu item ID
 * @returns Array of menu items representing breadcrumb trail
 */
export const getMenuBreadcrumbs = (menu: MenuItem[], itemId: string): MenuItem[] => {
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

  findPath(menu, itemId, [])
  return breadcrumbs
}

/**
 * Check if menu item is active based on current URL
 *
 * @param item - Menu item
 * @param currentUrl - Current URL path
 * @returns Whether menu item is active
 */
export const isMenuItemActive = (item: MenuItem, currentUrl: string): boolean => {
  // Remove leading/trailing slashes for comparison
  const itemPath = item.url.replace(/^\/|\/$/g, '')
  const currentPath = currentUrl.replace(/^\/|\/$/g, '')

  // Exact match
  if (itemPath === currentPath) {
    return true
  }

  // Check if current path starts with item path (for parent items)
  if (currentPath.startsWith(itemPath + '/')) {
    return true
  }

  // Check children
  if (item.items && item.items.length > 0) {
    return item.items.some((child) => isMenuItemActive(child, currentUrl))
  }

  return false
}
