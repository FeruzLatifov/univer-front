import { useQuery } from '@tanstack/react-query'
import { teacherReportsService, type TeacherReportOverview } from '@/services/teacher/ReportsService'

export const reportsKeys = {
  all: ['teacher', 'reports'] as const,
  overview: (subjectId?: number | null) =>
    [...reportsKeys.all, 'overview', subjectId ?? 'all'] as const,
}

export function useTeacherReportsOverview(subjectId?: number | null) {
  return useQuery<TeacherReportOverview>({
    queryKey: reportsKeys.overview(subjectId),
    queryFn: () => teacherReportsService.getOverview(subjectId),
  })
}
