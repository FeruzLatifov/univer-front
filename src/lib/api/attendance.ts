import { api } from './client'

// ==================== TYPES ====================

export interface AttendanceRecord {
  id: number
  student_id: number
  student_name: string
  student_id_number: string
  lesson_date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  reason?: string
  marked_at?: string
  marked_by?: string
}

export interface StudentAttendance {
  student_id: number
  student_name: string
  student_id_number: string
  group_name?: string
  total_lessons: number
  present_count: number
  absent_count: number
  late_count: number
  excused_count: number
  attendance_percentage: number
  records: AttendanceRecord[]
}

export interface AttendanceListResponse {
  success: boolean
  data: StudentAttendance[]
}

export interface AttendanceReportData {
  subject_id: number
  subject_name: string
  total_lessons: number
  total_students: number
  average_attendance: number
  by_date: {
    date: string
    present: number
    absent: number
    late: number
    excused: number
    percentage: number
  }[]
  by_student: {
    student_id: number
    student_name: string
    attendance_percentage: number
    present_count: number
    absent_count: number
  }[]
}

export interface AttendanceReportResponse {
  success: boolean
  data: AttendanceReportData
}

export interface MarkAttendancePayload {
  student_id: number
  lesson_date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  reason?: string
}

export interface BulkMarkAttendancePayload {
  lesson_date: string
  attendance: {
    student_id: number
    status: 'present' | 'absent' | 'late' | 'excused'
    reason?: string
  }[]
}

export interface AttendanceResponse {
  success: boolean
  data: AttendanceRecord
  message?: string
}

// ==================== API FUNCTIONS ====================

/**
 * Get attendance list for a subject
 */
export const getSubjectAttendance = async (
  subjectId: number,
  params?: {
    date_from?: string
    date_to?: string
  }
): Promise<AttendanceListResponse> => {
  const response = await api.get(`/subject/${subjectId}/attendance`, { params })
  return response.data
}

/**
 * Mark attendance for a student
 */
export const markAttendance = async (
  payload: MarkAttendancePayload
): Promise<AttendanceResponse> => {
  const response = await api.post('/attendance/mark', payload)
  return response.data
}

/**
 * Bulk mark attendance for multiple students
 */
export const bulkMarkAttendance = async (
  subjectId: number,
  payload: BulkMarkAttendancePayload
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/subject/${subjectId}/attendance/bulk`, payload)
  return response.data
}

/**
 * Update attendance record
 */
export const updateAttendance = async (
  attendanceId: number,
  payload: Partial<MarkAttendancePayload>
): Promise<AttendanceResponse> => {
  const response = await api.put(`/attendance/${attendanceId}`, payload)
  return response.data
}

/**
 * Get attendance report
 */
export const getAttendanceReport = async (
  params: {
    subject_id?: number
    student_id?: number
    date_from?: string
    date_to?: string
  }
): Promise<AttendanceReportResponse> => {
  const response = await api.get('/attendance/report', { params })
  return response.data
}

// ==================== CONSTANTS ====================

export const ATTENDANCE_STATUSES = {
  present: {
    label: 'Keldi',
    value: 'present',
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: '✓',
  },
  absent: {
    label: 'Kelmadi',
    value: 'absent',
    color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    icon: '✗',
  },
  late: {
    label: 'Kechikdi',
    value: 'late',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    icon: '◷',
  },
  excused: {
    label: 'Sababli',
    value: 'excused',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: '◔',
  },
} as const

export type AttendanceStatus = keyof typeof ATTENDANCE_STATUSES
