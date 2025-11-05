/**
 * User Profile Store (REFACTORED)
 *
 * Responsibilities:
 * - User data management
 * - Profile updates
 * - Avatar management
 * - Role switching
 *
 * Single Responsibility Principle: Only handles user profile
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/lib/api/auth'
import { User, sessionStorageAdapter } from '@/stores/types/auth.types'
import { getApiOrigin } from '@/config/api'

interface UserState {
  // State
  user: User | null
  loading: boolean
  error: string | null
  permissionsCachedAt: number | null

  // Actions
  fetchCurrentUser: () => Promise<void>
  refreshUserSilent: () => Promise<void>
  switchRole: (roleId: number) => Promise<void>
  setUser: (user: User) => void
  setUserFromApi: (apiUser: any) => void
  updateProfile: (data: any) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  clearUser: () => void
  setPermissionsCachedAt: (timestamp: number | null) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: false,
      error: null,
      permissionsCachedAt: null,

      /**
       * Fetch Current User
       */
      fetchCurrentUser: async () => {
        const userType = sessionStorage.getItem('user_type') as 'employee' | 'student'

        if (!userType) {
          return
        }

        set({ loading: true })

        try {
          const response = await authApi.getCurrentUser(userType)

          if (response.success) {
            const mappedUser = buildUserFromApi(response.data)

            set({
              user: mappedUser,
              loading: false,
            })
          }
        } catch (error) {
          console.error('Fetch user failed:', error)
          set({ loading: false })
          // If fetch fails, import and call logout from authStore
          const { useAuthStore } = await import('./authStore')
          useAuthStore.getState().logout()
        }
      },

      /**
       * Refresh current user WITHOUT toggling global loading state
       * Used for locale-change rehydration so UI doesn't get stuck
       */
      refreshUserSilent: async () => {
        const userType = sessionStorage.getItem('user_type') as 'employee' | 'student'
        if (!userType) {
          return
        }
        try {
          const response = await authApi.getCurrentUser(userType)
          if (response.success) {
            const mappedUser = buildUserFromApi(response.data)
            set({ user: mappedUser })
          }
        } catch (error) {
          // Fail silently - do not disrupt UI
          console.warn('[auth] refreshUserSilent failed:', error)
        }
      },

      /**
       * Switch active role (employee only)
       */
      switchRole: async (roleId: number) => {
        const { user } = get()
        if (!user || user.type !== 'employee') return
        set({ loading: true, error: null })
        try {
          const response = await authApi.switchEmployeeRole(roleId)
          if (response.success) {
            const { user: apiUser, access_token } = response.data
            const mappedUser = buildUserFromApi(apiUser)

            sessionStorage.setItem('access_token', access_token)

            set({
              user: mappedUser,
              loading: false,
              permissionsCachedAt: Date.now(),
            })

            // Update token in authStore
            const { useAuthStore } = await import('./authStore')
            useAuthStore.getState().setToken(access_token)
          } else {
            set({ loading: false, error: response.message ?? 'Rolni o\'zgartirishda xatolik' })
          }
        } catch (e: any) {
          set({ loading: false, error: e.response?.data?.message || 'Rolni o\'zgartirishda xatolik' })
        }
      },

      /**
       * Set User
       */
      setUser: (user: User) => {
        set({ user })
      },

      /**
       * Set User from API response (builds User object from raw API data)
       */
      setUserFromApi: (apiUser: any) => {
        const mappedUser = buildUserFromApi(apiUser)
        set({ user: mappedUser })
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
          const response = user.type === 'employee'
            ? await authApi.updateEmployeeProfile(data)
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
          const response = user.type === 'employee'
            ? await authApi.uploadEmployeeAvatar(file)
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
       * Clear User (called on logout)
       */
      clearUser: () => {
        set({
          user: null,
          permissionsCachedAt: null,
          error: null,
        })
      },

      /**
       * Set Permissions Cache Timestamp
       */
      setPermissionsCachedAt: (timestamp: number | null) => {
        set({ permissionsCachedAt: timestamp })
      },
    }),
    {
      name: 'user-storage',
      storage: sessionStorageAdapter,
      partialize: (state) => ({
        user: state.user,
        permissionsCachedAt: state.permissionsCachedAt,
      }),
    }
  )
)

/**
 * Helper: Map Laravel role to frontend role
 */
function mapRole(role: string | number | undefined, type: string): string {
  if (typeof role === 'string' && role.trim().length > 0) {
    return role
  }
  if (typeof role === 'number') {
    return String(role)
  }
  return type === 'student' ? 'student' : 'admin'
}

const resolveApiOrigin = () => {
  return getApiOrigin()
}

const normalizeAvatarUrl = (value?: string | null): string | undefined => {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  const origin = resolveApiOrigin()
  return `${origin}/${value.replace(/^\/+/, '')}`
}

const mapRolesArray = (roles: any[] | undefined): Array<{ id?: number; code?: string | null; name: string }> => {
  if (!Array.isArray(roles)) return []
  return roles
    .filter((role) => role)
    .map((role) => ({
      id: typeof role.id === 'number' ? role.id : (typeof role.code === 'number' ? role.code : undefined),
      code: role.code ?? null,
      name: role.name ?? role.code ?? `#${role.id ?? role.code ?? ''}`,
    }))
}

const buildUserFromApi = (apiUser: any): User => {
  const type = apiUser?.type === 'admin' ? 'employee' : apiUser?.type ?? 'employee'
  const roles = mapRolesArray(apiUser?.roles)
  const roleCode = apiUser?.role_code ?? (typeof apiUser?.role === 'string' ? apiUser.role : undefined) ?? roles[0]?.code
  const roleId = apiUser?.role_id ?? roles.find((r) => (roleCode ? r.code === roleCode : false))?.id ?? roles[0]?.id ?? null
  const roleName = apiUser?.role_name ?? roles.find((r) => (roleId ? r.id === roleId : false) || (roleCode ? r.code === roleCode : false))?.name ?? null
  const resolvedRole = mapRole(roleCode, type)
  const resolvedRoleName = roleName ?? resolvedRole

  const employee = apiUser?.employee
  const avatarCandidate = apiUser?.avatar_url || employee?.avatar_url || employee?.image
  const avatar = normalizeAvatarUrl(avatarCandidate) ?? (type === 'employee' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(apiUser?.full_name ?? 'user')}` : undefined)

  return {
    id: apiUser?.id,
    name: apiUser?.full_name ?? '',
    email: apiUser?.email ?? undefined,
    phone: apiUser?.phone ?? undefined,
    role: resolvedRole,
    roleId,
    roleName: resolvedRoleName,
    roles,
    type,
    avatar,
    department: employee?.department ?? undefined,
    faculty: apiUser?.meta?.specialty?.name ?? undefined,
    login: apiUser?.login ?? undefined,
    student_id: apiUser?.student_id_number ?? undefined,
    active: Boolean(apiUser?.active),
    permissions: apiUser?.permissions ?? [],
    employee,
    meta: apiUser?.meta,
  }
}
