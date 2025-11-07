import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { gradeService } from '@/services/teacher/GradeService'
import type {
  GradesListResponse,
  CreateGradePayload,
  UpdateGradePayload,
  GradeResponse,
  GradeReportResponse,
} from '@/services/teacher/GradeService'

/**
 * React Query hooks for Grade management
 *
 * Best practices:
 * - Use query keys for caching and invalidation
 * - Show toast notifications for mutations
 * - Handle errors gracefully
 * - Invalidate related queries after mutations
 */

// Query keys for better cache management
export const gradeKeys = {
  all: ['teacher', 'grades'] as const,
  lists: () => [...gradeKeys.all, 'list'] as const,
  list: (subjectId: number, filters?: { grade_type?: string }) =>
    [...gradeKeys.lists(), subjectId, filters] as const,
  reports: () => [...gradeKeys.all, 'report'] as const,
  report: (params: { subject_id?: number; student_id?: number }) =>
    [...gradeKeys.reports(), params] as const,
}

/**
 * Fetch grades for a subject
 */
export function useGrades(
  subjectId: number | undefined,
  params?: {
    grade_type?: string
  }
) {
  return useQuery<GradesListResponse>({
    queryKey: gradeKeys.list(subjectId!, params),
    queryFn: () => gradeService.getSubjectGrades(subjectId!, params),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch grade report
 */
export function useGradeReport(params: { subject_id?: number; student_id?: number }) {
  return useQuery<GradeReportResponse>({
    queryKey: gradeKeys.report(params),
    queryFn: () => gradeService.getGradeReport(params),
    enabled: !!(params.subject_id || params.student_id),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Create new grade
 */
export function useCreateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGradePayload) => gradeService.createGrade(data),
    onSuccess: (response, variables) => {
      // Invalidate grades list for the subject
      queryClient.invalidateQueries({
        queryKey: gradeKeys.list(variables.subject_id, {}),
      })
      // Invalidate all grades lists
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      // Invalidate reports
      queryClient.invalidateQueries({ queryKey: gradeKeys.reports() })

      toast.success(response.message || "Baho qo'shildi")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Baho qo'shishda xatolik")
    },
  })
}

/**
 * Update grade
 */
export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gradeId, data }: { gradeId: number; data: UpdateGradePayload }) =>
      gradeService.updateGrade(gradeId, data),
    onSuccess: (response) => {
      // Invalidate all grades lists since we don't know which subject it belongs to
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: gradeKeys.reports() })

      toast.success(response.message || 'Baho yangilandi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Baho yangilashda xatolik')
    },
  })
}

/**
 * Delete grade
 */
export function useDeleteGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gradeId: number) => gradeService.deleteGrade(gradeId),
    onSuccess: (response) => {
      // Invalidate all grades lists since we don't know which subject it belongs to
      queryClient.invalidateQueries({ queryKey: gradeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: gradeKeys.reports() })

      toast.success(response.message || "Baho o'chirildi")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Baho o'chirishda xatolik")
    },
  })
}

/**
 * Export grades (placeholder for future implementation)
 */
export function useExportGrades() {
  return useMutation({
    mutationFn: ({ subjectId, format }: { subjectId: number; format?: 'csv' | 'xlsx' | 'pdf' }) =>
      gradeService.exportGrades(subjectId, format),
    onSuccess: (fileBlob) => {
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(fileBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `baholar_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Baholar eksport qilindi')
    },
    onError: (error: any) => {
      toast.error(error.message || error.response?.data?.message || 'Eksport qilishda xatolik')
    },
  })
}
