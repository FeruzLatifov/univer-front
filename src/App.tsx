import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthInit } from '@/hooks/useAuthInit'
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute'
import { initGlobalFavicon } from '@/utils/favicon'

// Layouts
import MainLayout from '@/components/layouts/MainLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Auth Pages
import LoginPage from '@/modules/shared/pages/auth/LoginPage'
import ForgotPasswordPage from '@/modules/shared/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/modules/shared/pages/auth/ResetPasswordPage'
import UnauthorizedPage from '@/modules/shared/pages/auth/UnauthorizedPage'

// Pages
import DashboardPage from '@/modules/shared/pages/dashboard/RoleDashboard'

// Structure
import UniversityPage from '@/modules/admin/pages/structure/UniversityPage'
import FacultiesPage from '@/modules/admin/pages/structure/FacultiesPageNew'
import DepartmentsPage from '@/modules/admin/pages/structure/DepartmentsPageNew'

// Employees
import EmployeesPage from '@/modules/admin/pages/employees/EmployeesPage'
import TeachersWorkloadPage from '@/modules/admin/pages/employees/TeachersWorkloadPage'
import AcademicDegreesPage from '@/modules/admin/pages/employees/AcademicDegreesPage'

// Employee
import TeacherLoadPage from '@/modules/admin/pages/employee/TeacherLoadPage'

// Decrees & Transfers
import DecreesPage from '@/modules/admin/pages/decrees/DecreesPage'
import TransfersPage from '@/modules/admin/pages/decrees/TransfersPage'

// Students
import StudentsPage from '@/modules/admin/pages/students/StudentsPageCompact'
import StudentDetailPage from '@/modules/admin/pages/students/StudentDetailPage'
import GroupsPage from '@/modules/admin/pages/students/GroupsPage'

// Performance
import PerformancePage from '@/modules/admin/pages/performance/PerformancePageCompact'
import GPAPage from '@/modules/admin/pages/performance/GPAPage'

// Attendance
import AttendancePage from '@/modules/admin/pages/attendance/AttendancePage'

// Finance
import FinancePage from '@/modules/admin/pages/finance/FinancePage'
import ContractsPage from '@/modules/admin/pages/finance/ContractsPage'
import PaymentsPage from '@/modules/admin/pages/finance/PaymentsPage'

// Curriculum
import CurriculumPage from '@/modules/admin/pages/curriculum/CurriculumPage'
import SubjectsPage from '@/modules/admin/pages/curriculum/SubjectsPage'
import SchedulePage from '@/modules/admin/pages/curriculum/SchedulePage'

// Teachers (Admin section)
import TeachersPage from '@/modules/admin/pages/employees/TeachersPage'
import { AssignmentsPage } from '@/modules/teacher/pages/assignments/AssignmentsPage'
import { CreateAssignmentPage } from '@/modules/teacher/pages/assignments/CreateAssignmentPage'
import { AssignmentDetailPage } from '@/modules/teacher/pages/assignments/AssignmentDetailPage'
import { TestsPage } from '@/modules/teacher/pages/tests'
import { CreateEditTestPage } from '@/modules/teacher/pages/tests/CreateEditTestPage'
import { QuestionsPage } from '@/modules/teacher/pages/tests/QuestionsPage'
import { TestResultsPage } from '@/modules/teacher/pages/tests/TestResultsPage'
import { AttemptDetailPage } from '@/modules/teacher/pages/tests/AttemptDetailPage'

// Teacher - New Pages
import TeacherSubjectsPage from '@/modules/teacher/pages/SubjectsPage'
import TeacherSubjectDetailPage from '@/modules/teacher/pages/SubjectDetailPage'
import TeacherSchedulePage from '@/modules/teacher/pages/SchedulePage'
import TeacherWorkloadPage from '@/modules/teacher/pages/WorkloadPage'
import TeacherAttendancePage from '@/modules/teacher/pages/AttendancePage'
import TeacherGradesPage from '@/modules/teacher/pages/GradesPage'
import TeacherResourcesPage from '@/modules/teacher/pages/ResourcesPage'
import TeacherTopicsPage from '@/modules/teacher/pages/TopicsPage'
import TeacherExamsPage from '@/modules/teacher/pages/ExamsPage'
import TeacherReportsPage from '@/modules/teacher/pages/ReportsPage'

// Messaging & Notifications
import MessagesPage from '@/modules/teacher/pages/MessagesPage'
import ComposeMessagePage from '@/modules/teacher/pages/ComposeMessagePage'
import MessageDetailPage from '@/modules/teacher/pages/MessageDetailPage'
import NotificationsPage from '@/modules/teacher/pages/NotificationsPage'
import NotificationSettingsPage from '@/modules/teacher/pages/NotificationSettingsPage'

