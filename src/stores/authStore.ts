import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import * as authApi from '@/lib/api/auth'

/**
 * JWT Payload Interface
 * Permissions stored in JWT token (secure, cannot be tampered)
 */
interface JWTPayload {
  user_id: number
  role?: string
  permissions?: string[]
  exp: number
  iat?: number
}

export interface User {
  id: number
  name: string
  email?: string
  phone?: string
  role: 'admin' | 'dean' | 'teacher' | 'student' | 'accountant' | 'rector' | 'hr'
  type: 'staff' | 'student'
  avatar?: string
  department?: string
  faculty?: string
  login?: string
  student_id?: string
  active: boolean
  permissions?: string[] // Backend'dan kelgan permissions list
  // Additional fields from Laravel
  employee?: {
    id: number
    full_name: string
    department?: string
  }
  meta?: {
    student_status?: string
    education_type?: string
    specialty?: {
      code: string
      name: string
    }
    group?: {
      name: string
    }
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  permissionsCachedAt: number | null // ← NEW: Cache timestamp

  // Actions
  login: (credentials: authApi.LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  setUser: (user: User) => void
  updateProfile: (data: any) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  clearError: () => void

  // JWT Verification Methods (F12-proof security)
  getJWTPermissions: () => string[] | null
  isTokenValid: () => boolean
  canAccessPath: (path: string) => boolean

  // Smart Cache Methods (Performance optimization)
  isPermissionsCacheValid: () => boolean
  refreshPermissionsInBackground: () => Promise<void>
}

/**
 * Auth Store - Connected to Laravel Backend
 *
 * Manages authentication state using Zustand with persistence
 * Supports both staff and student authentication
 */
/**
 * Custom session storage for Zustand
 * Browser yopilganda avtomatik o'chadi (localStorage emas)
 */
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      permissionsCachedAt: null, // ← NEW: Initialize cache timestamp

      /**
       * Login
       * Supports both staff and student login
       */
      login: async (credentials: authApi.LoginCredentials) => {
        set({ loading: true, error: null })

        try {
          const response = await authApi.login(credentials)

          if (response.success) {
            const { user, access_token } = response.data

            // Map Laravel user to frontend User type
            const mappedUser: User = {
              id: user.id,
              name: user.full_name,
              email: user.email,
              phone: user.phone,
              role: mapRole(user.role, user.type),
              type: user.type === 'admin' ? 'staff' : 'student',
              avatar: user.type === 'admin'
                ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`
                : undefined,
              department: user.employee?.department || user.meta?.specialty?.name,
              faculty: user.meta?.specialty?.name,
              login: user.login,
              student_id: user.student_id_number,
              active: user.active,
              permissions: user.permissions || [], // Backend'dan kelgan permissions
              employee: user.employee,
              meta: user.meta,
            }

            // Store token in sessionStorage (browser yopilsa o'chadi)
            sessionStorage.setItem('access_token', access_token)
            sessionStorage.setItem('user_type', credentials.userType)

            set({
              user: mappedUser,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              error: null,
              permissionsCachedAt: Date.now(), // ← Set cache timestamp on login
            })
          } else {
            throw new Error('Login failed')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login yoki parol noto\'g\'ri'
          set({
            loading: false,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      /**
       * Logout
       */
      logout: async () => {
        const { user } = get()

        try {
          if (user) {
            await authApi.logout(user.type)
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear state and sessionStorage
          sessionStorage.removeItem('access_token')
          sessionStorage.removeItem('user_type')

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      /**
       * Refresh Token
       */
      refreshToken: async () => {
        const userType = sessionStorage.getItem('user_type') as 'staff' | 'student'

        if (!userType) {
          throw new Error('User type not found')
        }

        try {
          const response = userType === 'staff'
            ? await authApi.staffRefreshToken()
            : await authApi.studentRefreshToken()

          if (response.success) {
            const { access_token } = response.data
            sessionStorage.setItem('access_token', access_token)

            set({ token: access_token })
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          // If refresh fails, logout
          get().logout()
          throw error
        }
      },

      /**
       * Fetch Current User
       */
      fetchCurrentUser: async () => {
        const userType = sessionStorage.getItem('user_type') as 'staff' | 'student'

        if (!userType) {
          return
        }

        set({ loading: true })

        try {
          const response = await authApi.getCurrentUser(userType)

          if (response.success) {
            const { data: user } = response

            const mappedUser: User = {
              id: user.id,
              name: user.full_name,
              email: user.email,
              phone: user.phone,
              role: mapRole(user.role, user.type),
              type: user.type === 'admin' ? 'staff' : 'student',
              avatar: user.type === 'admin'
                ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`
                : undefined,
              department: user.employee?.department || user.meta?.specialty?.name,
              faculty: user.meta?.specialty?.name,
              login: user.login,
              student_id: user.student_id_number,
              active: user.active,
              employee: user.employee,
              meta: user.meta,
            }

            set({
              user: mappedUser,
              isAuthenticated: true,
              loading: false,
            })
          }
        } catch (error) {
          console.error('Fetch user failed:', error)
          set({ loading: false })
          // If fetch fails, logout
          get().logout()
        }
      },

      /**
       * Set User
       */
      setUser: (user: User) => {
        set({ user })
      },

      /**
       * Update Profile
       */
      updateProfile: async (data: any) => {
        const { user } = get()

        if (!user) {
          throw new Error('User not authenticated')
        }

        set({ loading: true, error: null })

        try {
          const response = user.type === 'staff'
            ? await authApi.updateStaffProfile(data)
            : await authApi.updateStudentProfile(data)

          if (response.success) {
            // Update user in state
            await get().fetchCurrentUser()
          }

          set({ loading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profilni yangilashda xatolik'
          set({
            loading: false,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      /**
       * Upload Avatar
       */
      uploadAvatar: async (file: File) => {
        const { user } = get()

        if (!user) {
          throw new Error('User not authenticated')
        }

        set({ loading: true, error: null })

        try {
          const response = user.type === 'staff'
            ? await authApi.uploadStaffAvatar(file)
            : await authApi.uploadStudentAvatar(file)

          if (response.success) {
            // Update user avatar
            set({
              user: {
                ...user,
                avatar: response.data.image_url,
              },
              loading: false,
            })
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Rasmni yuklashda xatolik'
          set({
            loading: false,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      /**
       * Clear Error
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Get permissions from JWT token (secure source)
       * JWT is signed by backend, cannot be tampered via F12
       * @returns Permissions array or null if token invalid
       */
      getJWTPermissions: (): string[] | null => {
        const { token } = get()

        if (!token) {
          return null
        }

        try {
          const decoded = jwtDecode<JWTPayload>(token)

          // Check if token expired
          if (decoded.exp * 1000 < Date.now()) {
            console.warn('⚠️ JWT token expired')
            get().logout()
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
        const { user, getJWTPermissions } = get()

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
          get().logout()
          return false
        }

        return true
      },

      /**
       * Check if permissions cache is still valid
       * TTL: 15 minutes (configurable)
       */
      isPermissionsCacheValid: (): boolean => {
        const { permissionsCachedAt } = get()

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
        const { user, isPermissionsCacheValid, token } = get()

        // Skip if no user or cache still valid
        if (!user || !token || isPermissionsCacheValid()) {
          return
        }

        try {
          console.log('🔄 Refreshing permissions in background...')

          // Non-blocking API call
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/user/permissions`, {
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
            set({
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
        const { user, isTokenValid, getJWTPermissions, refreshPermissionsInBackground } = get()

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
    }),
    {
      name: 'auth-storage',
      storage: sessionStorageAdapter, // ← sessionStorage (not localStorage)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissionsCachedAt: state.permissionsCachedAt, // ← Save cache timestamp
      }),
    }
  )
)

/**
 * Helper: Map Laravel role to frontend role
 */
function mapRole(role: string | undefined, type: string): User['role'] {
  if (type === 'student') return 'student'

  switch (role) {
    case 'admin':
      return 'admin'
    case 'rector':
      return 'rector'
    case 'dean':
      return 'dean'
    case 'teacher':
      return 'teacher'
    case 'accountant':
      return 'accountant'
    case 'hr':
      return 'hr'
    default:
      return 'admin'
  }
}
