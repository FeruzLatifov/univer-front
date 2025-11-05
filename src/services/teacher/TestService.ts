import { BaseApiService } from '../base/BaseApiService'

// ==================== TYPES ====================

export interface Test {
  id: number
  subject_id: number
  name: string
  description: string
  duration: number
  max_attempts: number
  passing_score: number
  shuffle_questions: boolean
  shuffle_answers: boolean
  show_results: boolean
  status: number
  questions_count: number
  attempts_count: number
  avg_score: number
  created_at: string
  updated_at: string
}

export interface TestQuestion {
  id: number
  question_text: string
  question_type: number
  points: number
  order_number: number
  answers: TestAnswer[]
}

export interface TestAnswer {
  id: number
  answer_text: string
  is_correct: boolean
  order_number: number
}

export interface TestFormData {
  subject_id: number
  name: string
  description?: string
  duration: number
  max_attempts: number
  passing_score: number
  shuffle_questions?: boolean
  shuffle_answers?: boolean
  show_results?: boolean
  status: number
}

export interface QuestionFormData {
  question_text: string
  question_type: number
  points: number
  answers: {
    answer_text: string
    is_correct: boolean
  }[]
}

export interface TestListParams {
  page?: number
  per_page?: number
  search?: string
  subject_id?: number
  status?: string
}

export interface TestResultsParams {
  page?: number
  per_page?: number
}

// ==================== SERVICE ====================

/**
 * Teacher Test Service
 * Manages tests, questions, results, and statistics
 */
export class TestService extends BaseApiService {
  constructor() {
    super('/v1/teacher/tests')
  }

  // ========== TEST CRUD ==========

  /**
   * Get all tests with filters and pagination
   */
  async getTests(params?: TestListParams) {
    const query = this.buildQueryString(params || {})
    return this.get<{
      data: Test[]
      meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }>(query)
  }

  /**
   * Get single test details
   */
  async getTest(testId: number) {
    return this.get<Test>(`/${testId}`)
  }

  /**
   * Create new test
   */
  async createTest(data: TestFormData) {
    return this.post<Test>('', data)
  }

  /**
   * Update test
   */
  async updateTest(testId: number, data: Partial<TestFormData>) {
    return this.put<Test>(`/${testId}`, data)
  }

  /**
   * Delete test
   */
  async deleteTest(testId: number) {
    return this.delete(`/${testId}`)
  }

  /**
   * Publish test (make it available to students)
   */
  async publishTest(testId: number) {
    return this.post(`/${testId}/publish`)
  }

  /**
   * Unpublish test (hide from students)
   */
  async unpublishTest(testId: number) {
    return this.post(`/${testId}/unpublish`)
  }

  // ========== QUESTIONS MANAGEMENT ==========

  /**
   * Get all questions for a test
   */
  async getTestQuestions(testId: number) {
    return this.get<TestQuestion[]>(`/${testId}/questions`)
  }

  /**
   * Get single question
   */
  async getTestQuestion(testId: number, questionId: number) {
    return this.get<TestQuestion>(`/${testId}/questions/${questionId}`)
  }

  /**
   * Add new question to test
   */
  async addQuestion(testId: number, data: QuestionFormData) {
    return this.post<TestQuestion>(`/${testId}/questions`, data)
  }

  /**
   * Update question
   */
  async updateQuestion(testId: number, questionId: number, data: Partial<QuestionFormData>) {
    return this.put<TestQuestion>(`/${testId}/questions/${questionId}`, data)
  }

  /**
   * Delete question
   */
  async deleteQuestion(testId: number, questionId: number) {
    return this.delete(`/${testId}/questions/${questionId}`)
  }

  /**
   * Reorder questions in test
   */
  async reorderQuestions(testId: number, questions: { id: number; order: number }[]) {
    return this.post(`/${testId}/questions/reorder`, { questions })
  }

  // ========== RESULTS & STATISTICS ==========

  /**
   * Get test results (student attempts)
   */
  async getTestResults(testId: number, params?: TestResultsParams) {
    const query = this.buildQueryString(params || {})
    return this.get(`/${testId}/results${query}`)
  }

  /**
   * Get test statistics
   */
  async getTestStatistics(testId: number) {
    return this.get(`/${testId}/statistics`)
  }

  // ========== IMPORT/EXPORT ==========

  /**
   * Import questions from Excel file
   */
  async importQuestions(testId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return this.post(`/${testId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Export test questions to Excel
   */
  async exportTest(testId: number) {
    const response = await this.client.get(`${this.basePath}/${testId}/export`, {
      responseType: 'blob',
    })

    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `test-${testId}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  /**
   * Export test results to Excel
   */
  async exportTestResults(testId: number) {
    const response = await this.client.get(`${this.basePath}/${testId}/results/export`, {
      responseType: 'blob',
    })

    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `test-${testId}-results.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  /**
   * Download import template Excel file
   */
  async downloadImportTemplate() {
    const response = await this.client.get('/v1/teacher/tests/import-template', {
      responseType: 'blob',
    })

    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'test-import-template.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}

// Export singleton instance
export const teacherTestService = new TestService()