// Forum/Discussion
import ForumCategoriesPage from '@/modules/teacher/pages/ForumCategoriesPage'
import ForumTopicsPage from '@/modules/teacher/pages/ForumTopicsPage'
import ForumTopicDetailPage from '@/modules/teacher/pages/ForumTopicDetailPage'
import CreateTopicPage from '@/modules/teacher/pages/CreateTopicPage'

// Student Portal
import StudentDashboard from '@/modules/student/pages/StudentDashboard'
import StudentSubjectsPage from '@/modules/student/pages/StudentSubjectsPage'
import StudentAssignmentsPage from '@/modules/student/pages/StudentAssignmentsPage'
import StudentGradesPage from '@/modules/student/pages/StudentGradesPage'
import StudentTestsPage from '@/modules/student/pages/StudentTestsPage'
import StudentAttendancePage from '@/modules/student/pages/StudentAttendancePage'
import StudentSchedulePage from '@/modules/student/pages/StudentSchedulePage'
import StudentDocumentsPage from '@/modules/student/pages/StudentDocumentsPage'
import StudentResourcesPage from '@/modules/student/pages/StudentResourcesPage'
import StudentExamsPage from '@/modules/student/pages/StudentExamsPage'
import StudentProfilePage from '@/modules/student/pages/StudentProfilePage'
import StudentSemestersPage from '@/modules/student/pages/StudentSemestersPage'
import StudentGPADetailPage from '@/modules/student/pages/StudentGPADetailPage'

// Exams
import ExamsPage from '@/modules/admin/pages/exams/ExamsPage'

// Archive
import ArchivePage from '@/modules/admin/pages/archive/ArchivePage'
import DiplomasPage from '@/modules/admin/pages/archive/DiplomasPage'

// Reports
import ReportsPage from '@/modules/admin/pages/reports/ReportsPage'
import SignDocumentsPage from '@/modules/admin/pages/documents/SignDocumentsPage'

// Employee - Document Signing
import DocumentSignPage from '@/pages/employee/DocumentSignPage'

// System
import SystemUsersPage from '@/modules/admin/pages/system/UsersPage'
import SystemRolesPage from '@/modules/admin/pages/system/RolesPage'
import SettingsPage from '@/modules/admin/pages/SettingsPage'

