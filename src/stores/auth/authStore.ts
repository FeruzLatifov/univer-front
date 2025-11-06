/**
 * Authentication Store (REFACTORED)
 *
 * Responsibilities:
 * - Login/Logout
 * - Token management
 * - Session state
 *
 * Single Responsibility Principle: Only handles authentication
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/lib/api/auth'
import { sessionStorageAdapter } from '@/stores/types/auth.types'
import { useUserStore } from './userStore'
import { logger } from '@/utils/logger'

interface AuthState {
  // State
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (credentials: authApi.LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void

  // Internal helpers
  setToken: (token: string | null) => void
  setAuthenticated: (isAuth: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      /**
       * Login
       * Supports both employee and student login
       */
      login: async (credentials: authApi.LoginCredentials) => {
        set({ loading: true, error: null })

        try {
          // authApi.login() returns AuthResponse (already unwrapped by auth.ts)
          const response = await authApi.login(credentials)
          if (response.success) {
            const { user, access_token } = response.data

            logger.debug('[AuthStore] Login successful', {
              userId: user.id,
              userName: user.name,
              userType: credentials.userType,
            })

            // Store tokens in sessionStorage (browser yopilsa o'chadi)
            // JWT uses same token for access and refresh
            sessionStorage.setItem('access_token', access_token)
            sessionStorage.setItem('refresh_token', access_token) // ← JWT same token for refresh
            sessionStorage.setItem('user_type', credentials.userType as string)

            set({
              token: access_token,
              isAuthenticated: true,
              loading: false,
              error: null,
            })

            // Update user in userStore
            useUserStore.getState().setUserFromApi(user)
            // Set permissions cache timestamp
            useUserStore.getState().setPermissionsCachedAt(Date.now())

          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error: any) {
          const errorMessage = error.message || error.response?.data?.message || 'Login yoki parol noto\'g\'ri'
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
        const user = useUserStore.getState().user

        try {
          if (user) {
            await authApi.logout(user.type)
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear state and sessionStorage
          sessionStorage.removeItem('access_token')
          sessionStorage.removeItem('refresh_token')
          sessionStorage.removeItem('user_type')

          set({
            token: null,
            isAuthenticated: false,
            error: null,
          })

          // Clear user store
          useUserStore.getState().clearUser()

          // Redirect to login page
          window.location.href = '/login'
        }
      },

      /**
       * Refresh Token
       */
      refreshToken: async () => {
        const userType = sessionStorage.getItem('user_type') as 'employee' | 'student'

        if (!userType) {
          throw new Error('User type not found')
        }

        try {
          const response = userType === 'employee'
            ? await authApi.employeeRefreshToken()
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
       * Clear Error
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Set Token (Internal helper)
       */
      setToken: (token: string | null) => {
        set({ token })
      },

      /**
       * Set Authenticated (Internal helper)
       */
      setAuthenticated: (isAuth: boolean) => {
        set({ isAuthenticated: isAuth })
      },
    }),
    {
      name: 'auth-storage',
      storage: sessionStorageAdapter, // ← sessionStorage (not localStorage)
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
