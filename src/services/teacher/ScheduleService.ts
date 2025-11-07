/**
 * Teacher Schedule Service
 *
 * Handles teacher schedule-related API calls.
 */

import { BaseApiService } from '../base/BaseApiService'
import type { WeeklySchedule, WorkloadData } from '@/lib/api/schedule'

export interface ScheduleItem {
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
  lesson_type: 'lecture' | 'practice' | 'lab' | 'seminar'
  date: string
  week_day: number
  pair_number: number
}

export interface ScheduleFilters {
  week?: number
  date_from?: string
  date_to?: string
  group_id?: number
  lesson_type?: string
}

/**
 * Teacher Schedule Service
 */
export class TeacherScheduleService extends BaseApiService {
  constructor() {
    super('/v1/teacher/schedule')
  }

  /**
   * Get teacher's schedule with optional filters
   */
  async getSchedule(filters?: ScheduleFilters): Promise<WeeklySchedule> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<WeeklySchedule>(query)
  }

  /**
   * Get schedule for specific week
   */
  async getWeekSchedule(weekNumber: number): Promise<ScheduleItem[]> {
    return this.get<ScheduleItem[]>(this.buildQueryString({ week: weekNumber }))
  }

  /**
   * Get schedule for specific date
   */
  async getDateSchedule(date: string): Promise<ScheduleItem[]> {
    return this.get<ScheduleItem[]>(this.buildQueryString({ date }))
  }

  /**
   * Get today's schedule
   */
  async getTodaySchedule(): Promise<ScheduleItem[]> {
    return this.get<ScheduleItem[]>('/today')
  }

  /**
   * Get schedule item details
   */
  async getScheduleItem(id: number) {
    return this.get(`/${id}`)
  }

  /**
   * Get teacher's workload statistics
   */
  async getWorkload() {
    return this.get<WorkloadData>('/workload')
  }
}

// Export singleton instance
export const teacherScheduleService = new TeacherScheduleService()
