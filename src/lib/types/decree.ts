// Decree and Transfer Module Types

export interface Decree {
  id: string
  decree_number: string
  decree_date: string
  decree_type: 'enrollment' | 'transfer' | 'expulsion' | 'graduation' | 'academic-leave' | 'restore' | 'disciplinary' | 'other'
  title: string
  description?: string
  template_id?: string
  template_name?: string
  students: DecreeStudent[]
  file?: string
  signed_file?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface DecreeStudent {
  id: string
  decree_id: string
  student_id: string
  student_name: string
  student_id_number: string
  group_name?: string
  faculty_name?: string
  reason?: string
  comment?: string
}

export interface DecreeTemplate {
  id: string
  code: string
  name: string
  decree_type: 'enrollment' | 'transfer' | 'expulsion' | 'graduation' | 'academic-leave' | 'restore' | 'disciplinary' | 'other'
  template_text: string
  variables: string[] // {{student_name}}, {{decree_number}}, etc.
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Transfer {
  id: string
  transfer_type: 'group' | 'course' | 'faculty' | 'specialty' | 'education-form'
  student_id: string
  student_name: string
  student_id_number: string
  from_group_id?: string
  from_group_name?: string
  to_group_id?: string
  to_group_name?: string
  from_course?: number
  to_course?: number
  from_faculty_id?: string
  from_faculty_name?: string
  to_faculty_id?: string
  to_faculty_name?: string
  transfer_date: string
  reason: string
  decree_id?: string
  decree_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Expulsion {
  id: string
  expulsion_type: 'academic' | 'disciplinary' | 'personal' | 'financial' | 'other'
  student_id: string
  student_name: string
  student_id_number: string
  group_id: string
  group_name: string
  faculty_id: string
  faculty_name: string
  course: number
  expulsion_date: string
  reason: string
  decree_id?: string
  decree_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface AcademicLeave {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  group_id: string
  group_name: string
  faculty_id: string
  faculty_name: string
  leave_type: 'medical' | 'maternity' | 'military' | 'personal' | 'other'
  start_date: string
  end_date: string
  planned_return_date?: string
  actual_return_date?: string
  reason: string
  documents?: string[]
  decree_id?: string
  decree_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'returned' | 'cancelled'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Restore {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  previous_group_id?: string
  previous_group_name?: string
  new_group_id: string
  new_group_name: string
  faculty_id: string
  faculty_name: string
  expulsion_decree_id?: string
  expulsion_reason?: string
  restore_date: string
  reason: string
  decree_id?: string
  decree_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Graduation {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  group_id: string
  group_name: string
  faculty_id: string
  faculty_name: string
  specialty_code: string
  specialty_name: string
  graduation_type: 'regular' | 'early' | 'deferred'
  graduation_date: string
  diploma_type: 'bachelor' | 'master' | 'specialist'
  diploma_with_honors: boolean
  gpa?: number
  decree_id?: string
  decree_number?: string
  diploma_number?: string
  diploma_series?: string
  status: 'pending' | 'approved' | 'completed'
  created_by: string
  created_by_name: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface StudentStatus {
  student_id: string
  student_name: string
  current_status: 'active' | 'academic-leave' | 'transferred' | 'expelled' | 'graduated'
  status_date: string
  status_decree_id?: string
  group_id?: string
  group_name?: string
  course?: number
  semester?: number
  faculty_id?: string
  faculty_name?: string
}

export interface DecreeFilters {
  search?: string
  decree_type?: string
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived' | 'all'
  date_from?: string
  date_to?: string
  created_by?: string
  sort_by?: 'decree_number' | 'decree_date' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface TransferFilters {
  search?: string
  transfer_type?: string
  status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'all'
  faculty_id?: string
  date_from?: string
  date_to?: string
  sort_by?: 'transfer_date' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface DecreeStats {
  total_decrees: number
  pending_decrees: number
  approved_decrees: number
  this_month_count: number
  by_type: {
    enrollment: number
    transfer: number
    expulsion: number
    graduation: number
    academic_leave: number
    restore: number
  }
}

