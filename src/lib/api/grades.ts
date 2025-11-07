import { api } from './client'

// ==================== TYPES ====================

export interface GradeRecord {
  id: number
  student_id: number
  student_name: string
  student_id_number: string
  subject_id: number
  grade_type: string // "midterm", "final", "quiz", "assignment", "project"
  grade_value: number
  max_grade: number
  percentage: number
  date: string
  description?: string
  created_at: string
}

export interface StudentGrade {
  student_id: number
  student_name: string
  student_id_number: string
  group_name?: string
  grades: GradeRecord[]
  average_grade: number
  total_points: number
  max_points: number
  percentage: number
  letter_grade: string // A, B, C, D, F
}

export interface GradesListResponse {
  success: boolean
  data: StudentGrade[]
}

export interface GradeReportData {
  subject_id: number
  subject_name: string
  total_students: number
  average_grade: number
  highest_grade: number
  lowest_grade: number
  by_grade_type: {
    type: string
    average: number
    count: number
  }[]
  by_letter_grade: {
    letter: string
    count: number
    percentage: number
  }[]
  students: {
    student_id: number
    student_name: string
    average_grade: number
    letter_grade: string
  }[]
}

export interface GradeReportResponse {
  success: boolean
  data: GradeReportData
}

export interface CreateGradePayload {
  student_id: number
  subject_id: number
  grade_type: string
  grade_value: number
  max_grade: number
  date: string
  description?: string
}

export interface UpdateGradePayload {
  grade_value?: number
  max_grade?: number
  date?: string
  description?: string
}

export interface GradeResponse {
  success: boolean
  data: GradeRecord
  message?: string
}

// ==================== API FUNCTIONS ====================

/**
 * Get grades list for a subject
 */
export const getSubjectGrades = async (
  subjectId: number,
  params?: {
    grade_type?: string
  }
): Promise<GradesListResponse> => {
  const response = await api.get(`/subject/${subjectId}/grades`, { params })
  return response.data
}

/**
 * Create a new grade
 */
export const createGrade = async (
  payload: CreateGradePayload
): Promise<GradeResponse> => {
  const response = await api.post('/grade', payload)
  return response.data
}

/**
 * Update a grade
 */
export const updateGrade = async (
  gradeId: number,
  payload: UpdateGradePayload
): Promise<GradeResponse> => {
  const response = await api.put(`/grade/${gradeId}`, payload)
  return response.data
}

/**
 * Delete a grade
 */
export const deleteGrade = async (
  gradeId: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(`/grade/${gradeId}`)
  return response.data
}

/**
 * Get grade report
 */
export const getGradeReport = async (params: {
  subject_id?: number
  student_id?: number
}): Promise<GradeReportResponse> => {
  const response = await api.get('/grade/report', { params })
  return response.data
}

// ==================== CONSTANTS ====================

export const GRADE_TYPES = {
  midterm: { label: "Oraliq nazorat", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  final: { label: "Yakuniy nazorat", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  quiz: { label: "Test", color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  assignment: { label: "Topshiriq", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  project: { label: "Loyiha", color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
  attendance: { label: "Davomat", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
} as const

export const LETTER_GRADES = {
  A: { min: 90, max: 100, label: "A'lo", color: "bg-green-500 text-white" },
  B: { min: 80, max: 89, label: "Yaxshi", color: "bg-blue-500 text-white" },
  C: { min: 70, max: 79, label: "Qoniqarli", color: "bg-yellow-500 text-white" },
  D: { min: 60, max: 69, label: "Qoniqarsiz", color: "bg-orange-500 text-white" },
  F: { min: 0, max: 59, label: "Qoniqarsiz", color: "bg-red-500 text-white" },
} as const

export const getLetterGrade = (percentage: number): keyof typeof LETTER_GRADES => {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}
