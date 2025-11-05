import { useUserStore } from '@/stores/auth'
import TeacherDashboard from './TeacherDashboard'
import DashboardUltra from './DashboardUltra'
import { Navigate } from 'react-router-dom'

/**
 * Role-based Dashboard Router
 *
 * Automatically shows the appropriate dashboard based on user's role:
 * - teacher, department → TeacherDashboard
 * - admin, super_admin, dean, rector → DashboardUltra (admin dashboard)
 * - student → Redirect to /student/dashboard
 * - default → DashboardUltra
 */
export default function RoleDashboard() {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Student should use their own portal
  if (user.type === 'student') {
    return <Navigate to="/student/dashboard" replace />
  }

  // Teacher and Department roles → Teacher Dashboard
  if (user.role === 'teacher' || user.role_code === 'teacher' ||
      user.role === 'department' || user.role_code === 'department') {
    return <TeacherDashboard />
  }

  // Admin, Super Admin, Dean, Rector → Admin Dashboard
  if (user.role === 'admin' || user.role_code === 'admin' ||
      user.role === 'super_admin' || user.role_code === 'super_admin' ||
      user.role === 'minadmin' || user.role_code === 'minadmin' ||
      user.role === 'dean' || user.role_code === 'dean' ||
      user.role === 'rector' || user.role_code === 'rector') {
    return <DashboardUltra />
  }

  // Default fallback
  return <DashboardUltra />
}
