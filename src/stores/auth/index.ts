/**
 * Auth Stores Barrel Export
 *
 * Provides convenient single import point for all auth-related stores
 *
 * Usage:
 * import { useAuthStore, useUserStore, usePermissionStore } from '@/stores/auth'
 */

export { useAuthStore } from './authStore'
export { useUserStore } from './userStore'
export { usePermissionStore } from './permissionStore'

// Re-export types for convenience
export type { User, JWTPayload } from '@/stores/types/auth.types'
