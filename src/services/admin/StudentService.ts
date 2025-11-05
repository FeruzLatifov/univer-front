/**
 * Admin Student Service
 *
 * Handles admin student management operations.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface AdminStudentFilters {
  page?: number
  per_page?: number
  search?: string
  group_id?: number
  specialty_id?: number
  faculty_id?: number
  course?: number
  status?: string
  education_type?: string
  payment_form?: string
}

export interface StudentData {
  student_id?: string
  first_name: string
  second_name: string
  third_name: string
  birth_date: string
  gender: 'male' | 'female'
  citizenship: string
  phone: string
  email: string
  address: string
  passport_series: string
  passport_number: string
  group_id: number
  specialty_id: number
  course: number
  education_type: string
  education_form: string
  payment_form: string
  password?: string
}

/**
 * Admin Student Service
 */
export class AdminStudentService extends BaseApiService {
  constructor() {
    super('/v1/admin/students')
  }

  /**
   * Get paginated student list with filters
   */
  async getStudents(filters?: AdminStudentFilters): Promise<PaginatedResponse<any>> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<PaginatedResponse<any>>(query)
  }

  /**
   * Get single student details
   */
  async getStudent(id: number) {
    return this.get(`/${id}`)
  }

  /**
   * Create new student
   */
  async createStudent(data: StudentData) {
    return this.post('', data)
  }

  /**
   * Update student
   */
  async updateStudent(id: number, data: Partial<StudentData>) {
    return this.put(`/${id}`, data)
  }

  /**
   * Delete student
   */
  async deleteStudent(id: number) {
    return this.delete(`/${id}`)
  }

  /**
   * Activate/deactivate student
   */
  async toggleStatus(id: number, active: boolean) {
    return this.patch(`/${id}/status`, { active })
  }

  /**
   * Transfer student to another group
   */
  async transferStudent(id: number, groupId: number) {
    return this.post(`/${id}/transfer`, { group_id: groupId })
  }

  /**
   * Export students to Excel
   */
  async exportStudents(filters?: AdminStudentFilters): Promise<Blob> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<Blob>(`/export${query}`, { responseType: 'blob' })
  }

  /**
   * Import students from Excel
   */
  async importStudents(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return this.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// Export singleton instance
export const adminStudentService = new AdminStudentService()
