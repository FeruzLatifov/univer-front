import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as teacherApi from '../lib/api/teacher'
import type {
  Assignment,
  AssignmentDetail,
  AssignmentStatistics,
  AssignmentStatusFilter,
  Activity,
  CreateAssignmentRequest,
  GradeSubmissionRequest,
  SubmissionDetail,
  SubmissionsResponse,
  SubmissionStatusFilter,
  UpdateAssignmentRequest,
} from '../lib/api/teacher'

/**
 * React Query hooks for Assignment/Task management
 *
 * Best practices:
 * - Use query keys for caching and invalidation
 * - Show toast notifications for mutations
 * - Handle errors gracefully
 * - Invalidate related queries after mutations
 */

// Query keys for better cache management
export const assignmentKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (filters: { subject_id?: number; group_id?: number; status?: AssignmentStatusFilter }) =>
    [...assignmentKeys.lists(), filters] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...assignmentKeys.details(), id] as const,
  submissions: (id: number) => [...assignmentKeys.detail(id), 'submissions'] as const,
  submissionDetail: (id: number) => ['submission', id] as const,
  statistics: (id: number) => [...assignmentKeys.detail(id), 'statistics'] as const,
  activities: (id: number) => [...assignmentKeys.detail(id), 'activities'] as const,
}

/**
 * Fetch assignments list with filters
 */
export function useAssignments(params?: {
  subject_id?: number
  group_id?: number
  status?: AssignmentStatusFilter
}) {
  return useQuery<{ success: boolean; data: Assignment[]; message: string }>({
    queryKey: assignmentKeys.list(params || {}),
    queryFn: () => teacherApi.getAssignments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch teacher's subjects (for dropdown)
 */
export function useMySubjects() {
  return useQuery<{ success: boolean; data: { id: number; name: string; code?: string }[]; message: string }>({
    queryKey: ['mySubjects'],
    queryFn: () => teacherApi.getMySubjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes (subjects don't change often)
  })
}

/**
 * Fetch teacher's groups (for dropdown)
 * Optionally filter by subject_id
 */
export function useMyGroups(subjectId?: number) {
  return useQuery<{ success: boolean; data: { id: number; name: string; code?: string }[]; message: string }>({
    queryKey: ['myGroups', subjectId],
    queryFn: () => teacherApi.getMyGroups(subjectId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: subjectId === undefined || subjectId > 0, // Only fetch if subjectId is valid or not provided
  })
}

/**
 * Fetch single assignment details
 */
export function useAssignment(id: number | undefined) {
  return useQuery<{ success: boolean; data: AssignmentDetail; message: string }>({
    queryKey: assignmentKeys.detail(id!),
    queryFn: () => teacherApi.getAssignment(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Create new assignment
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => teacherApi.createAssignment(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      toast.success(response.message || 'Topshiriq yaratildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Topshiriq yaratishda xatolik')
    },
  })
}

/**
 * Update assignment
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssignmentRequest }) =>
      teacherApi.updateAssignment(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(variables.id) })
      toast.success(response.message || 'Topshiriq yangilandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Topshiriq yangilashda xatolik')
    },
  })
}

/**
 * Delete assignment
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.deleteAssignment(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      toast.success(response.message || 'Topshiriq o\'chirildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Topshiriq o\'chirishda xatolik')
    },
  })
}

/**
 * Publish assignment
 */
export function usePublishAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.publishAssignment(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) })
      toast.success(response.message || 'Topshiriq nashr qilindi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Nashr qilishda xatolik')
    },
  })
}

/**
 * Unpublish assignment
 */
export function useUnpublishAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherApi.unpublishAssignment(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) })
      toast.success(response.message || 'Topshiriq nashrdan olindi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Nashrdan olishda xatolik')
    },
  })
}

/**
 * Fetch assignment submissions
 */
export function useSubmissions(assignmentId: number | undefined, status?: SubmissionStatusFilter) {
  return useQuery<{ success: boolean; data: SubmissionsResponse; message: string }>({
    queryKey: [...assignmentKeys.submissions(assignmentId!), status],
    queryFn: () => teacherApi.getSubmissions(assignmentId!, status),
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates)
  })
}

/**
 * Fetch submission detail
 */
export function useSubmissionDetail(submissionId: number | undefined) {
  return useQuery<{ success: boolean; data: SubmissionDetail; message: string }>({
    queryKey: assignmentKeys.submissionDetail(submissionId!),
    queryFn: () => teacherApi.getSubmissionDetail(submissionId!),
    enabled: !!submissionId,
  })
}

/**
 * Grade submission
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: number; data: GradeSubmissionRequest }) =>
      teacherApi.gradeSubmission(submissionId, data),
    onSuccess: (response, variables) => {
      // Invalidate submission detail
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissionDetail(variables.submissionId),
      })

      // Invalidate submissions list
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(
          // We need to get assignment ID from somewhere, or invalidate all submissions
          // For now, invalidate all assignment queries
        ),
      })

      // Invalidate statistics
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'assignments' && query.queryKey.includes('statistics'),
      })

      toast.success(response.message || 'Javob baholandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Baholashda xatolik')
    },
  })
}

/**
 * Download submission file
 */
export function useDownloadSubmissionFile() {
  return useMutation({
    mutationFn: ({ submissionId, fileIndex }: { submissionId: number; fileIndex?: number }) =>
      teacherApi.downloadSubmissionFile(submissionId, fileIndex),
    onSuccess: (response, variables) => {
      // Create blob URL and trigger download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = 'download'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Fayl yuklab olindi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Fayl yuklab olishda xatolik')
    },
  })
}

/**
 * Fetch assignment statistics
 */
export function useAssignmentStatistics(assignmentId: number | undefined) {
  return useQuery<{ success: boolean; data: AssignmentStatistics; message?: string }>({
    queryKey: assignmentKeys.statistics(assignmentId!),
    queryFn: () => teacherApi.getAssignmentStatistics(assignmentId!),
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Fetch assignment activities
 */
export function useAssignmentActivities(assignmentId: number | undefined, days = 7) {
  return useQuery<{ success: boolean; data: Activity[]; message: string }>({
    queryKey: [...assignmentKeys.activities(assignmentId!), days],
    queryFn: () => teacherApi.getAssignmentActivities(assignmentId!, days),
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * Helper hook to get assignment status badge color
 */
export function useAssignmentStatusColor(assignment: Assignment) {
  if (assignment.is_overdue) return 'destructive'
  if (!assignment.is_published) return 'secondary'
  if (assignment.days_until_deadline <= 2) return 'warning'
  return 'default'
}

/**
 * Helper hook to get submission status badge color
 */
export function useSubmissionStatusColor(status: string) {
  switch (status) {
    case 'graded':
      return 'success'
    case 'submitted':
    case 'viewed':
      return 'default'
    case 'returned':
      return 'warning'
    case 'not_submitted':
    case 'pending':
      return 'secondary'
    default:
      return 'default'
  }
}
