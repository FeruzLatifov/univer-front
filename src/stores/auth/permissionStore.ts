/**
 * Permission Store (REFACTORED)
 *
 * Responsibilities:
 * - JWT token validation
 * - Permission checking
 * - Access control
 * - Background permission refresh
 *
 * Single Responsibility Principle: Only handles permissions
 */
import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import { JWTPayload } from '@/stores/types/auth.types'
import { API_BASE_URL } from '@/config/api'
import { useAuthStore } from './authStore'
import { useUserStore } from './userStore'

interface PermissionState {
  // Actions
  getJWTPermissions: () => string[] | null
  isTokenValid: () => boolean
  canAccessPath: (path: string) => boolean
  isPermissionsCacheValid: () => boolean
  refreshPermissionsInBackground: () => Promise<void>
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  /**
   * Get permissions from JWT token (secure source)
   * JWT is signed by backend, cannot be tampered via F12
   * @returns Permissions array or null if token invalid
   */
  getJWTPermissions: (): string[] | null => {
    // Get token from authStore
    const { token } = useAuthStore.getState()

    if (!token) {
      return null
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token)

      // Check if token expired
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('⚠️ JWT token expired')
        useAuthStore.getState().logout()
        return null
      }

      return decoded.permissions || []
    } catch (error) {
      console.error('❌ Invalid JWT token:', error)
      // Don't logout on parse error - might be old token format
      return null
    }
  },

  /**
   * Verify that localStorage permissions match JWT permissions
   * Detects F12 tampering attempts
   * @returns true if valid, false if tampered (triggers logout)
   */
  isTokenValid: (): boolean => {
    const { user } = useUserStore.getState()
    const { getJWTPermissions } = get()

    if (!user || !user.permissions) {
      return false
    }

    const jwtPermissions = getJWTPermissions()

    // If JWT doesn't have permissions, fall back to localStorage (backward compatibility)
    if (!jwtPermissions) {
      return true
    }

    // Sort and compare to detect tampering
    const localPerms = [...user.permissions].sort()
    const jwtPerms = [...jwtPermissions].sort()

    const match = JSON.stringify(localPerms) === JSON.stringify(jwtPerms)

    if (!match) {
      console.error('⚠️ SECURITY ALERT: Permissions tampered via F12!')
      console.error('LocalStorage permissions:', localPerms)
      console.error('JWT token permissions:', jwtPerms)
      console.error('Logging out for security...')
      useAuthStore.getState().logout()
      return false
    }

    return true
  },

  /**
   * Check if permissions cache is still valid
   * TTL: 15 minutes (configurable)
   */
  isPermissionsCacheValid: (): boolean => {
    const { permissionsCachedAt } = useUserStore.getState()

    if (!permissionsCachedAt) {
      return false
    }

    const CACHE_TTL = 15 * 60 * 1000 // 15 minutes
    const cacheAge = Date.now() - permissionsCachedAt

    return cacheAge < CACHE_TTL
  },

  /**
   * Refresh permissions in background (non-blocking)
   * Called automatically when cache expires
   * Performance: No user impact, instant page loads
   */
  refreshPermissionsInBackground: async (): Promise<void> => {
    const { user } = useUserStore.getState()
    const { token } = useAuthStore.getState()
    const { isPermissionsCacheValid } = get()

    // Skip if no user or cache still valid
    if (!user || !token || isPermissionsCacheValid()) {
      return
    }

    try {
      console.log('🔄 Refreshing permissions in background...')

      // Non-blocking API call
      const response = await fetch(`${API_BASE_URL}/v1/user/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Permission refresh failed')
      }

      const data = await response.json()
      const newPermissions = data.data?.permissions || data.permissions

      if (newPermissions) {
        // Update user permissions in userStore
        useUserStore.setState({
          user: {
            ...user,
            permissions: newPermissions
          },
          permissionsCachedAt: Date.now()
        })

        console.log('✅ Permissions refreshed:', newPermissions.length, 'permissions')
      }
    } catch (error) {
      console.warn('⚠️ Background permission refresh failed:', error)
      // Fail silently - don't block user, use cached permissions
    }
  },

  /**
   * Check if user can access a specific path
   * SECURITY: Uses JWT token permissions (F12-proof)
   * PERFORMANCE: Triggers background refresh if cache expired
   */
  canAccessPath: (path: string): boolean => {
    const { user } = useUserStore.getState()
    const { isTokenValid, getJWTPermissions, refreshPermissionsInBackground } = get()

    if (!user) {
      return false
    }

    // CRITICAL SECURITY: Verify token hasn't been tampered
    // If localStorage permissions don't match JWT, logout and deny access
    if (!isTokenValid()) {
      console.error('❌ Access denied: Token validation failed')
      return false
    }

    // PERFORMANCE: Trigger background refresh if cache expired (non-blocking)
    refreshPermissionsInBackground()

    // Get permissions from JWT (secure source, not localStorage)
    const permissions = getJWTPermissions()

    // Fallback to localStorage if JWT doesn't have permissions (backward compatibility)
    const effectivePermissions = permissions || user.permissions || []

    if (effectivePermissions.length === 0) {
      return false
    }

    // Admin has access to everything
    if (user.role === 'admin' || effectivePermissions.includes('*')) {
      return true
    }

    // Normalize path (remove leading/trailing slashes)
    const normalizedPath = path.replace(/^\/+|\/+$/g, '')

    // Check exact match
    if (effectivePermissions.includes(normalizedPath)) {
      return true
    }

    // Check if any parent path is allowed (e.g., "employees" allows "employees/workload")
    return effectivePermissions.some(permission => {
      const normalizedPermission = permission.replace(/^\/+|\/+$/g, '')
      return normalizedPath.startsWith(normalizedPermission + '/')
    })
  },
}))
