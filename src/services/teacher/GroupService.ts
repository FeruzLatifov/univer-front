import { BaseApiService } from '../base/BaseApiService'

export interface GroupListItem {
  id: number
  name: string
  code?: string | null
  department: { id: number; name: string } | null
  specialty: { id: number; name: string } | null
  education_type?: string | null
  education_form?: string | null
  education_year?: string | null
  level?: string | null
  students_count: number
  active_students_count: number
}

export interface GroupListResponse {
  groups: GroupListItem[]
  education_year: string
}

export interface GroupDetailResponse {
  group: {
    id: number
    name: string
    code?: string | null
    department: { id: number; name: string } | null
    specialty: { id: number; name: string } | null
    education_type?: string | null
    education_form?: string | null
    education_year?: string | null
    level?: string | null
  }
  statistics: {
    total_students: number
    active_students: number
    male_students: number
    female_students: number
  }
  education_year: string
}

export interface GroupStudent {
  id: number
  full_name: string
  first_name: string
  second_name: string
  third_name: string
  student_id_number: string
  image?: string | null
  gender?: string | null
  birth_date?: string | null
  phone?: string | null
  email?: string | null
  student_status?: string | null
  payment_form: { code: string; name: string } | null
  education_type: { code: string; name: string } | null
  education_form: { code: string; name: string } | null
}

export interface GroupStudentsResponse {
  students: GroupStudent[]
  group: { id: number; name: string }
  education_year: string
  total_count: number
}

export interface GroupListFilters {
  education_year?: string
  group_id?: number
  faculty_id?: number
}

class TeacherGroupService extends BaseApiService {
  constructor() {
    super('/v1/teacher/group')
  }

  async list(filters: GroupListFilters = {}): Promise<GroupListResponse> {
    return this.get<GroupListResponse>('/list', { params: filters })
  }

  async show(id: number, educationYear?: string): Promise<GroupDetailResponse> {
    return this.get<GroupDetailResponse>(`/${id}`, {
      params: educationYear ? { education_year: educationYear } : undefined,
    })
  }

  async students(
    id: number,
    filters: { education_year?: string; status?: string } = {}
  ): Promise<GroupStudentsResponse> {
    return this.get<GroupStudentsResponse>(`/${id}/students`, { params: filters })
  }
}

export const teacherGroupService = new TeacherGroupService()
