import { api } from './client'

// ==================== TYPES ====================

export interface Subject {
  id: number
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  credit: number
  total_acload: number
  curriculum_id: number
  semester_id: number
  education_year_id: number
  education_type_id: number
  department_id: number
  department_name?: string
  department_name_uz?: string
  department_name_ru?: string
  department_name_en?: string
  students_count?: number
  groups_count?: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface SubjectDetail extends Subject {
  students: Student[]
  groups: Group[]
  topics: Topic[]
  resources: Resource[]
  statistics: SubjectStatistics
}

export interface Student {
  id: number
  student_id_number: string
  firstname: string
  lastname: string
  middlename?: string
  group_name?: string
  attendance_percentage?: number
  average_grade?: number
}

export interface Group {
  id: number
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  students_count: number
}

export interface Topic {
  id: number
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  description?: string
  position: number
  hours: number
  active: boolean
}

export interface Resource {
  id: number
  title: string
  type: string
  file_path?: string
  url?: string
  size?: number
  created_at: string
}

export interface SubjectStatistics {
  total_students: number
  total_groups: number
  total_topics: number
  total_resources: number
  average_attendance: number
  average_grade: number
  completed_topics: number
}

export interface SubjectsResponse {
  success: boolean
  data: Subject[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface SubjectDetailResponse {
  success: boolean
  data: SubjectDetail
}

// ==================== API FUNCTIONS ====================

/**
 * Get teacher's subjects list
 */
export const getTeacherSubjects = async (params?: {
  page?: number
  per_page?: number
  search?: string
  education_year_id?: number
  semester_id?: number
}): Promise<SubjectsResponse> => {
  const response = await api.get('/teacher/subjects', { params })
  return response.data
}

/**
 * Get subject details
 */
export const getSubjectDetail = async (subjectId: number): Promise<SubjectDetailResponse> => {
  const response = await api.get(`/teacher/subject/${subjectId}`)
  return response.data
}

/**
 * Get students in subject
 */
export const getSubjectStudents = async (subjectId: number): Promise<{
  success: boolean
  data: Student[]
}> => {
  const response = await api.get(`/subject/${subjectId}/students`)
  return response.data
}
