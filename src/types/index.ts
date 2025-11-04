// ============================================
// CORE TYPES
// ============================================

export interface PaginationMeta {
  current_page: number
  total_pages: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

// ============================================
// STUDENT TYPES
// ============================================

export interface Student {
  id: string
  student_id_number: string
  first_name: string
  second_name: string
  third_name: string
  full_name: string
  birth_date: string
  gender: 'male' | 'female'
  citizenship: string
  passport_number: string
  phone: string
  email: string
  address: string
  photo?: string
  
  // Academic info
  education_type: 'full_time' | 'part_time' | 'evening' | 'distance'
  education_form: 'budget' | 'contract'
  level: 'bachelor' | 'master' | 'phd'
  course: number
  semester: number
  group_id: string
  group_name: string
  specialty_code: string
  specialty_name: string
  department: string
  faculty: string
  
  // Status
  status: 'active' | 'academic_leave' | 'expelled' | 'graduated'
  enrollment_date: string
  graduation_date?: string
  
  // Performance
  gpa: number
  total_credits: number
  debt_count: number
  
  created_at: string
  updated_at: string
}

export interface StudentGroup {
  id: string
  name: string
  course: number
  semester: number
  specialty_code: string
  specialty_name: string
  department: string
  faculty: string
  education_type: 'full_time' | 'part_time' | 'evening' | 'distance'
  education_form: 'budget' | 'contract'
  level: 'bachelor' | 'master' | 'phd'
  curator_id?: string
  curator_name?: string
  student_count: number
  active: boolean
  created_at: string
}

// ============================================
// PERFORMANCE TYPES
// ============================================

export interface Grade {
  id: string
  student_id: string
  student_name: string
  subject_id: string
  subject_name: string
  semester: number
  education_year: string
  
  // Midterm grades
  midterm_1?: number
  midterm_2?: number
  midterm_avg?: number
  
  // Current control
  current_1?: number
  current_2?: number
  current_3?: number
  current_avg?: number
  
  // Final exam
  final_exam?: number
  total: number
  grade: string
  credit: number
  
  // Status
  status: 'passed' | 'failed' | 'pending'
  retake_count: number
  
  created_at: string
  updated_at: string
}

export interface GPA {
  student_id: string
  student_name: string
  semester: number
  total_credits: number
  earned_credits: number
  semester_gpa: number
  cumulative_gpa: number
  rank: number
  created_at: string
}

// ============================================
// ATTENDANCE TYPES
// ============================================

export interface Attendance {
  id: string
  student_id: string
  student_name: string
  subject_id: string
  subject_name: string
  lesson_date: string
  lesson_number: number
  lesson_type: 'lecture' | 'practice' | 'lab' | 'seminar'
  status: 'present' | 'absent' | 'late' | 'excused'
  reason?: string
  created_at: string
}

export interface AttendanceStats {
  student_id: string
  student_name: string
  subject_id: string
  subject_name: string
  total_lessons: number
  present_count: number
  absent_count: number
  late_count: number
  excused_count: number
  attendance_percentage: number
}

// ============================================
// FINANCE TYPES
// ============================================

export interface Contract {
  id: string
  contract_number: string
  student_id: string
  student_name: string
  contract_date: string
  contract_sum: number
  paid_sum: number
  debt_sum: number
  discount_percent: number
  
  // Payment schedule
  summa_1: number
  summa_2: number
  summa_3: number
  summa_4: number
  
  // Dates
  date_1: string
  date_2: string
  date_3: string
  date_4: string
  
  status: 'active' | 'completed' | 'terminated'
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  student_id: string
  student_name: string
  contract_id: string
  payment_date: string
  amount: number
  payment_type: 'cash' | 'card' | 'transfer' | 'payme' | 'click' | 'uzum'
  payment_purpose: string
  receipt_number: string
  status: 'confirmed' | 'pending' | 'cancelled'
  created_by: string
  created_at: string
}

// ============================================
// CURRICULUM TYPES
// ============================================

export interface Subject {
  id: string
  code: string
  name: string
  name_en?: string
  credit: number
  total_hours: number
  lecture_hours: number
  practice_hours: number
  lab_hours: number
  independent_hours: number
  
