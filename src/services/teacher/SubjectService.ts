import { BaseApiService } from '../base/BaseApiService'

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
  students: SubjectStudent[]
  groups: SubjectGroup[]
  topics: SubjectTopic[]
  resources: SubjectResource[]
  statistics: SubjectStatistics
}

export interface SubjectStudent {
  id: number
  student_id_number: string
  firstname: string
  lastname: string
  middlename?: string
  group_name?: string
  attendance_percentage?: number
  average_grade?: number
}

export interface SubjectGroup {
  id: number
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  students_count: number
}

export interface SubjectTopic {
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

export interface SubjectResource {
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

export interface SubjectsListParams {
  page?: number
  per_page?: number
  search?: string
  education_year_id?: number
  semester_id?: number
}

// ==================== SERVICE ====================

/**
 * Teacher Subject Service
 * Manages subjects taught by teachers
 */
export class SubjectService extends BaseApiService {
  constructor() {
    super('/v1/teacher/subjects')
  }

  /**
   * Get teacher's subjects list with pagination and filters
   */
  async getSubjects(params?: SubjectsListParams) {
    const query = this.buildQueryString(params || {})
    return this.get<{
      data: Subject[]
      meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }>(query)
  }

  /**
   * Get detailed information about a specific subject
   */
  async getSubjectDetail(subjectId: number) {
    return this.get<SubjectDetail>(`/${subjectId}`)
  }

  /**
   * Get list of students enrolled in a subject
   */
  async getSubjectStudents(subjectId: number) {
    return this.get<SubjectStudent[]>(`/${subjectId}/students`)
  }
}

// Export singleton instance
export const teacherSubjectService = new SubjectService()
