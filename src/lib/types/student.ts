export interface StudentAssignmentSubmission {
  grade?: number
  submitted_at?: string
}

export interface StudentAssignment {
  id: number
  title: string
  subject?: string
  deadline: string
  status: 'submitted' | 'pending' | string
  submission?: StudentAssignmentSubmission
}

export type StudentAssignmentsResult =
  | StudentAssignment[]
  | {
      data: StudentAssignment[]
    }

export interface StudentAttendanceSubject {
  id: number
  name: string
  attendance_rate: number
  present: number
  absent: number
  late: number
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | string

export interface StudentAttendanceRecord {
  id: number
  date: string
  status: AttendanceStatus
  subject?: {
    id: number
    name: string
  }
  subject_name?: string
  lesson_number?: number
  notes?: string
}

export interface StudentAttendanceStats {
  attendance_rate: number
  present: number
  absent: number
  late: number
  total: number
}

export interface StudentAttendanceResponse {
  attendance: StudentAttendanceRecord[]
  statistics: StudentAttendanceStats
  subjects: StudentAttendanceSubject[]
}

export interface StudentScheduleLesson {
  id: number
  subject?: {
    id?: number
    name?: string
  }
  subject_name?: string
  subject_code?: string
  type: 'lecture' | 'practice' | 'lab' | string
  lesson_number?: number
  lesson_pair?: number
  start_time: string
  end_time: string
  teacher?: {
    id?: number
    name?: string
  }
  teacher_name?: string
  room?: string
  room_name?: string
  week_type?: 'odd' | 'even' | 'all' | string | null
  notes?: string | null
  attendance_rate?: number
}

export interface StudentScheduleResponse {
  schedule: Record<string, StudentScheduleLesson[]>
  current_week: number
}

export interface StudentExam {
  id: number
  subject: string
  exam_type?: string
  exam_date: string
  start_time?: string
  duration?: number
  max_ball?: number
  student_ball?: number
  status: 'scheduled' | 'taken' | string
  passed?: boolean
}

export type StudentExamList = StudentExam[] | { data: StudentExam[] }

export interface StudentSummaryInfo {
  name: string
  group: string
  course: number
  semester: number
}

export interface StudentDashboardSubjectsOverview {
  total: number
}

export interface StudentDashboardAssignmentsOverview {
  total: number
  upcoming: StudentAssignment[]
}

export interface StudentDashboardTestsOverview {
  available: Array<{
    id: number
    title: string
    subject: string
    attempts_count: number
    max_attempts: number
  }>
}

export interface StudentDashboardAttendanceOverview {
  stats: {
    rate: number
  }
}

export interface StudentDashboardGradesOverview {
  statistics: {
    gpa: number
  }
  recent: Array<{
    id: number
    subject: string
    midterm: number
    final: number
    grade_letter: string
    total: number
  }>
}

export interface StudentDashboardResponse {
  student: StudentSummaryInfo
  subjects: StudentDashboardSubjectsOverview
  assignments: StudentDashboardAssignmentsOverview
  tests: StudentDashboardTestsOverview
  attendance: StudentDashboardAttendanceOverview
  grades: StudentDashboardGradesOverview
}

export interface StudentProfileSummary {
  id: number
  full_name: string
  email?: string
  phone?: string
  avatar?: string | null
  group?: string
  course?: number
  faculty?: string
  status?: string
}

export interface StudentProfileSecurity {
  last_password_change?: string
  two_fa_enabled?: boolean
}

export interface StudentProfileDocument {
  id: number
  title: string
  created_at: string
  status: string
}

export interface StudentProfileResponse {
  student: StudentProfileSummary
  security?: StudentProfileSecurity
  documents?: StudentProfileDocument[]
}

export interface StudentResourceItem {
  id: number
  title: string
  description?: string
  subject?: string
  file_url?: string
  type?: string
}

export interface StudentResourceResponse {
  data: StudentResourceItem[]
}

export interface StudentSemesterInfo {
  id: number
  name: string
  code: string
  year: string
  status: string
  gpa?: number
  subjects_count?: number
  credits?: number
  total_hours?: number
  average_grade?: number
  is_current?: boolean
  start_date?: string
  end_date?: string
  academic_year?: string
  events?: Array<{
    name: string
    date: string
  }>
  description?: string
}

export interface StudentSemestersResponse {
  data: StudentSemesterInfo[]
}

export interface StudentSubjectInfo {
  id: number
  name: string
  code: string
  teacher?: string
  credits?: number
}

export interface StudentSubjectsResponse {
  data: StudentSubjectInfo[]
}

export interface StudentTestInfo {
  id: number
  title: string
  subject?: {
    id?: number
    name?: string
  } | string
  questions_count?: number
  duration?: number
  attempts_count?: number
  max_attempts?: number
  passing_score?: number
  status?: string
  can_take?: boolean
  start_time?: string
  end_time?: string
}

export interface StudentTestsResponse {
  data: StudentTestInfo[]
}

export interface StudentTestResult {
  id: number
  test_id: number
  test?: {
    id: number
    title?: string
    subject?: {
      id?: number
      name?: string
    } | string
  }
  score: number
  correct_answers: number
  total_questions: number
  time_spent: number
  completed_at: string
  passed: boolean
  is_best_score?: boolean
}

export interface StudentTestResultsResponse {
  data: StudentTestResult[]
}

export interface SemesterGPA {
  id: number
  name: string
  code: string
  gpa: string
  average?: string
  subjects_count?: number
  credits?: number
}

export interface SubjectGPA {
  id: number
  name: string
  code?: string
  grade?: string
  credits?: number
  point?: string
}

export interface GradeDistribution {
  [grade: string]: number
}

export interface StudentGPAResponse {
  data: {
    current_gpa: number
    cumulative_gpa: number
    semesters: SemesterGPA[]
    subjects: SubjectGPA[]
    grade_distribution: GradeDistribution
  }
}

export interface StudentGradeRecord {
  id: number
  subject: string
  midterm: number
  final: number
  grade: string
  grade_letter?: string
  total: number
}

export interface StudentGradeStatistics {
  total_subjects?: number
  average?: number
  gpa?: number
}

export interface StudentGradesResponse {
  grades: StudentGradeRecord[]
  statistics?: StudentGradeStatistics
}
