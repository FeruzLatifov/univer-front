/**
 * API Hooks Index
 *
 * Centralized exports for all React Query hooks organized by module
 *
 * Structure:
 * - teacher: All teacher-related hooks (tests, assignments, schedule, etc.)
 * - student: All student-related hooks (dashboard, courses, grades, etc.)
 * - admin: All admin-related hooks (students, departments, employees, etc.)
 *
 * Usage:
 * ```typescript
 * // Import specific module hooks
 * import * as teacherHooks from '@/hooks/api/teacher'
 * import * as studentHooks from '@/hooks/api/student'
 * import * as adminHooks from '@/hooks/api/admin'
 *
 * // Or import specific hooks directly
 * import { useTests, useAssignments } from '@/hooks/api/teacher'
 * ```
 */

// Teacher hooks
export * as teacherHooks from './teacher'

// Student hooks
export * as studentHooks from './student'

// Admin hooks
export * as adminHooks from './admin'

// Also export individual modules for direct access
export * from './teacher'
export * from './student'
export * from './admin'
