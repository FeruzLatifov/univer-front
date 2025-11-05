/**
 * API Services Layer
 *
 * Centralized service layer for all API interactions.
 * Follows Clean Architecture pattern matching the Laravel backend.
 *
 * Usage:
 * ```typescript
 * import { teacherDashboardService, studentProfileService } from '@/services'
 *
 * // In component
 * const data = await teacherDashboardService.getDashboardData()
 * const profile = await studentProfileService.getProfile()
 * ```
 */

// Base
export * from './base/BaseApiService'

// Teacher Services
export * from './teacher'

// Student Services
export * from './student'

// Admin Services
export * from './admin'

// Shared Services
export * from './shared'
