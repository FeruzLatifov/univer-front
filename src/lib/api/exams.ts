import { api } from './client'

export interface Exam {
  id: number
  subject_id: number
  subject_name?: string
  exam_type: string // "midterm", "final", "makeup"
  exam_date: string
  duration: number // minutes
  max_score: number
  room?: string
  description?: string
  active: boolean
  created_at: string
}

export interface ExamResult {
  id: number
  exam_id: number
  student_id: number
  student_name: string
  student_id_number: string
  score: number
  percentage: number
  letter_grade: string
  submitted_at?: string
}

export interface ExamStatistics {
  total_students: number
  submitted_count: number
  average_score: number
  highest_score: number
  lowest_score: number
  pass_rate: number
}

export interface ExamsResponse {
  success: boolean
  data: Exam[]
}

export interface ExamDetailResponse {
  success: boolean
  data: {
    exam: Exam
    results: ExamResult[]
    statistics: ExamStatistics
  }
}

export interface CreateExamPayload {
  subject_id: number
  exam_type: string
  exam_date: string
  duration: number
  max_score: number
  room?: string
  description?: string
}

export const getTeacherExams = async (): Promise<ExamsResponse> => {
  const response = await api.get('/teacher/exams')
  return response.data
}

export const getExamDetail = async (examId: number): Promise<ExamDetailResponse> => {
  const response = await api.get(`/exam/${examId}`)
  return response.data
}

export const createExam = async (payload: CreateExamPayload): Promise<{ success: boolean; data: Exam }> => {
  const response = await api.post('/exam', payload)
  return response.data
}

export const submitExamResults = async (
  examId: number,
  results: { student_id: number; score: number }[]
): Promise<{ success: boolean }> => {
  const response = await api.post(`/exam/${examId}/results`, { results })
  return response.data
}

export const EXAM_TYPES = {
  midterm: { label: 'Oraliq nazorat', color: 'bg-blue-100 text-blue-700' },
  final: { label: 'Yakuniy imtihon', color: 'bg-purple-100 text-purple-700' },
  makeup: { label: 'Qayta topshirish', color: 'bg-orange-100 text-orange-700' },
}
