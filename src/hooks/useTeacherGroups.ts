import { useQuery } from '@tanstack/react-query'
import {
  teacherGroupService,
  type GroupDetailResponse,
  type GroupListFilters,
  type GroupListResponse,
  type GroupStudentsResponse,
} from '@/services/teacher/GroupService'

export const teacherGroupKeys = {
  all: ['teacher', 'groups'] as const,
  list: (filters?: GroupListFilters) =>
    [...teacherGroupKeys.all, 'list', filters ?? {}] as const,
  detail: (id: number, educationYear?: string) =>
    [...teacherGroupKeys.all, 'detail', id, educationYear ?? 'current'] as const,
  students: (id: number, filters?: { education_year?: string; status?: string }) =>
    [...teacherGroupKeys.all, 'students', id, filters ?? {}] as const,
}

export function useTeacherGroups(filters?: GroupListFilters) {
  return useQuery<GroupListResponse>({
    queryKey: teacherGroupKeys.list(filters),
    queryFn: () => teacherGroupService.list(filters),
  })
}

export function useTeacherGroupDetail(id: number | null, educationYear?: string) {
  return useQuery<GroupDetailResponse>({
    queryKey: teacherGroupKeys.detail(id ?? 0, educationYear),
    queryFn: () => teacherGroupService.show(id as number, educationYear),
    enabled: id !== null && id > 0,
  })
}

export function useTeacherGroupStudents(
  id: number | null,
  filters?: { education_year?: string; status?: string }
) {
  return useQuery<GroupStudentsResponse>({
    queryKey: teacherGroupKeys.students(id ?? 0, filters),
    queryFn: () => teacherGroupService.students(id as number, filters),
    enabled: id !== null && id > 0,
  })
}