  department: string
  faculty: string
  semester: number
  is_mandatory: boolean
  prerequisite_ids?: string[]
  
  description?: string
  syllabus?: string
  
  created_at: string
  updated_at: string
}

export interface Curriculum {
  id: string
  name: string
  specialty_code: string
  specialty_name: string
  level: 'bachelor' | 'master' | 'phd'
  education_type: 'full_time' | 'part_time' | 'evening' | 'distance'
  total_credits: number
  total_semesters: number
  active: boolean
  subjects: CurriculumSubject[]
  created_at: string
}

export interface CurriculumSubject {
  subject_id: string
  subject_name: string
  credit: number
  semester: number
  is_mandatory: boolean
  category: 'general' | 'basic' | 'major' | 'elective'
}

export interface Schedule {
  id: string
  subject_id: string
  subject_name: string
  group_id: string
  group_name: string
  teacher_id: string
  teacher_name: string
  room: string
  building: string
  day_of_week: number
  lesson_pair: number
  lesson_type: 'lecture' | 'practice' | 'lab' | 'seminar'
  weeks: string
  semester: number
  education_year: string
  created_at: string
}

// ============================================
// TEACHER TYPES
// ============================================

export interface Teacher {
  id: string
  employee_number: string
  first_name: string
  second_name: string
  third_name: string
  full_name: string
  birth_date: string
  gender: 'male' | 'female'
  phone: string
  email: string
  photo?: string
  
  // Academic info
  department: string
  faculty: string
  position: string
  academic_degree?: 'bachelor' | 'master' | 'phd' | 'dsc'
  academic_title?: 'assistant' | 'senior_lecturer' | 'docent' | 'professor'
  
  // Work info
  employment_type: 'full_time' | 'part_time' | 'hourly'
  hire_date: string
  work_rate: number
  
  // Status
  status: 'active' | 'vacation' | 'dismissed'
  
  created_at: string
  updated_at: string
}

// ============================================
// EXAM TYPES
// ============================================

export interface Exam {
  id: string
  subject_id: string
  subject_name: string
  group_id: string
  group_name: string
  teacher_id: string
  teacher_name: string
  exam_type: 'midterm' | 'final' | 'retake'
  exam_date: string
  exam_time: string
  duration: number
  room: string
  building: string
  max_students: number
  registered_students: number
  semester: number
  education_year: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
}

// ============================================
// ARCHIVE TYPES
// ============================================

export interface Diploma {
  id: string
  student_id: string
  student_name: string
  diploma_series: string
  diploma_number: string
  registration_number: string
  issue_date: string
  specialty_code: string
  specialty_name: string
  qualification: string
  gpa: number
  honors: boolean
  thesis_topic: string
  thesis_grade: number
  status: 'issued' | 'pending' | 'cancelled'
  created_at: string
}

// ============================================
// SYSTEM TYPES
// ============================================

export interface User {
  id: string
  username: string
  email: string
  full_name: string
  role: 'admin' | 'dean' | 'teacher' | 'student' | 'accountant' | 'registrar'
  status: 'active' | 'inactive'
  last_login?: string
  created_at: string
}

export interface Role {
  id: string
  name: string
  code: string
  permissions: string[]
  user_count: number
  created_at: string
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface DashboardStats {
  total_students: number
  active_students: number
  total_teachers: number
  total_subjects: number
  average_gpa: number
  attendance_rate: number
  payment_rate: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

// ============================================
// MENU TYPES
// ============================================

export interface MenuItem {
  id: string
  label: string
  url: string
  icon: string
  permission?: string | null
  items: MenuItem[]
  active: boolean
  order?: number | null
}

export interface MenuState {
  menu: MenuItem[]
  permissions: string[]
  locale: string
  loading: boolean
  error: string | null
  cached: boolean
  cacheExpiresAt: number | null
}

