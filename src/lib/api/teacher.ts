import { apiClient } from './client'

/**
 * Teacher API Service
 *
 * API endpoints for teacher portal functionality
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Subject {
  id: number
  name: string
  code: string
  credit: number
  department: string | null
  groups: Group[]
  total_students: number
  schedule_count: number
  schedules: Schedule[]
}

export interface Group {
  id: number
  name: string
  semester: number
  specialty?: string
  student_count?: number
  subjects?: SubjectInfo[]
}

export interface SubjectInfo {
  id: number
  name: string
  code: string
}

export interface Schedule {
  id: number
  day: number
  day_name: string
  time: string | null
  group: string | null
  training_type: string
}

export interface WeeklySchedule {
  day: number
  day_name: string
  classes: ClassSchedule[]
}

export interface ClassSchedule {
  id: number
  subject: {
    id: number
    name: string
    code: string
  }
  group: {
    id: number
    name: string
  }
  time: {
    pair_number: number
    start: string
    end: string
    range: string
  }
  training_type: string
  semester?: number
}

export interface Workload {
  summary: {
    total_classes_per_week: number
    total_subjects: number
    total_groups: number
  }
  subjects: WorkloadSubject[]
}

export interface WorkloadSubject {
  subject_id: number
  subject_name: string
  subject_code: string
  credit: number
  classes_per_week: number
  groups: number
}

export interface Student {
  id: number
  student_id: string
  full_name: string
  group: string | null
  photo: string | null
  phone: string | null
  attendance_rate: number
  total_classes: number
  present_classes: number
  grades: GradeInfo[]
}

export interface GradeInfo {
  type: string
  grade: number
  max_grade: number
  percentage: number
  letter_grade: string
}

export interface AttendanceList {
  subject: {
    id: number
    name: string
  }
  group: {
    id: number
    name: string
  }
  date: string
  students: AttendanceStudent[]
}

export interface AttendanceStudent {
  id: number
  student_id: string
  full_name: string
  photo: string | null
  attendance_status: string | null
  attendance_status_name: string
  reason: string | null
}

export interface MarkAttendanceRequest {
  subject_schedule_id: number
  date: string
  attendance: {
    student_id: number
    status: '11' | '12' | '13' | '14' // present, absent, late, excused
    reason?: string
  }[]
}

export interface GradeRequest {
  subject_id: number
  student_id: number
  grade_type: 'current' | 'midterm' | 'final' | 'overall'
  grade: number
  max_grade: number
  comment?: string
}

export interface AttendanceReport {
  subject: string
  group: string
  period: {
    start: string
    end: string
  }
  total_classes: number
  students: StudentAttendanceReport[]
}

export interface StudentAttendanceReport {
  student_id: string
  full_name: string
  total_classes: number
  present: number
  absent: number
  late: number
  excused: number
  attendance_rate: number
}

export interface GradeStatistics {
  subject: string
  group: string
  grade_type: string
  statistics: {
    total_students: number
    average_percentage: number
    highest_percentage: number
    lowest_percentage: number
    distribution: {
      A: number
      B: number
      C: number
      D: number
      E: number
      F: number
    }
  }
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * SUBJECTS & TEACHING LOAD
 */

// Get all subjects taught by teacher
export const getMySubjects = async () => {
  const response = await apiClient.get('/v1/teacher/subjects')
  return response.data
}

// Get subject details
export const getSubjectDetails = async (id: number) => {
  const response = await apiClient.get(`/v1/teacher/subject/${id}`)
  return response.data
}

// Get students for a subject
export const getSubjectStudents = async (id: number) => {
  const response = await apiClient.get(`/v1/teacher/subject/${id}/students`)
  return response.data
}

/**
 * SCHEDULE & WORKLOAD
 */

// Get weekly schedule
export const getMySchedule = async (semester?: number) => {
  const response = await apiClient.get('/v1/teacher/schedule', {
    params: { semester },
  })
  return response.data
}

// Get schedule for specific day
export const getScheduleByDay = async (day: number) => {
  const response = await apiClient.get(`/v1/teacher/schedule/day/${day}`)
  return response.data
}

// Get workload summary
export const getMyWorkload = async (semester?: number) => {
  const response = await apiClient.get('/v1/teacher/workload', {
    params: { semester },
  })
  return response.data
}

// Get groups taught
export const getMyGroups = async () => {
  const response = await apiClient.get('/v1/teacher/groups')
  return response.data
}

