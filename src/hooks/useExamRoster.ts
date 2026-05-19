import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { teacherExamService, type ExamRosterResponse } from '@/services/teacher/ExamService'
import { getErrorMessage } from '@/lib/utils/error'

export const examRosterKeys = {
  all: ['teacher', 'exam-roster'] as const,
  detail: (examId: number) => [...examRosterKeys.all, examId] as const,
}

export function useExamRoster(examId: number | null) {
  return useQuery<ExamRosterResponse>({
    queryKey: examRosterKeys.detail(examId ?? 0),
    queryFn: () => teacherExamService.getRoster(examId as number),
    enabled: examId !== null && examId > 0,
  })
}

export function useSubmitExamRoster() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      examId,
      rows,
    }: {
      examId: number
      rows: Array<{
        student_id: number
        score?: number
        grade?: string | null
        attended?: boolean
        notes?: string | null
      }>
    }) => teacherExamService.submitRoster(examId, rows),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: examRosterKeys.detail(variables.examId) })
      toast.success('Natijalar saqlandi')
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
