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

import { ReactNode, useMemo } from 'react'
import { useMenuStore } from '@/stores/menuStore'

interface RequirePermissionProps {
  permission: string | string[] // Single permission or array of permissions
  requireAll?: boolean // If array, require all permissions (AND) or any (OR). Default: false (OR)
  fallback?: ReactNode // Optional fallback component to show if no permission
  children: ReactNode
}

const evaluatePermission = (permissions: string[], perm: string): boolean => {
  if (permissions.includes('*')) {
    return true
  }

  if (permissions.includes(perm)) {
    return true
  }

  const parts = perm.split('.')
  if (parts.length >= 2) {
    const wildcardPermission = `${parts[0]}.*`
    if (permissions.includes(wildcardPermission)) {
      return true
    }
  }

  return false
}

export function RequirePermission({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const permissions = useMenuStore((state) => state.permissions)

  const hasAccess = useMemo(() => {
    if (typeof permission === 'string') {
      return evaluatePermission(permissions, permission)
    }

    if (Array.isArray(permission)) {
      const checks = permission.map((perm) => evaluatePermission(permissions, perm))
      return requireAll ? checks.every(Boolean) : checks.some(Boolean)
    }

    return false
  }, [permission, permissions, requireAll])

  return hasAccess ? <>{children}</> : <>{fallback}</>
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
  const permissions = useMenuStore((state) => state.permissions)

  return useMemo(() => {
    if (typeof permission === 'string') {
      return evaluatePermission(permissions, permission)
    }

    if (Array.isArray(permission)) {
      const checks = permission.map((perm) => evaluatePermission(permissions, perm))
      return requireAll ? checks.every(Boolean) : checks.some(Boolean)
    }

    return false
  }, [permission, permissions, requireAll])
}
