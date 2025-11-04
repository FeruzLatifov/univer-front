import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, User } from '@/stores/authStore'
import { useMenuStore, usePermission } from '@/stores/menuStore'
import { NotFoundPage } from '@/pages/NotFoundPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][] // Frontend fallback (for UX)
  resourcePath?: string // Backend permission path (for real security)
  permission?: string // Permission name (e.g., 'student.view')
  redirectTo?: string
}

/**
 * Protected Route Component (v2.0 with Menu Integration)
 *
 * Protects routes from unauthenticated access
 * Uses THREE-LAYER protection:
 * 1. Frontend role check (UX only) - allowedRoles
 * 2. Backend permission check (REAL security) - permission
 * 3. Backend resource path check - resourcePath
 *
 * @param children - The component to render if authorized
 * @param allowedRoles - Optional array of roles for frontend UX (F12 can bypass this)
 * @param permission - Permission name (e.g., 'student.view') - CANNOT be bypassed
 * @param resourcePath - Backend resource path (e.g., "structure/faculties") - CANNOT be bypassed
 * @param redirectTo - Where to redirect if not authorized (default: /login)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  resourcePath,
  permission,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, canAccessPath } = useAuthStore()
  const { canAccessPath: canAccessMenuPath } = useMenuStore()
  const location = useLocation()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  // Also check if token actually exists in sessionStorage (not just persisted state)
  const hasToken = sessionStorage.getItem('access_token')

  if (!isAuthenticated || !user || !hasToken) {
    console.log('🔒 [ProtectedRoute] Redirecting to login', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!hasToken
    })
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // PRIMARY SECURITY: Permission-based check (CANNOT be bypassed via F12)
  // This is the NEW menu-based permission system
  if (permission) {
    const hasPermission = usePermission(permission)
    if (!hasPermission) {
      console.warn(`Access denied. Required permission: ${permission}, User role: ${user.role}`)
      // SECURITY: Show 404 instead of 403/Unauthorized
      // Makes it look like page doesn't exist (safer)
      return <NotFoundPage />
    }
  }

  // SECONDARY SECURITY: Backend resource path check (Legacy support)
  if (resourcePath) {
    // Check using authStore (JWT permissions)
    const canAccessAuth = canAccessPath(resourcePath)
    // Check using menuStore (menu permissions)
    const canAccessMenu = canAccessMenuPath(resourcePath)

    if (!canAccessAuth && !canAccessMenu) {
      console.warn(`Access denied to resource: ${resourcePath}. User role: ${user.role}`)
      // SECURITY: Show 404 instead of 403/Unauthorized
      // Makes it look like page doesn't exist (safer)
      return <NotFoundPage />
    }
  }

  // SECONDARY: Frontend role check (UX only - can be bypassed via F12, but backend will reject API calls)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      console.warn(`Access denied by role. Required: ${allowedRoles.join(', ')}, User: ${user.role}`)
      // SECURITY: Show 404 instead of 403/Unauthorized
      // Doesn't reveal that page exists
      return <NotFoundPage />
    }
  }

  // User is authenticated and authorized
  return <>{children}</>
}

/**
 * Public Route Component
 *
 * Redirects authenticated users away from auth pages
 * Useful for login page - if already logged in, go to dashboard
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  // Also check if token actually exists
  const hasToken = sessionStorage.getItem('access_token')

  if (isAuthenticated && hasToken) {
    console.log('🔄 [PublicRoute] User authenticated, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
