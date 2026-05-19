import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  tutorVisitService,
  type CreateTutorVisitInput,
  type TutorVisit,
  type TutorVisitListFilters,
  type TutorVisitListResponse,
} from '@/services/teacher/TutorVisitService'
import { getErrorMessage } from '@/lib/utils/error'

export const tutorVisitKeys = {
  all: ['teacher', 'tutor-visits'] as const,
  list: (filters?: TutorVisitListFilters) =>
    [...tutorVisitKeys.all, 'list', filters ?? {}] as const,
  student: (studentId: number) =>
    [...tutorVisitKeys.all, 'student', studentId] as const,
}

export function useTutorVisits(filters?: TutorVisitListFilters) {
  return useQuery<TutorVisitListResponse>({
    queryKey: tutorVisitKeys.list(filters),
    queryFn: () => tutorVisitService.list(filters),
  })
}

export function useStudentVisits(studentId: number | null) {
  return useQuery<{ student_id: number; visits: TutorVisit[] }>({
    queryKey: tutorVisitKeys.student(studentId ?? 0),
    queryFn: () => tutorVisitService.listForStudent(studentId as number),
    enabled: studentId !== null && studentId > 0,
  })
}

export function useCreateTutorVisit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTutorVisitInput) => tutorVisitService.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: tutorVisitKeys.all })
      queryClient.invalidateQueries({ queryKey: tutorVisitKeys.student(variables._student) })
      toast.success("Tashrif ma'lumotlari saqlandi")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
