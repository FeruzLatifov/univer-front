import { BaseApiService } from '../base/BaseApiService'

export interface TeacherStudentProfile {
  id: number
  first_name: string
  second_name: string
  third_name: string
  full_name: string
  student_id_number: string
  passport_number?: string | null
  birth_date?: string | null
  gender?: string | null
  image?: string | null
  phone?: string | null
  email?: string | null
  parent_phone?: string | null
  person_phone?: string | null
  home_address?: string | null
  current_address?: string | null
  _country?: string | null
  _province?: string | null
  _district?: string | null
  _terrain?: string | null
  _current_province?: string | null
  _current_district?: string | null
  _current_terrain?: string | null
  _student_living_status?: string | null
  _accommodation?: string | null
  _student_roommate_type?: string | null
  roommate_count?: number | null
  geo_location?: string | null
  _social_category?: string | null
}

export interface TeacherStudentMeta {
  id: number
  group: { id: number; name: string } | null
  department: { id: number; name: string } | null
  specialty: { id: number; name: string } | null
  education_year?: string | null
  education_type: { code: string; name: string } | null
  education_form: { code: string; name: string } | null
  payment_form: { code: string; name: string } | null
  student_status?: string | null
  level?: string | null
}

export interface TeacherStudentProfileResponse {
  student: TeacherStudentProfile
  meta: TeacherStudentMeta | null
}

export interface TeacherStudentHistoryEntry extends TeacherStudentMeta {
  active: boolean
  created_at?: string | null
}

export interface UpdateStudentPayload {
  phone?: string | null
  email?: string | null
  home_address?: string | null
  current_address?: string | null
  _country?: string | null
  _province?: string | null
  _district?: string | null
  _terrain?: string | null
  _current_province?: string | null
  _current_district?: string | null
  _current_terrain?: string | null
  _student_living_status?: string | null
  _student_roommate_type?: string | null
  roommate_count?: number | null
  geo_location?: string | null
  parent_phone?: string | null
  person_phone?: string | null
}

class TeacherStudentService extends BaseApiService {
  constructor() {
    super('/v1/teacher/students')
  }

  async show(id: number): Promise<TeacherStudentProfileResponse> {
    return this.get<TeacherStudentProfileResponse>(`/${id}`)
  }

  async update(id: number, payload: UpdateStudentPayload): Promise<TeacherStudentProfileResponse> {
    return this.put<TeacherStudentProfileResponse>(`/${id}`, payload)
  }

  async history(id: number): Promise<{ student_id: number; history: TeacherStudentHistoryEntry[] }> {
    return this.get(`/${id}/history`)
  }
}

export const teacherStudentService = new TeacherStudentService()
