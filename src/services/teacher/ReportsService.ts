import { BaseApiService } from '../base/BaseApiService'

export interface TeacherReportOverview {
  total_students: number
  average_attendance: number
  average_grade: number
  total_lessons: number
  completed_topics: number
  total_topics: number
}

class TeacherReportsService extends BaseApiService {
  constructor() {
    super('/v1/teacher/reports')
  }

  async getOverview(subjectId?: number | null): Promise<TeacherReportOverview> {
    const params: Record<string, number> = {}
    if (subjectId != null) {
      params.subject_id = subjectId
    }

    return this.get<TeacherReportOverview>('/overview', { params })
  }
}

export const teacherReportsService = new TeacherReportsService()
