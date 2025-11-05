/**
 * Student Dashboard Service
 *
 * Handles student dashboard-related API calls.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface StudentDashboardData {
  profile: {
    id: number
    name: string
    student_id: string
    group: string
    specialty: string
    course: number
    avatar?: string
  }
  summary: {
    gpa: number
    total_credits: number
    attendance_rate: number
    pending_assignments: number
  }
  today_schedule: Array<{
    id: number
    lesson_name: string
    teacher_name: string
    room: string
    building: string
    start_time: string
    end_time: string
    lesson_type: string
  }>
  recent_grades: Array<{
    id: number
    lesson_name: string
    type: string
    score: number
    max_score: number
    percentage: number
    date: string
  }>
  announcements: Array<{
    id: number
    title: string
    content: string
    date: string
    priority: string
  }>
}

/**
 * Student Dashboard Service
 */
export class StudentDashboardService extends BaseApiService {
  constructor() {
    super('/v1/student/dashboard')
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(): Promise<StudentDashboardData> {
    return this.get<StudentDashboardData>()
  }

  /**
   * Get student summary stats
   */
  async getSummary() {
    return this.get('/summary')
  }

  /**
   * Get today's schedule
   */
  async getTodaySchedule() {
    return this.get('/schedule/today')
  }

  /**
   * Get recent grades
   */
  async getRecentGrades(limit: number = 10) {
    const query = this.buildQueryString({ limit })
    return this.get(`/grades/recent${query}`)
  }

  /**
   * Get announcements
   */
  async getAnnouncements(limit: number = 5) {
    const query = this.buildQueryString({ limit })
    return this.get(`/announcements${query}`)
  }
}

// Export singleton instance
export const studentDashboardService = new StudentDashboardService()
