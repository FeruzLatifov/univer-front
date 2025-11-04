/**
 * Require Permission Component
 *
 * Conditional rendering based on permissions
 * Use for hiding/showing UI elements based on user permissions
 *
 * @example
 * <RequirePermission permission="student.create">
 *   <button>Create Student</button>
 * </RequirePermission>
 *
 * @version 1.0
 */

import { ReactNode } from 'react'
import { usePermission } from '@/stores/menuStore'

interface RequirePermissionProps {
  permission: string | string[] // Single permission or array of permissions
  requireAll?: boolean // If array, require all permissions (AND) or any (OR). Default: false (OR)
  fallback?: ReactNode // Optional fallback component to show if no permission
  children: ReactNode
}

export function RequirePermission({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: RequirePermissionProps) {
  // Handle single permission
  if (typeof permission === 'string') {
    const hasPermission = usePermission(permission)
    return hasPermission ? <>{children}</> : <>{fallback}</>
  }

  // Handle array of permissions
  if (Array.isArray(permission)) {
    const permissionChecks = permission.map((p) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return usePermission(p)
    })

    const hasAccess = requireAll
      ? permissionChecks.every((check) => check) // AND logic
      : permissionChecks.some((check) => check) // OR logic

    return hasAccess ? <>{children}</> : <>{fallback}</>
  }

  return <>{fallback}</>
}

/**
 * Hook version for conditional logic
 *
 * @example
 * const canCreate = useHasPermission('student.create')
 * if (canCreate) {
 *   // Show create button
 * }
 */
export function useHasPermission(permission: string | string[], requireAll = false): boolean {
  if (typeof permission === 'string') {
    return usePermission(permission)
  }

  if (Array.isArray(permission)) {
    const permissionChecks = permission.map((p) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return usePermission(p)
    })

    return requireAll
      ? permissionChecks.every((check) => check)
      : permissionChecks.some((check) => check)
  }

  return false
}
