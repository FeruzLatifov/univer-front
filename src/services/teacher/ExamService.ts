import { BaseApiService } from '../base/BaseApiService'

// ==================== TYPES ====================

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

export interface ExamDetail {
  exam: Exam
  results: ExamResult[]
  statistics: ExamStatistics
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

export const EXAM_TYPES = {
  midterm: { label: 'Oraliq nazorat', color: 'bg-blue-100 text-blue-700' },
  final: { label: 'Yakuniy imtihon', color: 'bg-purple-100 text-purple-700' },
  makeup: { label: 'Qayta topshirish', color: 'bg-orange-100 text-orange-700' },
}

// ==================== SERVICE ====================

/**
 * Teacher Exam Service
 * Manages exams and exam results
 */
export class ExamService extends BaseApiService {
  constructor() {
    super('/v1/teacher/exams')
  }

  /**
   * Get all exams for teacher
   */
  async getExams() {
    return this.get<Exam[]>('')
  }

  /**
   * Get exam details with results and statistics
   */
  async getExamDetail(examId: number) {
    return this.get<ExamDetail>(`/${examId}`)
  }

  /**
   * Create new exam
   */
  async createExam(payload: CreateExamPayload) {
    return this.post<Exam>('', payload)
  }

  /**
   * Submit exam results for multiple students
   */
  async submitExamResults(examId: number, results: { student_id: number; score: number }[]) {
    return this.post(`/${examId}/results`, { results })
  }

  /**
   * Get exam statistics
   */
  async getStatistics(examId: number) {
    return this.get<ExamStatistics>(`/${examId}/statistics`)
  }

  /**
   * Get spreadsheet-style roster for inline grading
   */
  async getRoster(examId: number) {
    return this.get<ExamRosterResponse>(`/${examId}/roster`)
  }

  /**
   * Submit results with letter grade and comment per row
   */
  async submitRoster(
    examId: number,
    rows: Array<{
      student_id: number
      score?: number
      grade?: string | null
      attended?: boolean
      notes?: string | null
    }>
  ) {
    return this.post(`/${examId}/results`, { results: rows })
  }
}

export interface ExamRosterRow {
  student_id: number
  student_id_number: string
  full_name: string
  first_name: string
  second_name: string
  result: {
    id: number
    score: number
    max_score: number
    grade: string | null
    letter_grade: string | null
    attended: boolean
    comment: string | null
    graded_at: string | null
  } | null
}

export interface ExamRosterResponse {
  exam: {
    id: number
    title: string
    exam_type: string
    exam_date: string
    max_score: number
    passing_score: number
    subject: { id: number; name: string } | null
    group: { id: number; name: string } | null
  }
  roster: ExamRosterRow[]
  total_students: number
  entered: number
}

// Export singleton instance
export const teacherExamService = new ExamService()