function App() {
  // Initialize authentication on app load
  const isAuthInitialized = useAuthInit()

  // Initialize global favicon and system name from backend
  useEffect(() => {
    initGlobalFavicon()
  }, [])

  // Show loading screen while initializing auth
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        {/* Legacy Yii2-compatible URL */}
        <Route path="/dashboard/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        {/* Legacy Yii2-compatible URL */}
        <Route path="/dashboard/reset" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
      </Route>

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Structure */}
        <Route path="/structure/university" element={
          <ProtectedRoute allowedRoles={['admin', 'rector']} resourcePath="structure/university">
            <UniversityPage />
          </ProtectedRoute>
        } />
        <Route path="/structure/faculties" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'dean']} resourcePath="structure/faculties">
            <FacultiesPage />
          </ProtectedRoute>
        } />
        <Route path="/structure/departments" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'dean']} resourcePath="structure/departments">
            <DepartmentsPage />
          </ProtectedRoute>
        } />
        
        {/* Employees */}
        <Route path="/employees" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'dean', 'hr']} resourcePath="employees">
            <EmployeesPage />
          </ProtectedRoute>
        } />
        <Route path="/employees/workload" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'dean', 'hr']} resourcePath="employees/workload">
            <TeachersWorkloadPage />
          </ProtectedRoute>
        } />
        <Route path="/employees/academic-degrees" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'hr']} resourcePath="employees/academic-degrees">
            <AcademicDegreesPage />
          </ProtectedRoute>
        } />

        {/* Staff - Personal Work Plan (legacy Yii2 path only) */}

        {/* Legacy Yii2 path alias */}
        <Route path="/employee/teacher-load-formation" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']} permission="employee.load.view" resourcePath="employee/teacher-load-formation">
            <TeacherLoadPage />
          </ProtectedRoute>
        } />
        
        {/* Decrees & Transfers */}
        <Route path="/decrees" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'hr']} resourcePath="decrees">
            <DecreesPage />
          </ProtectedRoute>
        } />
        <Route path="/transfers" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'hr']} resourcePath="transfers">
            <TransfersPage />
          </ProtectedRoute>
        } />
        
        {/* Students */}
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/students/groups" element={<GroupsPage />} />
        
        {/* Performance */}
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/performance/gpa" element={<GPAPage />} />
        
        {/* Attendance */}
        <Route path="/attendance" element={<AttendancePage />} />
        
        {/* Finance - Only admin, rector, accountant */}
        <Route path="/finance" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'accountant']} resourcePath="finance">
            <FinancePage />
          </ProtectedRoute>
        } />
        <Route path="/finance/contracts" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'accountant']} resourcePath="finance/contracts">
            <ContractsPage />
          </ProtectedRoute>
        } />
        <Route path="/finance/payments" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'accountant']} resourcePath="finance/payments">
            <PaymentsPage />
          </ProtectedRoute>
        } />

        {/* Curriculum */}
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/curriculum/subjects" element={<SubjectsPage />} />
        <Route path="/curriculum/schedule" element={<SchedulePage />} />

        {/* Teachers */}
        <Route path="/teachers" element={<TeachersPage />} />

        {/* E-Documents */}
        <Route path="/document/sign-documents" element={
          <ProtectedRoute>
            <DocumentSignPage />
          </ProtectedRoute>
        } />

        {/* Teacher Assignments */}
        <Route path="/teacher/assignments" element={<AssignmentsPage />} />
        <Route path="/teacher/assignments/create" element={<CreateAssignmentPage />} />
        <Route path="/teacher/assignments/:id" element={<AssignmentDetailPage />} />
        <Route path="/teacher/assignments/:id/edit" element={<CreateAssignmentPage />} />

        {/* Teacher Tests */}
        <Route path="/teacher/tests" element={<TestsPage />} />
        <Route path="/teacher/tests/create" element={<CreateEditTestPage />} />
        <Route path="/teacher/tests/:id" element={<TestsPage />} />
        <Route path="/teacher/tests/:id/edit" element={<CreateEditTestPage />} />
        <Route path="/teacher/tests/:id/questions" element={<QuestionsPage />} />
        <Route path="/teacher/tests/:id/results" element={<TestResultsPage />} />
        <Route path="/teacher/tests/:id/attempts/:attemptId" element={<AttemptDetailPage />} />

        {/* Teacher - New Routes */}
        <Route path="/teacher/subjects" element={<TeacherSubjectsPage />} />
        <Route path="/teacher/subjects/:id" element={<TeacherSubjectDetailPage />} />
        <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />
        <Route path="/teacher/workload" element={<TeacherWorkloadPage />} />
        <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
        <Route path="/teacher/grades" element={<TeacherGradesPage />} />
        <Route path="/teacher/resources" element={<TeacherResourcesPage />} />
        <Route path="/teacher/topics" element={<TeacherTopicsPage />} />
        <Route path="/teacher/exams" element={<TeacherExamsPage />} />
        <Route path="/teacher/reports" element={<TeacherReportsPage />} />

        {/* Messaging & Notifications */}
        <Route path="/teacher/messages" element={<MessagesPage />} />
        <Route path="/teacher/messages/compose" element={<ComposeMessagePage />} />
        <Route path="/teacher/messages/:id" element={<MessageDetailPage />} />
        <Route path="/teacher/notifications" element={<NotificationsPage />} />
        <Route path="/teacher/notifications/settings" element={<NotificationSettingsPage />} />

        {/* Forum/Discussion */}
        <Route path="/teacher/forum" element={<ForumCategoriesPage />} />
        <Route path="/teacher/forum/categories/:categoryId" element={<ForumTopicsPage />} />
        <Route path="/teacher/forum/categories/:categoryId/create" element={<CreateTopicPage />} />
        <Route path="/teacher/forum/topics/:topicId" element={<ForumTopicDetailPage />} />

        {/* Student Portal */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/subjects" element={<StudentSubjectsPage />} />
        <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
        <Route path="/student/grades" element={<StudentGradesPage />} />
        <Route path="/student/tests" element={<StudentTestsPage />} />
        <Route path="/student/attendance" element={<StudentAttendancePage />} />
        <Route path="/student/schedule" element={<StudentSchedulePage />} />
        <Route path="/student/documents" element={<StudentDocumentsPage />} />
        <Route path="/student/resources" element={<StudentResourcesPage />} />
        <Route path="/student/exams" element={<StudentExamsPage />} />
        <Route path="/student/semesters" element={<StudentSemestersPage />} />
        <Route path="/student/gpa" element={<StudentGPADetailPage />} />

        {/* Exams */}
        <Route path="/exams" element={<ExamsPage />} />

        {/* Archive */}
        <Route path="/archive" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'hr']} resourcePath="archive">
            <ArchivePage />
          </ProtectedRoute>
        } />
        <Route path="/archive/diplomas" element={
          <ProtectedRoute allowedRoles={['admin', 'rector', 'hr']} resourcePath="archive/diplomas">
            <DiplomasPage />
          </ProtectedRoute>
        } />

        {/* Reports */}
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'rector']} resourcePath="reports">
            <ReportsPage />
          </ProtectedRoute>
        } />

        {/* System - Admin only */}
        <Route path="/system/users" element={
          <ProtectedRoute allowedRoles={['admin']} resourcePath="system/users">
            <SystemUsersPage />
          </ProtectedRoute>
        } />
        <Route path="/system/roles" element={
          <ProtectedRoute allowedRoles={['admin']} resourcePath="system/roles">
            <SystemRolesPage />
          </ProtectedRoute>
        } />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App

