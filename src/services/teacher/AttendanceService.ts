/**
 * Teacher Attendance Service
 *
 * Handles attendance marking and reporting.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface AttendanceRecord {
  id: number
  student: {
    id: number
    name: string
    student_id: string
  }
  schedule: {
    id: number
    lesson: string
    group: string
    date: string
  }
  status: 'present' | 'absent' | 'late' | 'excused'
  marked_at: string
  notes?: string
}

export interface BulkAttendanceData {
  schedule_id: number
  attendance: Array<{
    student_id: number
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
  }>
}

export interface AttendanceReport {
  group_id: number
  lesson_id: number
  date_from: string
  date_to: string
  students: Array<{
    id: number
    name: string
    total_classes: number
    present: number
    absent: number
    late: number
    excused: number
    attendance_rate: number
  }>
}

/**
 * Teacher Attendance Service
 */
export class TeacherAttendanceService extends BaseApiService {
  constructor() {
    super('/v1/teacher/attendance')
  }

  /**
   * Get attendance for specific schedule
   */
  async getAttendance(scheduleId: number): Promise<AttendanceRecord[]> {
    return this.get<AttendanceRecord[]>(`/schedule/${scheduleId}`)
  }

  /**
   * Mark bulk attendance for a class
   */
  async markAttendance(data: BulkAttendanceData) {
    return this.post('/mark', data)
  }

  /**
   * Update single attendance record
   */
  async updateAttendance(id: number, data: { status: string; notes?: string }) {
    return this.put(`/${id}`, data)
  }

  /**
   * Get attendance report for group
   */
  async getReport(params: {
    group_id: number
    lesson_id?: number
    date_from: string
    date_to: string
  }): Promise<AttendanceReport> {
    const query = this.buildQueryString(params)
    return this.get<AttendanceReport>(`/report${query}`)
  }

  /**
   * Get student attendance history
   */
  async getStudentAttendance(studentId: number, lessonId?: number) {
    const query = lessonId ? this.buildQueryString({ lesson_id: lessonId }) : ''
    return this.get(`/student/${studentId}${query}`)
  }
}

// Export singleton instance
export const teacherAttendanceService = new TeacherAttendanceService()
