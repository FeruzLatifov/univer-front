import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as teacherApi from '../lib/api/teacher'
import type {
  Test,
  TestDetail,
  Question,
  QuestionDetail,
  TestAttempt,
  TestAttemptDetail,
  TestResultsSummary,
  CreateTestRequest,
  UpdateTestRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerOptionRequest,
  UpdateAnswerOptionRequest,
  GradeAttemptRequest,
  TestStatusFilter,
  AttemptStatus,
} from '../lib/api/teacher'

/**
 * React Query hooks for Test/Quiz management
 *
 * Best practices:
 * - Use query keys for caching and invalidation
 * - Show toast notifications for mutations
 * - Handle errors gracefully
 * - Invalidate related queries after mutations
 */

// Query keys for better cache management
export const testKeys = {
  all: ['tests'] as const,
  lists: () => [...testKeys.all, 'list'] as const,
  list: (filters: {
    subject_id?: number
    employee_id?: number
    group_id?: number
    is_published?: boolean
    status?: TestStatusFilter
  }) => [...testKeys.lists(), filters] as const,
  details: () => [...testKeys.all, 'detail'] as const,
  detail: (id: number) => [...testKeys.details(), id] as const,
  questions: (testId: number) => [...testKeys.detail(testId), 'questions'] as const,
  question: (testId: number, questionId: number) =>
    [...testKeys.questions(testId), questionId] as const,
  results: (testId: number) => [...testKeys.detail(testId), 'results'] as const,
  attempt: (testId: number, attemptId: number) => [...testKeys.results(testId), attemptId] as const,
}

// ==========================================
// TEST CRUD HOOKS
// ==========================================

/**
 * Fetch tests list with filters
 */
export function useTests(params?: {
  subject_id?: number
  employee_id?: number
  group_id?: number
  is_published?: boolean
  status?: TestStatusFilter
  per_page?: number
}) {
  return useQuery<{ success: boolean; data: { data: Test[]; total: number }; message: string }>({
    queryKey: testKeys.list(params || {}),
    queryFn: () => teacherApi.getTests(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch single test details
 */
export function useTest(id: number | undefined) {
  return useQuery<{ success: boolean; data: TestDetail; message: string }>({
    queryKey: testKeys.detail(id!),
    queryFn: () => teacherApi.getTest(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Create new test
 */
export function useCreateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTestRequest) => teacherApi.createTest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      toast.success(response.message || 'Test yaratildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Test yaratishda xatolik')
    },
  })
}

/**
 * Update test
 */
export function useUpdateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestRequest }) =>
      teacherApi.updateTest(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(variables.id) })
      toast.success(response.message || 'Test yangilandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Test yangilashda xatolik')
    },
  })
}

/**
 * Delete test
 */
export function useDeleteTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.deleteTest(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      toast.success(response.message || "Test o'chirildi")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Test o'chirishda xatolik")
    },
  })
}

/**
 * Duplicate test
 */
export function useDuplicateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.duplicateTest(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      toast.success(response.message || 'Test nusxalandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Test nusxalashda xatolik')
    },
  })
}

/**
 * Publish test
 */
export function usePublishTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.publishTest(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(id) })
      toast.success(response.message || 'Test nashr qilindi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Nashr qilishda xatolik')
    },
  })
}

/**
 * Unpublish test
 */
export function useUnpublishTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.unpublishTest(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: testKeys.lists() })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(id) })
      toast.success(response.message || 'Test nashrdan olindi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Nashrdan olishda xatolik')
    },
  })
}

// ==========================================
// QUESTION MANAGEMENT HOOKS
// ==========================================

/**
 * Fetch test questions
 */
export function useTestQuestions(testId: number | undefined) {
  return useQuery<{ success: boolean; data: Question[]; message: string }>({
    queryKey: testKeys.questions(testId!),
    queryFn: () => teacherApi.getTestQuestions(testId!),
    enabled: !!testId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Fetch single question details
 */
export function useQuestion(testId: number | undefined, questionId: number | undefined) {
  return useQuery<{ success: boolean; data: QuestionDetail; message: string }>({
    queryKey: testKeys.question(testId!, questionId!),
    queryFn: () => teacherApi.getQuestion(testId!, questionId!),
    enabled: !!testId && !!questionId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Add question to test
 */
export function useAddQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ testId, data }: { testId: number; data: CreateQuestionRequest }) =>
      teacherApi.addQuestion(testId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(variables.testId) })
      toast.success(response.message || 'Savol qo\'shildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Savol qo\'shishda xatolik')
    },
  })
}

