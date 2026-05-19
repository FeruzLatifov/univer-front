import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  teacherCalendarPlanService,
  type CalendarPlanResponse,
  type UpdateCalendarPlanInput,
} from '@/services/teacher/CalendarPlanService'
import { getErrorMessage } from '@/lib/utils/error'

export const calendarPlanKeys = {
  all: ['teacher', 'calendar-plan'] as const,
  subject: (subjectId: number, groupId?: number | null) =>
    [...calendarPlanKeys.all, subjectId, groupId ?? 'no-group'] as const,
}

export function useCalendarPlan(subjectId: number | null, groupId?: number | null) {
  return useQuery<CalendarPlanResponse>({
    queryKey: calendarPlanKeys.subject(subjectId ?? 0, groupId),
    queryFn: () => teacherCalendarPlanService.show(subjectId as number, groupId),
    enabled: subjectId !== null && subjectId > 0,
  })
}

export function useUpdateCalendarPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      subjectId,
      input,
    }: {
      subjectId: number
      input: UpdateCalendarPlanInput
    }) => teacherCalendarPlanService.update(subjectId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: calendarPlanKeys.subject(variables.subjectId, variables.input.group_id),
      })
      toast.success('Taqvimiy reja saqlandi')
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