/**
 * ATTENDANCE MANAGEMENT
 */

// Get attendance list for a subject
export const getAttendanceList = async (subjectId: number, date?: string) => {
  const response = await apiClient.get(`/v1/teacher/subject/${subjectId}/attendance`, {
    params: { date },
  })
  return response.data
}

// Mark attendance
export const markAttendance = async (data: MarkAttendanceRequest) => {
  const response = await apiClient.post('/v1/teacher/attendance/mark', data)
  return response.data
}

// Update single attendance record
export const updateAttendance = async (id: number, data: { status: string; reason?: string }) => {
  const response = await apiClient.put(`/v1/teacher/attendance/${id}`, data)
  return response.data
}

// Get attendance report
export const getAttendanceReport = async (subjectId: number, startDate: string, endDate: string) => {
  const response = await apiClient.get('/v1/teacher/attendance/report', {
    params: {
      subject_id: subjectId,
      start_date: startDate,
      end_date: endDate,
    },
  })
  return response.data
}

/**
 * GRADING & PERFORMANCE
 */

// Get grades for a subject
export const getSubjectGrades = async (subjectId: number, gradeType?: string) => {
  const response = await apiClient.get(`/v1/teacher/subject/${subjectId}/grades`, {
    params: { type: gradeType },
  })
  return response.data
}

// Enter/update grade
export const gradeStudent = async (data: GradeRequest) => {
  const response = await apiClient.post('/v1/teacher/grade', data)
  return response.data
}

// Update existing grade
export const updateGrade = async (id: number, data: Partial<GradeRequest>) => {
  const response = await apiClient.put(`/v1/teacher/grade/${id}`, data)
  return response.data
}

// Get grade statistics
export const getGradeReport = async (subjectId: number, gradeType?: string) => {
  const response = await apiClient.get('/v1/teacher/grade/report', {
    params: {
      subject_id: subjectId,
      grade_type: gradeType,
    },
  })
  return response.data
}

/**
 * HELPER FUNCTIONS
 */

// Attendance status options
export const ATTENDANCE_STATUS = {
  PRESENT: '11',
  ABSENT: '12',
  LATE: '13',
  EXCUSED: '14',
} as const

// Attendance status names
export const ATTENDANCE_STATUS_NAMES = {
  '11': 'Kelgan',
  '12': 'Kelmagan',
  '13': 'Kech kelgan',
  '14': 'Sababli',
} as const

// Grade types
export const GRADE_TYPES = {
  CURRENT: 'current',
  MIDTERM: 'midterm',
  FINAL: 'final',
  OVERALL: 'overall',
} as const

// Grade type names
export const GRADE_TYPE_NAMES = {
  current: 'Joriy nazorat',
  midterm: 'Oraliq nazorat',
  final: 'Yakuniy nazorat',
  overall: 'Umumiy baho',
} as const

// Day names
export const DAY_NAMES = [
  '',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
] as const

// ==========================================
// ASSIGNMENT/TASK TYPES
// ==========================================

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
  details?: Record<string, unknown>
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

// Assignment status filter options
export type AssignmentStatusFilter = 'upcoming' | 'active' | 'overdue' | 'past' | null

// Submission status filter options
export type SubmissionStatusFilter = 'all' | 'submitted' | 'pending' | 'graded' | 'late' | null

// Marking category constants
export const MARKING_CATEGORIES = {
  MIDTERM: '11',
  FINAL: '12',
  INDEPENDENT: '13',
  PRACTICAL: '14',
  LABORATORY: '15',
} as const

export const MARKING_CATEGORY_NAMES = {
  '11': 'Oraliq nazorat',
  '12': 'Yakuniy nazorat',
  '13': 'Mustaqil ish',
  '14': 'Amaliy mashg\'ulot',
  '15': 'Laboratoriya',
} as const

// Submission status constants
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  VIEWED: 'viewed',
  GRADING: 'grading',
  GRADED: 'graded',
  RETURNED: 'returned',
} as const

export const SUBMISSION_STATUS_NAMES = {
  pending: 'Kutilmoqda',
  draft: 'Qoralama',
  submitted: 'Yuborilgan',
  viewed: 'Ko\'rilgan',
  grading: 'Baholanmoqda',
  graded: 'Baholangan',
  returned: 'Qaytarilgan',
  not_submitted: 'Topshirilmagan',
} as const

