import { api } from './client'

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

// Get all tests
export const getTeacherTests = async (params?: {
  page?: number
  per_page?: number
  search?: string
  subject_id?: number
  status?: string
}) => {
  const response = await api.get('/v1/teacher/tests', { params })
  return response.data
}

// Get single test
export const getTest = async (id: number) => {
  const response = await api.get(`/v1/teacher/tests/${id}`)
  return response.data
}

// Create test
export const createTest = async (data: TestFormData) => {
  const response = await api.post('/v1/teacher/tests', data)
  return response.data
}

// Update test
export const updateTest = async (id: number, data: Partial<TestFormData>) => {
  const response = await api.put(`/v1/teacher/tests/${id}`, data)
  return response.data
}

// Delete test
export const deleteTest = async (id: number) => {
  const response = await api.delete(`/v1/teacher/tests/${id}`)
  return response.data
}

// Publish test
export const publishTest = async (id: number) => {
  const response = await api.post(`/v1/teacher/tests/${id}/publish`)
  return response.data
}

// Unpublish test
export const unpublishTest = async (id: number) => {
  const response = await api.post(`/v1/teacher/tests/${id}/unpublish`)
  return response.data
}

// Get test questions
export const getTestQuestions = async (testId: number) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/questions`)
  return response.data
}

// Get single test question
export const getTestQuestion = async (testId: number, questionId: number) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/questions/${questionId}`)
  return response.data
}

// Add question
export const addTestQuestion = async (testId: number, data: QuestionFormData) => {
  const response = await api.post(`/v1/teacher/tests/${testId}/questions`, data)
  return response.data
}

// Update question
export const updateTestQuestion = async (
  testId: number,
  questionId: number,
  data: Partial<QuestionFormData>
) => {
  const response = await api.put(`/v1/teacher/tests/${testId}/questions/${questionId}`, data)
  return response.data
}

// Delete question
export const deleteTestQuestion = async (testId: number, questionId: number) => {
  const response = await api.delete(`/v1/teacher/tests/${testId}/questions/${questionId}`)
  return response.data
}

// Reorder questions
export const reorderTestQuestions = async (
  testId: number,
  questions: { id: number; order: number }[]
) => {
  const response = await api.post(`/v1/teacher/tests/${testId}/questions/reorder`, { questions })
  return response.data
}

// Get test results
export const getTestResults = async (testId: number, params?: {
  page?: number
  per_page?: number
}) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/results`, { params })
  return response.data
}

// Get test statistics
export const getTestStatistics = async (testId: number) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/statistics`)
  return response.data
}

// Import questions from Excel
export const importTestQuestions = async (testId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post(`/v1/teacher/tests/${testId}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Export test to Excel
export const exportTest = async (testId: number) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/export`, {
    responseType: 'blob',
  })

  // Download file
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `test-${testId}.xlsx`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// Export test results to Excel
export const exportTestResults = async (testId: number) => {
  const response = await api.get(`/v1/teacher/tests/${testId}/results/export`, {
    responseType: 'blob',
  })

  // Download file
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `test-${testId}-results.xlsx`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// Download import template
export const downloadImportTemplate = async () => {
  const response = await api.get('/v1/teacher/tests/import-template', {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'test-import-template.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
