import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  teacherStudentService,
  type TeacherStudentHistoryEntry,
  type TeacherStudentProfileResponse,
  type UpdateStudentPayload,
} from '@/services/teacher/StudentService'
import { getErrorMessage } from '@/lib/utils/error'

export const teacherStudentKeys = {
  all: ['teacher', 'student'] as const,
  detail: (id: number) => [...teacherStudentKeys.all, 'detail', id] as const,
  history: (id: number) => [...teacherStudentKeys.all, 'history', id] as const,
}

export function useTeacherStudent(id: number | null) {
  return useQuery<TeacherStudentProfileResponse>({
    queryKey: teacherStudentKeys.detail(id ?? 0),
    queryFn: () => teacherStudentService.show(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useTeacherStudentHistory(id: number | null) {
  return useQuery<{ student_id: number; history: TeacherStudentHistoryEntry[] }>({
    queryKey: teacherStudentKeys.history(id ?? 0),
    queryFn: () => teacherStudentService.history(id as number),
    enabled: id !== null && id > 0,
  })
}

export function useUpdateTeacherStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStudentPayload }) =>
      teacherStudentService.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherStudentKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'tutor-visits'] })
      toast.success("Talaba ma'lumotlari yangilandi")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
