import { BaseApiService } from '../base/BaseApiService'

// ==================== TYPES ====================

export interface Assignment {
  id: number
  title: string
  description?: string
  instructions?: string
  subject: {
    id: number
    name: string
  }
  group: {
    id: number
    name: string
  }
  topic?: {
    id: number
    name: string
  } | null
  deadline: string
  max_score: number
  marking_category?: string
  marking_category_name?: string
  is_overdue: boolean
  is_published: boolean
  days_until_deadline: number
  file_count: number
  submission_stats: SubmissionStats
  published_at?: string | null
  created_at?: string
}

export interface SubmissionStats {
  total_students: number
  submitted: number
  not_submitted: number
  graded: number
  pending_grading: number
  submission_rate: number
}

export interface AssignmentDetail extends Assignment {
  files?: AssignmentFile[] | null
  allow_late: boolean
  attempt_count?: number | null
}

export interface AssignmentFile {
  path: string
  name: string
  size: number
  mime_type: string
}

export interface AssignmentSubmission {
  id: number
  student: {
    id: number
    student_id: string
    full_name: string
    photo?: string | null
  }
  attempt_number: number
  submitted_at?: string | null
  is_late: boolean
  days_late: number
  score?: number | null
  max_score: number
  percentage?: number | null
  letter_grade?: string | null
  numeric_grade?: string | null
  passed?: boolean | null
  graded_at?: string | null
  status: string
  status_name: string
  file_count: number
  has_feedback: boolean
}

export interface SubmissionDetail {
  id: number
  assignment: {
    id: number
    title: string
    max_score: number
  }
  student: {
    id: number
    student_id: string
    full_name: string
    photo?: string | null
  }
  text_content?: string | null
  files: SubmissionFile[]
  attempt_number: number
  submitted_at?: string | null
  is_late: boolean
  days_late: number
  score?: number | null
  max_score: number
  percentage?: number | null
  feedback?: string | null
  graded_at?: string | null
  viewed_at?: string | null
  status: string
  status_name: string
}

export interface SubmissionFile {
  path: string
  name: string
  legacy?: boolean
  size?: number
  mime_type?: string
}

export interface NotSubmittedStudent {
  id: null
  student: {
    id: number
    student_id: string
    full_name: string
    photo?: string | null
  }
  submitted_at: null
  status: 'not_submitted'
  status_name: string
}

export interface SubmissionsResponse {
  assignment: {
    id: number
    title: string
    deadline: string
    max_score: number
  }
  submissions: AssignmentSubmission[]
  not_submitted: NotSubmittedStudent[]
  stats: SubmissionStats
}

export interface AssignmentStatistics {
  total_students: number
  submitted: number
  not_submitted: number
  graded: number
  pending_grading: number
  late_submissions: number
  average_score: number
  highest_score: number
  lowest_score: number
  median_score: number
  passed: number
  failed: number
  grade_distribution: {
    '5': number
    '4': number
    '3': number
    '2': number
  }
  letter_distribution: {
    A: number
    B: number
    C: number
    D: number
    E: number
    F: number
  }
}

export interface Activity {
  id: number
  student: {
    id: number
    full_name: string
  }
  activity_type: string
  activity_name: string
  details?: Record<string, unknown> | string | null
  created_at: string
  time_ago: string
}

export interface CreateAssignmentRequest {
  subject_id: number
  group_id: number
  subject_topic_id?: number
  title: string
  description?: string
  instructions?: string
  max_score: number
  deadline: string
  marking_category?: string
  allow_late?: boolean
  attempt_count?: number
  publish_now?: boolean
  files?: File[]
}

export interface UpdateAssignmentRequest {
  title?: string
  description?: string
  instructions?: string
  max_score?: number
  deadline?: string
  marking_category?: string
  allow_late?: boolean
  attempt_count?: number
  publish_now?: boolean
}

export interface GradeSubmissionRequest {
  score: number
  feedback?: string
  return_for_revision?: boolean
}

export type AssignmentStatusFilter = 'upcoming' | 'active' | 'overdue' | 'past' | null
export type SubmissionStatusFilter = 'all' | 'submitted' | 'pending' | 'graded' | 'late' | null

// ==================== SERVICE ====================

/**
 * Teacher Assignment Service
 * Manages assignments, submissions, and grading
 */
export class AssignmentService extends BaseApiService {
  constructor() {
    super('/v1/teacher/assignments')
  }

