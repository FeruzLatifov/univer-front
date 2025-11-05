/**
 * Student Profile Service
 *
 * Handles student profile management.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface StudentProfile {
  id: number
  student_id: string
  first_name: string
  second_name: string
  third_name: string
  full_name: string
  birth_date: string
  gender: 'male' | 'female'
  citizenship: string
  phone: string
  email: string
  address: string
  image?: string
  passport: {
    series: string
    number: string
    issued_date: string
    issued_by: string
  }
  education: {
    group: {
      id: number
      name: string
    }
    specialty: {
      id: number
      code: string
      name: string
    }
    faculty: {
      id: number
      name: string
    }
    course: number
    education_type: string
    education_form: string
    payment_form: string
  }
  status: {
    student_status: string
    active: boolean
  }
}

/**
 * Student Profile Service
 */
export class StudentProfileService extends BaseApiService {
  constructor() {
    super('/v1/student/profile')
  }

  /**
   * Get current student profile
   */
  async getProfile(): Promise<StudentProfile> {
    return this.get<StudentProfile>()
  }

  /**
   * Update profile information
   */
  async updateProfile(data: {
    phone?: string
    email?: string
    address?: string
  }) {
    return this.put('', data)
  }

  /**
   * Upload profile photo
   */
  async uploadPhoto(file: File) {
    const formData = new FormData()
    formData.append('photo', file)

    return this.post('/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /**
   * Delete profile photo
   */
  async deletePhoto() {
    return this.delete('/photo')
  }

  /**
   * Change password
   */
  async changePassword(data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) {
    return this.post('/password', data)
  }
}

// Export singleton instance
export const studentProfileService = new StudentProfileService()
