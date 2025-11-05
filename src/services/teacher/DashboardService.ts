/**
 * Teacher Dashboard Service
 *
 * Handles all teacher dashboard-related API calls.
 * Mirrors backend TeacherDashboardService pattern.
 */

import { BaseApiService } from '../base/BaseApiService'

/**
 * Dashboard data interfaces
 */
export interface TeacherDashboardData {
  summary: {
    today_classes: number
    total_students: number
    pending_grades: number
    attendance_rate: number
  }
  today_schedule: Array<{
    id: number
    lesson: {
      id: number
      name: string
      code: string
    }
    group: {
      id: number
      name: string
    }
    start_time: string
    end_time: string
    room: string
    building: string
    lesson_type: string
  }>
  recent_activities: Array<{
    id: number
    type: 'attendance' | 'grade' | 'assignment'
    student_name: string
    subject: string
    date: string
    details: string
  }>
  upcoming_deadlines: Array<{
    id: number
    title: string
    type: string
    due_date: string
    subject: string
  }>
}

export interface StatisticsData {
  total_classes: number
  total_students: number
  avg_attendance: number
  total_grades: number
  pending_assignments: number
  completed_assignments: number
}

/**
 * Teacher Dashboard Service
 */
export class TeacherDashboardService extends BaseApiService {
  constructor() {
    super('/v1/teacher/dashboard')
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(): Promise<TeacherDashboardData> {
    return this.get<TeacherDashboardData>()
  }

  /**
   * Get teacher statistics
   */
  async getStatistics(): Promise<StatisticsData> {
    return this.get<StatisticsData>('/stats')
  }

  /**
   * Get today's schedule only
   */
  async getTodaySchedule() {
    return this.get('/schedule/today')
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10) {
    const query = this.buildQueryString({ limit })
    return this.get(`/activities${query}`)
  }

  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(limit: number = 5) {
    const query = this.buildQueryString({ limit })
    return this.get(`/deadlines${query}`)
  }
}

// Export singleton instance
export const teacherDashboardService = new TeacherDashboardService()
