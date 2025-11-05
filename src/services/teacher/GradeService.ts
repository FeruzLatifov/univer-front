import { BaseApiService } from '../base/BaseApiService'
import * as gradesApi from '@/lib/api/grades'

// Re-export types from grades API
export type {
  GradeRecord,
  StudentGrade,
  GradesListResponse,
  GradeReportData,
  GradeReportResponse,
  CreateGradePayload,
  UpdateGradePayload,
  GradeResponse,
} from '@/lib/api/grades'

// Re-export constants
export { GRADE_TYPES, LETTER_GRADES, getLetterGrade } from '@/lib/api/grades'

/**
 * Teacher Grade Service
 * Wraps grade API functions with a service layer
 */
export class GradeService extends BaseApiService {
  constructor() {
    super('/v1/teacher/grades')
  }

  /**
   * Get grades list for a subject
   */
  async getSubjectGrades(
    subjectId: number,
    params?: {
      grade_type?: string
    }
  ) {
    return gradesApi.getSubjectGrades(subjectId, params)
  }

  /**
   * Create a new grade
   */
  async createGrade(payload: gradesApi.CreateGradePayload) {
    return gradesApi.createGrade(payload)
  }

  /**
   * Update a grade
   */
  async updateGrade(gradeId: number, payload: gradesApi.UpdateGradePayload) {
    return gradesApi.updateGrade(gradeId, payload)
  }

  /**
   * Delete a grade
   */
  async deleteGrade(gradeId: number) {
    return gradesApi.deleteGrade(gradeId)
  }

  /**
   * Get grade report
   */
  async getGradeReport(params: { subject_id?: number; student_id?: number }) {
    return gradesApi.getGradeReport(params)
  }

  /**
   * Export grades (placeholder for future implementation)
   */
  async exportGrades(subjectId: number, format: 'csv' | 'xlsx' | 'pdf' = 'xlsx') {
    // This would need to be implemented on the backend
    // For now, return a placeholder response
    throw new Error('Export grades feature is not yet implemented on the backend')
  }
}

// Export singleton instance
export const gradeService = new GradeService()