// ==========================================
// HELPER API FUNCTIONS (Dropdowns)
// ==========================================

/**
 * Get teacher's subjects (for dropdown) - alternative endpoint
 */
export const getMySubjectsDropdown = async () => {
  const response = await apiClient.get('/v1/teacher/my-subjects')
  return response.data
}

/**
 * Get teacher's groups (for dropdown) - alternative endpoint
 * Optionally filter by subject_id
 */
export const getMyGroupsDropdown = async (subjectId?: number) => {
  const response = await apiClient.get('/v1/teacher/my-groups', {
    params: subjectId ? { subject_id: subjectId } : undefined,
  })
  return response.data
}

// ASSIGNMENT API FUNCTIONS
// ==========================================

/**
 * Get all assignments for teacher
 */
export const getAssignments = async (params?: {
  subject_id?: number
  group_id?: number
  status?: AssignmentStatusFilter
}) => {
  const response = await apiClient.get('/v1/teacher/assignments', { params })
  return response.data
}

/**
 * Get assignment details
 */
export const getAssignment = async (id: number) => {
  const response = await apiClient.get(`/v1/teacher/assignment/${id}`)
  return response.data
}

/**
 * Create new assignment
 */
export const createAssignment = async (data: CreateAssignmentRequest) => {
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

  const response = await apiClient.post('/v1/teacher/assignment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Update assignment
 */
export const updateAssignment = async (id: number, data: UpdateAssignmentRequest) => {
  const response = await apiClient.put(`/v1/teacher/assignment/${id}`, data)
  return response.data
}

/**
 * Delete assignment
 */
export const deleteAssignment = async (id: number) => {
  const response = await apiClient.delete(`/v1/teacher/assignment/${id}`)
  return response.data
}

/**
 * Publish assignment
 */
export const publishAssignment = async (id: number) => {
  const response = await apiClient.post(`/v1/teacher/assignment/${id}/publish`)
  return response.data
}

/**
 * Unpublish assignment
 */
export const unpublishAssignment = async (id: number) => {
  const response = await apiClient.post(`/v1/teacher/assignment/${id}/unpublish`)
  return response.data
}

/**
 * Get assignment submissions
 */
export const getSubmissions = async (assignmentId: number, status?: SubmissionStatusFilter) => {
  const response = await apiClient.get(`/v1/teacher/assignment/${assignmentId}/submissions`, {
    params: { status },
  })
  return response.data
}

/**
 * Get submission details
 */
export const getSubmissionDetail = async (submissionId: number) => {
  const response = await apiClient.get(`/v1/teacher/submission/${submissionId}`)
  return response.data
}

/**
 * Grade submission
 */
export const gradeSubmission = async (submissionId: number, data: GradeSubmissionRequest) => {
  const response = await apiClient.post(`/v1/teacher/submission/${submissionId}/grade`, data)
  return response.data
}

/**
 * Download submission file
 */
export const downloadSubmissionFile = async (submissionId: number, fileIndex = 0) => {
  const response = await apiClient.get(
    `/v1/teacher/submission/${submissionId}/download/${fileIndex}`,
    { responseType: 'blob' }
  )
  return response
}

/**
 * Get assignment statistics
 */
export const getAssignmentStatistics = async (assignmentId: number) => {
  const response = await apiClient.get(`/v1/teacher/assignment/${assignmentId}/statistics`)
  return response.data
}

/**
 * Get assignment activities
 */
export const getAssignmentActivities = async (assignmentId: number, days = 7) => {
  const response = await apiClient.get(`/v1/teacher/assignment/${assignmentId}/activities`, {
    params: { days },
  })
  return response.data
}

// ==========================================
// TEST/QUIZ TYPES
// ==========================================

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | number
export type TestStatus = 'available' | 'upcoming' | 'expired'
export type AttemptStatus = 'started' | 'in_progress' | 'submitted' | 'graded' | 'abandoned'

export interface Test {
  id: number
  subject_id?: number
  subject: {
    id: number
    name: string
  }
  employee: {
    id: number
    full_name: string
  }
  group_id?: number
  group?: {
    id: number
    name: string
  } | null
  topic?: {
    id: number
    name: string
  } | null
  title: string
  name?: string
  description?: string
  duration: number | null
  duration_formatted: string
  passing_score?: number | null
  max_score: number
  question_count: number
  attempt_limit: number
  max_attempts?: number
  start_date?: string | null
  end_date?: string | null
  is_published: boolean
  published_at?: string | null
  is_available: boolean
  is_expired: boolean
  days_until_end?: number | null
  attempt_stats: AttemptStats
  created_at: string
  updated_at: string
  shuffle_questions?: boolean
  shuffle_answers?: boolean
  show_results?: boolean
  status?: number | string
}

export interface AttemptStats {
  total_attempts: number
  completed: number
  pending: number
  average_score: number
  pass_rate?: number | null
}

export interface TestDetail extends Test {
  instructions?: string
  randomize_questions: boolean
  randomize_answers: boolean
  show_correct_answers: boolean
  allow_review: boolean
  position: number
  average_score?: number | null
  questions: Question[]
}

export interface Question {
  id: number
  _test: number
  question_text: string
  question_type: QuestionType
  points: number
  position: number
  is_required: boolean
  allow_multiple?: boolean
  case_sensitive?: boolean
  word_limit?: number | null
  explanation?: string | null
  image_path?: string | null
  is_multiple_choice: boolean
  is_true_false: boolean
  is_short_answer: boolean
  is_essay: boolean
  can_auto_grade: boolean
  requires_manual_grading: boolean
  answers?: AnswerOption[]
  statistics: QuestionStatistics
  created_at: string
  updated_at: string
}

export interface QuestionDetail extends Question {
  correct_answers?: string | null
  correct_answers_array?: number[]
  correct_answer_text?: string | null
  correct_answer_boolean?: boolean | null
}

export interface AnswerOption {
  id: number
  _question: number
  answer_text: string
  image_path?: string | null
  position: number
  is_correct: boolean
}

export interface QuestionStatistics {
  total_answers: number
  correct_answers: number
  incorrect_answers: number
  correct_percentage: number
  average_points: number
}

export interface TestAttempt {
  id: number
  _test: number
  _student: number
  attempt_number: number
  status: AttemptStatus
  started_at?: string | null
  submitted_at?: string | null
  graded_at?: string | null
  duration_seconds?: number | null
  duration_formatted: string
  total_score?: number | null
  max_score: number
  percentage?: number | null
  letter_grade?: string | null
  numeric_grade?: string | null
  passed?: boolean | null
  auto_graded_score?: number | null
  manual_graded_score?: number | null
  requires_manual_grading: boolean
  student: {
    id: number
    student_id: string
    full_name: string
    photo?: string | null
  }
  test: {
    id: number
    title: string
    passing_score?: number | null
  }
}

export interface TestAttemptDetail extends TestAttempt {
  feedback?: string | null
  answers: StudentAnswer[]
}

export interface StudentAnswer {
  id: number
  _question: number
  question: {
    id: number
    question_text: string
    question_type: QuestionType
    points: number
    explanation?: string | null
  }
  answer_text?: string | null
  answer_boolean?: boolean | null
  selected_answers_array?: number[]
  display_value?: string | null
  points_earned?: number | null
  points_possible: number
  percentage?: number | null
  is_correct?: boolean | null
  manually_graded: boolean
  graded_by?: number | null
  graded_at?: string | null
  feedback?: string | null
  answered_at?: string | null
}

export interface TestResultsSummary {
  total_attempts: number
  graded: number
  pending_grading: number
  average_score: number
  pass_rate?: number | null
}

export interface CreateTestRequest {
  subject_id: number
  employee_id?: number
  group_id?: number
  subject_topic_id?: number
  title?: string
  name?: string
  description?: string
  instructions?: string
  duration?: number
  passing_score?: number
  randomize_questions?: boolean
  randomize_answers?: boolean
  show_correct_answers?: boolean
  shuffle_questions?: boolean
  shuffle_answers?: boolean
  show_results?: boolean
  status?: number
  attempt_limit?: number
  max_attempts?: number
  allow_review?: boolean
  start_date?: string
  end_date?: string
  position?: number
}

export interface UpdateTestRequest {
  subject_id?: number
  employee_id?: number
  group_id?: number
  subject_topic_id?: number
  title?: string
  name?: string
  description?: string
  instructions?: string
  duration?: number | null
  passing_score?: number
  randomize_questions?: boolean
  randomize_answers?: boolean
  show_correct_answers?: boolean
  shuffle_questions?: boolean
  shuffle_answers?: boolean
  show_results?: boolean
  status?: number
  attempt_limit?: number
  max_attempts?: number
  allow_review?: boolean
  start_date?: string
  end_date?: string
  position?: number
}

export interface CreateQuestionRequest {
  question_text: string
  question_type: QuestionType
  points: number
  position?: number
  is_required?: boolean
  image_path?: string
  explanation?: string
  // Multiple choice specific
  allow_multiple?: boolean
  correct_answers?: number[]
  // True/False specific
  correct_answer_boolean?: boolean
  // Short answer specific
  correct_answer_text?: string
  case_sensitive?: boolean
  // Essay specific
  word_limit?: number
}

export interface UpdateQuestionRequest {
  question_text?: string
  question_type?: QuestionType
  points?: number
  position?: number
  is_required?: boolean
  image_path?: string
  explanation?: string
  allow_multiple?: boolean
  correct_answers?: number[]
  correct_answer_boolean?: boolean
  correct_answer_text?: string
  case_sensitive?: boolean
  word_limit?: number
}

export interface CreateAnswerOptionRequest {
  answer_text: string
  image_path?: string
  position?: number
  is_correct?: boolean
}

export interface UpdateAnswerOptionRequest {
  answer_text?: string
  image_path?: string
  position?: number
  is_correct?: boolean
}

export interface GradeAttemptRequest {
  graded_by: number
  answers: {
    answer_id: number
    points_earned: number
    feedback?: string
  }[]
  overall_feedback?: string
}

// Test filter options
export type TestStatusFilter = 'all' | 'published' | 'available' | 'upcoming' | 'expired' | null

// ==========================================
// TEST/QUIZ API FUNCTIONS
// ==========================================

/**
 * TEST CRUD OPERATIONS
 */

// Get all tests
export const getTests = async (params?: {
  subject_id?: number
  employee_id?: number
  group_id?: number
  is_published?: boolean
  status?: TestStatusFilter
  per_page?: number
}) => {
  const response = await apiClient.get('/v1/teacher/tests', { params })
  return response.data
}

// Create new test
export const createTest = async (data: CreateTestRequest) => {
  const response = await apiClient.post('/v1/teacher/test', data)
  return response.data
}

// Get test details
export const getTest = async (id: number) => {
  const response = await apiClient.get(`/v1/teacher/test/${id}`)
  return response.data
}

// Update test
export const updateTest = async (id: number, data: UpdateTestRequest) => {
  const response = await apiClient.put(`/v1/teacher/test/${id}`, data)
  return response.data
}

// Delete test
export const deleteTest = async (id: number) => {
  const response = await apiClient.delete(`/v1/teacher/test/${id}`)
  return response.data
}

// Duplicate test
export const duplicateTest = async (id: number) => {
  const response = await apiClient.post(`/v1/teacher/test/${id}/duplicate`)
  return response.data
}

// Publish test
export const publishTest = async (id: number) => {
  const response = await apiClient.post(`/v1/teacher/test/${id}/publish`)
  return response.data
}

// Unpublish test
export const unpublishTest = async (id: number) => {
  const response = await apiClient.post(`/v1/teacher/test/${id}/unpublish`)
  return response.data
}

/**
 * QUESTION MANAGEMENT
 */

// Get test questions
export const getTestQuestions = async (testId: number) => {
  const response = await apiClient.get(`/v1/teacher/test/${testId}/questions`)
  return response.data
}

// Add question to test
export const addQuestion = async (testId: number, data: CreateQuestionRequest) => {
  const response = await apiClient.post(`/v1/teacher/test/${testId}/question`, data)
  return response.data
}

// Get question details
export const getQuestion = async (testId: number, questionId: number) => {
  const response = await apiClient.get(`/v1/teacher/test/${testId}/question/${questionId}`)
  return response.data
}

// Update question
export const updateQuestion = async (testId: number, questionId: number, data: UpdateQuestionRequest) => {
  const response = await apiClient.put(`/v1/teacher/test/${testId}/question/${questionId}`, data)
  return response.data
}

// Delete question
export const deleteQuestion = async (testId: number, questionId: number) => {
  const response = await apiClient.delete(`/v1/teacher/test/${testId}/question/${questionId}`)
  return response.data
}

// Reorder questions
export const reorderQuestions = async (testId: number, order: number[]) => {
  const response = await apiClient.post(`/v1/teacher/test/${testId}/questions/reorder`, { order })
  return response.data
}

// Duplicate question
export const duplicateQuestion = async (testId: number, questionId: number) => {
  const response = await apiClient.post(`/v1/teacher/test/${testId}/question/${questionId}/duplicate`)
  return response.data
}

/**
 * ANSWER OPTIONS (for Multiple Choice questions)
 */

// Add answer option
export const addAnswerOption = async (testId: number, questionId: number, data: CreateAnswerOptionRequest) => {
  const response = await apiClient.post(`/v1/teacher/test/${testId}/question/${questionId}/answer`, data)
  return response.data
}

// Update answer option
export const updateAnswerOption = async (
  testId: number,
  questionId: number,
  answerId: number,
  data: UpdateAnswerOptionRequest
) => {
  const response = await apiClient.put(
    `/v1/teacher/test/${testId}/question/${questionId}/answer/${answerId}`,
    data
  )
  return response.data
}

// Delete answer option
export const deleteAnswerOption = async (testId: number, questionId: number, answerId: number) => {
  const response = await apiClient.delete(`/v1/teacher/test/${testId}/question/${questionId}/answer/${answerId}`)
  return response.data
}

/**
 * TEST RESULTS & GRADING
 */

// Get test results
export const getTestResults = async (
  testId: number,
  params?: {
    student_id?: number
    status?: AttemptStatus
    passed?: boolean
  }
) => {
  const response = await apiClient.get(`/v1/teacher/test/${testId}/results`, { params })
  return response.data
}

// Get specific attempt details
export const getAttemptDetail = async (testId: number, attemptId: number) => {
  const response = await apiClient.get(`/v1/teacher/test/${testId}/attempt/${attemptId}`)
  return response.data
}

// Grade attempt manually
export const gradeAttempt = async (testId: number, attemptId: number, data: GradeAttemptRequest) => {
  const response = await apiClient.post(`/v1/teacher/test/${testId}/attempt/${attemptId}/grade`, data)
  return response.data
}

// ==========================================
// TEST CONSTANTS
// ==========================================

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
} as const

export const QUESTION_TYPE_NAMES = {
  multiple_choice: 'Ko\'p variantli',
  true_false: 'To\'g\'ri/Noto\'g\'ri',
  short_answer: 'Qisqa javob',
  essay: 'Insho',
} as const

export const ATTEMPT_STATUS_NAMES = {
  started: 'Boshlangan',
  in_progress: 'Jarayonda',
  submitted: 'Yuborilgan',
  graded: 'Baholangan',
  abandoned: 'Tark etilgan',
} as const

export const LETTER_GRADES = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export const NUMERIC_GRADES = ['5', '4', '3', '2'] as const

// ==========================================
// DASHBOARD TYPES & API
// ==========================================

export interface DashboardData {
  summary: {
    today_classes: number
    total_students: number
    total_subjects: number
    total_groups: number
    pending_assignments: number
    pending_attendance: number
    weekly_classes: number
  }
  today_schedule: {
    date: string
    day_name: string
    classes: TodayClass[]
  }
  pending_attendance_classes: PendingAttendanceClass[]
  quick_stats: {
    attendance_rate: number
    upcoming_exams: number
  }
}

export interface PendingAttendanceClass {
  id: number
  lesson_date: string
  days_ago: number
  subject: {
    id: number
    name: string
    code: string
  }
  group: {
    id: number
    name: string
  }
  training_type: string
}

export interface TodayClass {
  id: number
  subject: {
    id: number
    name: string
    code: string
  }
  group: {
    id: number
    name: string
  }
  time: {
    start: string | null
    end: string | null
    pair_number: number | null
  }
  training_type: string
  auditorium: string | number | null
}

export interface DashboardActivity {
  type: string
  date: string
  description: string
  student?: string
}

export interface DashboardStats {
  subjects: {
    total: number
  }
  groups: {
    total: number
  }
  students: {
    total: number
  }
  workload: {
    weekly_hours: number
    total_classes: number
  }
}

/**
 * Get teacher dashboard data
 */
export const getDashboard = async () => {
  const response = await apiClient.get('/v1/teacher/dashboard')
  return response.data
}

/**
 * Get recent activities
 */
export const getDashboardActivities = async (limit = 10) => {
  const response = await apiClient.get('/v1/teacher/dashboard/activities', {
    params: { limit },
  })
  return response.data
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/v1/teacher/dashboard/stats')
  return response.data
}