  /**
   * Get all assignments with optional filters
   */
  async getAssignments(params?: {
    subject_id?: number
    group_id?: number
    status?: AssignmentStatusFilter
  }) {
    const query = this.buildQueryString(params || {})
    return this.get<Assignment[]>(query)
  }

  /**
   * Get assignment details
   */
  async getAssignment(assignmentId: number) {
    return this.get<AssignmentDetail>(`/${assignmentId}`)
  }

  /**
   * Create new assignment with file uploads
   */
  async createAssignment(data: CreateAssignmentRequest) {
    const formData = new FormData()

    // Append scalar fields
    formData.append('subject_id', data.subject_id.toString())
    formData.append('group_id', data.group_id.toString())
    if (data.subject_topic_id) formData.append('subject_topic_id', data.subject_topic_id.toString())
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.instructions) formData.append('instructions', data.instructions)
    formData.append('max_score', data.max_score.toString())
    formData.append('deadline', data.deadline)
    if (data.marking_category) formData.append('marking_category', data.marking_category)
    if (data.allow_late !== undefined) formData.append('allow_late', data.allow_late ? '1' : '0')
    if (data.attempt_count) formData.append('attempt_count', data.attempt_count.toString())
    if (data.publish_now !== undefined) formData.append('publish_now', data.publish_now ? '1' : '0')

    // Append files
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files[]', file)
      })
    }

    return this.post<Assignment>('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Update assignment
   */
  async updateAssignment(assignmentId: number, data: UpdateAssignmentRequest) {
    return this.put<Assignment>(`/${assignmentId}`, data)
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(assignmentId: number) {
    return this.delete(`/${assignmentId}`)
  }

  /**
   * Publish assignment (make it visible to students)
   */
  async publishAssignment(assignmentId: number) {
    return this.post(`/${assignmentId}/publish`)
  }

  /**
   * Unpublish assignment (hide from students)
   */
  async unpublishAssignment(assignmentId: number) {
    return this.post(`/${assignmentId}/unpublish`)
  }

  /**
   * Get assignment submissions with optional status filter
   */
  async getSubmissions(assignmentId: number, status?: SubmissionStatusFilter) {
    const query = status ? this.buildQueryString({ status }) : ''
    return this.get<SubmissionsResponse>(`/${assignmentId}/submissions${query}`)
  }

  /**
   * Get submission details
   */
  async getSubmissionDetail(submissionId: number) {
    // Note: submissions endpoint is at /v1/teacher/submissions/{id}
    const response = await this.client.get(`/v1/teacher/submissions/${submissionId}`)
    return this.unwrapResponse(response)
  }

  /**
   * Grade a submission
   */
  async gradeSubmission(submissionId: number, data: GradeSubmissionRequest) {
    // Note: submissions endpoint is at /v1/teacher/submissions/{id}/grade
    const response = await this.client.post(`/v1/teacher/submissions/${submissionId}/grade`, data)
    return this.unwrapResponse(response)
  }

  /**
   * Download submission file
   */
  async downloadSubmissionFile(submissionId: number, fileIndex = 0) {
    // Note: submissions endpoint is at /v1/teacher/submissions/{id}/files/{fileIndex}
    const response = await this.client.get(
      `/v1/teacher/submissions/${submissionId}/files/${fileIndex}`,
      { responseType: 'blob' }
    )
    return response
  }

  /**
   * Get assignment statistics
   */
  async getAssignmentStatistics(assignmentId: number) {
    return this.get<AssignmentStatistics>(`/${assignmentId}/statistics`)
  }

  /**
   * Get assignment activity log
   */
  async getAssignmentActivities(assignmentId: number, days = 7) {
    const query = this.buildQueryString({ days })
    return this.get<Activity[]>(`/${assignmentId}/activities${query}`)
  }

  /**
   * Get teacher's subjects (for assignment creation)
   */
  async getMySubjects() {
    const response = await this.client.get('/v1/teacher/assignments/my-subjects')
    return this.unwrapResponse(response)
  }

  /**
   * Get groups for a subject (for assignment creation)
   */
  async getMyGroups(subjectId?: number) {
    const query = subjectId ? this.buildQueryString({ subject_id: subjectId }) : ''
    const response = await this.client.get(`/v1/teacher/assignments/my-groups${query}`)
    return this.unwrapResponse(response)
  }
}

// Export singleton instance
export const teacherAssignmentService = new AssignmentService()
