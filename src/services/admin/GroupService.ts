/**
 * Admin Group Service
 *
 * Handles academic group management.
 */

import { BaseApiService } from '../base/BaseApiService'
import type { PaginatedResponse } from './StudentService'

export interface Group {
  id: number
  name: string
  code: string
  specialty_id: number
  faculty_id: number
  course: number
  education_type: string
  education_form: string
  language: string
  capacity: number
  student_count: number
  curator_id?: number
  active: boolean
  created_at: string
}

export interface GroupFilters {
  page?: number
  per_page?: number
  search?: string
  specialty_id?: number
  faculty_id?: number
  course?: number
  education_type?: string
  active?: boolean
}

/**
 * Admin Group Service
 */
export class AdminGroupService extends BaseApiService {
  constructor() {
    super('/v1/admin/groups')
  }

  /**
   * Get groups list
   */
  async getGroups(filters?: GroupFilters): Promise<PaginatedResponse<Group>> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<PaginatedResponse<Group>>(query)
  }

  /**
   * Get single group
   */
  async getGroup(id: number): Promise<Group> {
    return this.get<Group>(`/${id}`)
  }

  /**
   * Create group
   */
  async createGroup(data: Omit<Group, 'id' | 'student_count' | 'created_at'>) {
    return this.post('', data)
  }

  /**
   * Update group
   */
  async updateGroup(id: number, data: Partial<Group>) {
    return this.put(`/${id}`, data)
  }

  /**
   * Delete group
   */
  async deleteGroup(id: number) {
    return this.delete(`/${id}`)
  }

  /**
   * Get group students
   */
  async getGroupStudents(id: number) {
    return this.get(`/${id}/students`)
  }

  /**
   * Assign curator to group
   */
  async assignCurator(id: number, curatorId: number) {
    return this.post(`/${id}/curator`, { curator_id: curatorId })
  }
}

// Export singleton instance
export const adminGroupService = new AdminGroupService()
