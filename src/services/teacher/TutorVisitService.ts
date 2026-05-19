import { BaseApiService } from '../base/BaseApiService'

export interface TutorVisit {
  id: number
  _student: number
  _student_living_status?: string | null
  _accommodation?: string | null
  _current_province?: string | null
  _current_district?: string | null
  _current_terrain?: string | null
  current_address?: string | null
  geolocation?: string | null
  roommate_count?: number | null
  comment?: string | null
  _tutor?: number | null
  active: boolean
  position: number
  created_at: string
  updated_at: string
  student?: {
    id: number
    first_name: string
    second_name: string
    third_name: string
    student_id_number: string
    phone?: string | null
  } | null
}

export interface TutorVisitListResponse {
  items: TutorVisit[]
  _meta: {
    currentPage: number
    perPage: number
    totalCount: number
    pageCount: number
  }
}

export interface CreateTutorVisitInput {
  _student: number
  _student_living_status?: string | null
  _accommodation?: string | null
  _current_province?: string | null
  _current_district?: string | null
  _current_terrain?: string | null
  current_address?: string | null
  geolocation?: string | null
  roommate_count?: number | null
  comment?: string | null
}

export interface TutorVisitListFilters {
  student_id?: number
  search?: string
  page?: number
  per_page?: number
}

class TutorVisitService extends BaseApiService {
  constructor() {
    super('/v1/teacher/visits')
  }

  async list(filters: TutorVisitListFilters = {}): Promise<TutorVisitListResponse> {
    return this.get<TutorVisitListResponse>('', { params: filters })
  }

  async listForStudent(studentId: number): Promise<{ student_id: number; visits: TutorVisit[] }> {
    return this.get(`/student/${studentId}`)
  }

  async create(input: CreateTutorVisitInput): Promise<TutorVisit> {
    return this.post<TutorVisit>('', input)
  }
}

export const tutorVisitService = new TutorVisitService()
