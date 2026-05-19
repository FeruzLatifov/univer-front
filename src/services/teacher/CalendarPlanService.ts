import { BaseApiService } from '../base/BaseApiService'

export interface CalendarPlanItem {
  topic_id: number
  name: string
  order_number: number | null
  hours: number
  planned_date: string | null
  actual_date: string | null
  notes: string | null
  plan_id: number | null
}

export interface CalendarPlanResponse {
  subject: { id: number; name: string } | null
  group_id: number | null
  items: CalendarPlanItem[]
  total_topics: number
  planned_topics: number
  completed_topics: number
  total_hours: number
}

export interface UpdateCalendarPlanInput {
  group_id?: number | null
  items: Array<{
    topic_id: number
    planned_date?: string | null
    actual_date?: string | null
    hours?: number | null
    notes?: string | null
  }>
}

class TeacherCalendarPlanService extends BaseApiService {
  constructor() {
    super('/v1/teacher/calendar-plan')
  }

  async show(subjectId: number, groupId?: number | null): Promise<CalendarPlanResponse> {
    return this.get<CalendarPlanResponse>(`/subject/${subjectId}`, {
      params: groupId ? { group_id: groupId } : undefined,
    })
  }

  async update(subjectId: number, input: UpdateCalendarPlanInput): Promise<CalendarPlanResponse> {
    return this.put<CalendarPlanResponse>(`/subject/${subjectId}`, input)
  }
}

export const teacherCalendarPlanService = new TeacherCalendarPlanService()
