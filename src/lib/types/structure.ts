// Structure Module Types

export interface University {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  short_name?: string
  inn?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  rector_name?: string
  rector_phone?: string
  logo?: string
  description?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  established_year?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Faculty {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  short_name?: string
  university_id: string
  dean_id?: string
  dean_name?: string
  dean_phone?: string
  dean_email?: string
  location?: string
  description?: string
  students_count?: number
  teachers_count?: number
  departments_count?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  short_name?: string
  faculty_id: string
  faculty_name?: string
  head_id?: string
  head_name?: string
  head_phone?: string
  head_email?: string
  location?: string
  description?: string
  teachers_count?: number
  subjects_count?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  code: string
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  short_name?: string
  type: 'administrative' | 'academic' | 'support' | 'other'
  parent_id?: string
  head_id?: string
  head_name?: string
  head_phone?: string
  head_email?: string
  location?: string
  description?: string
  employees_count?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface StructureFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  faculty_id?: string
  sort_by?: 'name' | 'code' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface StructureStats {
  faculties_count: number
  departments_count: number
  sections_count: number
  students_count: number
  teachers_count: number
  employees_count: number
}

