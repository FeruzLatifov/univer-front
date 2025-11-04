import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthInit } from '@/hooks/useAuthInit'
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute'
import { initGlobalFavicon } from '@/utils/favicon'

// Layouts
import MainLayout from '@/components/layouts/MainLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage'

// Pages
import DashboardPage from '@/pages/dashboard/RoleDashboard'

// Structure
import UniversityPage from '@/pages/structure/UniversityPage'
import FacultiesPage from '@/pages/structure/FacultiesPageNew'
import DepartmentsPage from '@/pages/structure/DepartmentsPageNew'

// Employees
import EmployeesPage from '@/pages/employees/EmployeesPage'
import TeachersWorkloadPage from '@/pages/employees/TeachersWorkloadPage'
import AcademicDegreesPage from '@/pages/employees/AcademicDegreesPage'

// Employee
import TeacherLoadPage from '@/pages/employee/TeacherLoadPage'

// Decrees & Transfers
import DecreesPage from '@/pages/decrees/DecreesPage'
import TransfersPage from '@/pages/decrees/TransfersPage'

// Students
import StudentsPage from '@/pages/students/StudentsPageCompact'
import StudentDetailPage from '@/pages/students/StudentDetailPage'
import GroupsPage from '@/pages/students/GroupsPage'

// Performance
import PerformancePage from '@/pages/performance/PerformancePageCompact'
import GPAPage from '@/pages/performance/GPAPage'

// Attendance
import AttendancePage from '@/pages/attendance/AttendancePage'

// Finance
import FinancePage from '@/pages/finance/FinancePage'
import ContractsPage from '@/pages/finance/ContractsPage'
import PaymentsPage from '@/pages/finance/PaymentsPage'

// Curriculum
import CurriculumPage from '@/pages/curriculum/CurriculumPage'
import SubjectsPage from '@/pages/curriculum/SubjectsPage'
import SchedulePage from '@/pages/curriculum/SchedulePage'

// Teachers
import TeachersPage from '@/pages/teachers/TeachersPage'
import { AssignmentsPage } from '@/pages/teachers/assignments/AssignmentsPage'
import { CreateAssignmentPage } from '@/pages/teachers/assignments/CreateAssignmentPage'
import { AssignmentDetailPage } from '@/pages/teachers/assignments/AssignmentDetailPage'
import { TestsPage } from '@/pages/teachers/tests'
import { CreateEditTestPage } from '@/pages/teachers/tests/CreateEditTestPage'
import { QuestionsPage } from '@/pages/teachers/tests/QuestionsPage'
import { TestResultsPage } from '@/pages/teachers/tests/TestResultsPage'
import { AttemptDetailPage } from '@/pages/teachers/tests/AttemptDetailPage'

// Teacher - New Pages
import TeacherSubjectsPage from '@/pages/teacher/SubjectsPage'
import TeacherSubjectDetailPage from '@/pages/teacher/SubjectDetailPage'
import TeacherSchedulePage from '@/pages/teacher/SchedulePage'
import TeacherWorkloadPage from '@/pages/teacher/WorkloadPage'
import TeacherAttendancePage from '@/pages/teacher/AttendancePage'
import TeacherGradesPage from '@/pages/teacher/GradesPage'
import TeacherResourcesPage from '@/pages/teacher/ResourcesPage'
import TeacherTopicsPage from '@/pages/teacher/TopicsPage'
import TeacherExamsPage from '@/pages/teacher/ExamsPage'
import TeacherReportsPage from '@/pages/teacher/ReportsPage'

// Messaging & Notifications
import MessagesPage from '@/pages/teacher/MessagesPage'
import ComposeMessagePage from '@/pages/teacher/ComposeMessagePage'
import MessageDetailPage from '@/pages/teacher/MessageDetailPage'
import NotificationsPage from '@/pages/teacher/NotificationsPage'
import NotificationSettingsPage from '@/pages/teacher/NotificationSettingsPage'

// Forum/Discussion
import ForumCategoriesPage from '@/pages/teacher/ForumCategoriesPage'
import ForumTopicsPage from '@/pages/teacher/ForumTopicsPage'
import ForumTopicDetailPage from '@/pages/teacher/ForumTopicDetailPage'
import CreateTopicPage from '@/pages/teacher/CreateTopicPage'

// Student Portal
import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentSubjectsPage from '@/pages/student/StudentSubjectsPage'
import StudentAssignmentsPage from '@/pages/student/StudentAssignmentsPage'
import StudentGradesPage from '@/pages/student/StudentGradesPage'
import StudentTestsPage from '@/pages/student/StudentTestsPage'
import StudentAttendancePage from '@/pages/student/StudentAttendancePage'
import StudentSchedulePage from '@/pages/student/StudentSchedulePage'
import StudentDocumentsPage from '@/pages/student/StudentDocumentsPage'
import StudentResourcesPage from '@/pages/student/StudentResourcesPage'
import StudentExamsPage from '@/pages/student/StudentExamsPage'
import StudentProfilePage from '@/pages/student/StudentProfilePage'
import StudentSemestersPage from '@/pages/student/StudentSemestersPage'
import StudentGPADetailPage from '@/pages/student/StudentGPADetailPage'

// Exams
import ExamsPage from '@/pages/exams/ExamsPage'

// Archive
import ArchivePage from '@/pages/archive/ArchivePage'
import DiplomasPage from '@/pages/archive/DiplomasPage'

// Reports
import ReportsPage from '@/pages/reports/ReportsPage'
import SignDocumentsPage from '@/pages/documents/SignDocumentsPage'

// System
import SystemUsersPage from '@/pages/system/UsersPage'
import SystemRolesPage from '@/pages/system/RolesPage'
import SettingsPage from '@/pages/settings/SettingsPage'

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
          <ProtectedRoute permission="document.sign.view" resourcePath="document/sign-documents">
            <SignDocumentsPage />
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

