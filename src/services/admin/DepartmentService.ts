/**
 * Admin Department Service
 *
 * Handles department management operations.
 */

import { BaseApiService } from '../base/BaseApiService'
import type { PaginatedResponse } from './StudentService'

export interface Department {
  id: number
  code: string
  name: string
  parent_id?: number
  type: 'faculty' | 'department' | 'chair'
  head_id?: number
  phone?: string
  email?: string
  address?: string
  active: boolean
  created_at: string
}

export interface DepartmentFilters {
  page?: number
  per_page?: number
  search?: string
  type?: string
  parent_id?: number
  active?: boolean
}

/**
 * Admin Department Service
 */
export class AdminDepartmentService extends BaseApiService {
  constructor() {
    super('/v1/admin/departments')
  }

  /**
   * Get departments list
   */
  async getDepartments(filters?: DepartmentFilters): Promise<PaginatedResponse<Department>> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<PaginatedResponse<Department>>(query)
  }

  /**
   * Get single department
   */
  async getDepartment(id: number): Promise<Department> {
    return this.get<Department>(`/${id}`)
  }

  /**
   * Create department
   */
  async createDepartment(data: Omit<Department, 'id' | 'created_at'>) {
    return this.post('', data)
  }

  /**
   * Update department
   */
  async updateDepartment(id: number, data: Partial<Department>) {
    return this.put(`/${id}`, data)
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: number) {
    return this.delete(`/${id}`)
  }

  /**
   * Get department tree (hierarchical structure)
   */
  async getDepartmentTree() {
    return this.get('/tree')
  }

  /**
   * Get faculties only
   */
  async getFaculties() {
    return this.getDepartments({ type: 'faculty' })
  }
}

// Export singleton instance
export const adminDepartmentService = new AdminDepartmentService()
