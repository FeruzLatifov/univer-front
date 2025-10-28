import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, User } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][]
  redirectTo?: string
}

/**
 * Protected Route Component
 *
 * Protects routes from unauthenticated access
 * Optionally restricts access by role
 *
 * @param children - The component to render if authorized
 * @param allowedRoles - Optional array of roles that can access this route
 * @param redirectTo - Where to redirect if not authorized (default: /login)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuthStore()
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

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // User is authenticated but doesn't have required role
      return (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      )
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
