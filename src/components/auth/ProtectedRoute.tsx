import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, User } from '@/stores/authStore'
import { NotFoundPage } from '@/pages/NotFoundPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][] // Frontend fallback (for UX)
  resourcePath?: string // Backend permission path (for real security)
  redirectTo?: string
}

/**
 * Protected Route Component
 *
 * Protects routes from unauthenticated access
 * Uses TWO-LAYER protection:
 * 1. Frontend role check (UX only) - allowedRoles
 * 2. Backend permission check (REAL security) - resourcePath
 *
 * @param children - The component to render if authorized
 * @param allowedRoles - Optional array of roles for frontend UX (F12 can bypass this)
 * @param resourcePath - Backend resource path (e.g., "structure/faculties") - CANNOT be bypassed
 * @param redirectTo - Where to redirect if not authorized (default: /login)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  resourcePath,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, canAccessPath } = useAuthStore()
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
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // PRIMARY SECURITY: Backend permission check (CANNOT be bypassed via F12)
  if (resourcePath) {
    if (!canAccessPath(resourcePath)) {
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
