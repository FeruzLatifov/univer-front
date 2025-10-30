// Employee Module Types

export interface Employee {
  id: string
  employee_id_number: string
  first_name: string
  last_name: string
  middle_name?: string
  full_name: string
  birth_date?: string
  gender: 'male' | 'female'
  phone?: string
  email?: string
  address?: string
  photo?: string
  passport_series?: string
  passport_number?: string
  inn?: string
  position: string
  position_uz?: string
  position_ru?: string
  position_en?: string
  department_id?: string
  department_name?: string
  faculty_id?: string
  faculty_name?: string
  employment_type: 'full-time' | 'part-time' | 'contract' | 'hourly'
  employment_date?: string
  academic_degree_id?: string
  academic_degree?: string
  academic_rank_id?: string
  academic_rank?: string
  is_teacher: boolean
  is_foreign: boolean
  status: 'active' | 'inactive' | 'on-leave'
  created_at: string
  updated_at: string
}

export interface Teacher extends Employee {
  teacher_id: string
  subjects: TeacherSubject[]
  workload: TeacherWorkload
  rating?: number
  publications_count?: number
  projects_count?: number
  tutor_groups?: TutorGroup[]
}

export interface TeacherSubject {
  id: string
  subject_id: string
  subject_name: string
  subject_code: string
  academic_year: string
  semester: number
  groups: string[]
  hours: number
  load_type: 'lecture' | 'practice' | 'lab' | 'seminar'
}

export interface TeacherWorkload {
  teacher_id: string
  academic_year: string
  total_hours: number
  lecture_hours: number
  practice_hours: number
  lab_hours: number
  seminar_hours: number
  consultation_hours: number
  exam_hours: number
  other_hours: number
  status: 'planned' | 'approved' | 'completed'
  updated_at: string
}

export interface AcademicDegree {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  level: number // 1-Bakalavr, 2-Magistr, 3-PhD, 4-DSc
  description?: string
  status: 'active' | 'inactive'
}

export interface AcademicRank {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  level: number
  status: 'active' | 'inactive'
}

export interface ProfessionalDevelopment {
  id: string
  employee_id: string
  employee_name: string
  type: 'training' | 'course' | 'conference' | 'seminar' | 'internship'
  title: string
  organization: string
  country?: string
  start_date: string
  end_date: string
  hours?: number
  certificate_number?: string
  certificate_file?: string
  description?: string
  created_at: string
}

export interface ForeignTraining {
  id: string
  employee_id: string
  employee_name: string
  program_name: string
  organization: string
  country: string
  start_date: string
  end_date: string
  funding_source?: string
  certificate?: string
  description?: string
  created_at: string
}

export interface TutorGroup {
  id: string
  teacher_id: string
  teacher_name: string
  group_id: string
  group_name: string
  faculty_id: string
  faculty_name: string
  academic_year: string
  students_count: number
  status: 'active' | 'inactive'
  created_at: string
}

export interface EmployeeFilters {
  search?: string
  status?: 'active' | 'inactive' | 'on-leave' | 'all'
  department_id?: string
  faculty_id?: string
  is_teacher?: boolean
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'hourly' | 'all'
  academic_degree_id?: string
  sort_by?: 'name' | 'position' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface EmployeeStats {
  total_count: number
  active_count: number
  teachers_count: number
  full_time_count: number
  part_time_count: number
  with_degree_count: number
  foreign_count: number
}

export interface WorkloadFilters {
  academic_year?: string
  semester?: number
  teacher_id?: string
  department_id?: string
  faculty_id?: string
  status?: 'planned' | 'approved' | 'completed' | 'all'
}