/**
 * Update question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      testId,
      questionId,
      data,
    }: {
      testId: number
      questionId: number
      data: UpdateQuestionRequest
    }) => teacherApi.updateQuestion(testId, questionId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      queryClient.invalidateQueries({
        queryKey: testKeys.question(variables.testId, variables.questionId),
      })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(variables.testId) })
      toast.success(response.message || 'Savol yangilandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Savol yangilashda xatolik')
    },
  })
}

/**
 * Delete question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ testId, questionId }: { testId: number; questionId: number }) =>
      teacherApi.deleteQuestion(testId, questionId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(variables.testId) })
      toast.success(response.message || "Savol o'chirildi")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Savol o'chirishda xatolik")
    },
  })
}

/**
 * Reorder questions
 */
export function useReorderQuestions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ testId, order }: { testId: number; order: number[] }) =>
      teacherApi.reorderQuestions(testId, order),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      toast.success(response.message || 'Savollar tartibi o\'zgartirildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tartibni o\'zgartirishda xatolik')
    },
  })
}

/**
 * Duplicate question
 */
export function useDuplicateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ testId, questionId }: { testId: number; questionId: number }) =>
      teacherApi.duplicateQuestion(testId, questionId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      queryClient.invalidateQueries({ queryKey: testKeys.detail(variables.testId) })
      toast.success(response.message || 'Savol nusxalandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Savol nusxalashda xatolik')
    },
  })
}

// ==========================================
// ANSWER OPTIONS HOOKS (Multiple Choice)
// ==========================================

/**
 * Add answer option to question
 */
export function useAddAnswerOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      testId,
      questionId,
      data,
    }: {
      testId: number
      questionId: number
      data: CreateAnswerOptionRequest
    }) => teacherApi.addAnswerOption(testId, questionId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.question(variables.testId, variables.questionId),
      })
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      toast.success(response.message || 'Javob varianti qo\'shildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Javob qo\'shishda xatolik')
    },
  })
}

/**
 * Update answer option
 */
export function useUpdateAnswerOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      testId,
      questionId,
      answerId,
      data,
    }: {
      testId: number
      questionId: number
      answerId: number
      data: UpdateAnswerOptionRequest
    }) => teacherApi.updateAnswerOption(testId, questionId, answerId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.question(variables.testId, variables.questionId),
      })
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      toast.success(response.message || 'Javob varianti yangilandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Javob yangilashda xatolik')
    },
  })
}

/**
 * Delete answer option
 */
export function useDeleteAnswerOption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      testId,
      questionId,
      answerId,
    }: {
      testId: number
      questionId: number
      answerId: number
    }) => teacherApi.deleteAnswerOption(testId, questionId, answerId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.question(variables.testId, variables.questionId),
      })
      queryClient.invalidateQueries({ queryKey: testKeys.questions(variables.testId) })
      toast.success(response.message || "Javob varianti o'chirildi")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Javob o'chirishda xatolik")
    },
  })
}

// ==========================================
// RESULTS & GRADING HOOKS
// ==========================================

/**
 * Fetch test results/attempts
 */
export function useTestResults(
  testId: number | undefined,
  params?: {
    student_id?: number
    status?: AttemptStatus
    passed?: boolean
  }
) {
  return useQuery<{
    success: boolean
    data: TestAttempt[]
    summary: TestResultsSummary
    message: string
  }>({
    queryKey: [...testKeys.results(testId!), params],
    queryFn: () => teacherApi.getTestResults(testId!, params),
    enabled: !!testId,
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates)
  })
}

/**
 * Fetch specific attempt details
 */
export function useAttemptDetail(testId: number | undefined, attemptId: number | undefined) {
  return useQuery<{ success: boolean; data: TestAttemptDetail; message: string }>({
    queryKey: testKeys.attempt(testId!, attemptId!),
    queryFn: () => teacherApi.getAttemptDetail(testId!, attemptId!),
    enabled: !!testId && !!attemptId,
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * Grade attempt manually
 */
export function useGradeAttempt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      testId,
      attemptId,
      data,
    }: {
      testId: number
      attemptId: number
      data: GradeAttemptRequest
    }) => teacherApi.gradeAttempt(testId, attemptId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: testKeys.results(variables.testId) })
      queryClient.invalidateQueries({
        queryKey: testKeys.attempt(variables.testId, variables.attemptId),
      })
      toast.success(response.message || 'Urinish baholandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Baholashda xatolik')
    },
  })
}
