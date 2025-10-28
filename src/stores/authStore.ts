import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/lib/api/auth'

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

  // Actions
  login: (credentials: authApi.LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  setUser: (user: User) => void
  updateProfile: (data: any) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  clearError: () => void
}

/**
 * Auth Store - Connected to Laravel Backend
 *
 * Manages authentication state using Zustand with persistence
 * Supports both staff and student authentication
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

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
              employee: user.employee,
              meta: user.meta,
            }

            // Store token in localStorage for API client
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('user_type', credentials.userType)

            set({
              user: mappedUser,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              error: null,
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
          // Clear state and localStorage
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_type')

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
        const userType = localStorage.getItem('user_type') as 'staff' | 'student'

        if (!userType) {
          throw new Error('User type not found')
        }

        try {
          const response = userType === 'staff'
            ? await authApi.staffRefreshToken()
            : await authApi.studentRefreshToken()

          if (response.success) {
            const { access_token } = response.data
            localStorage.setItem('access_token', access_token)

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
        const userType = localStorage.getItem('user_type') as 'staff' | 'student'

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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
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
