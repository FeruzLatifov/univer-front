import { api } from './client'

// ==================== TYPES ====================

export interface ScheduleLesson {
  id: number
  subject_name: string
  subject_name_uz: string
  subject_name_ru: string
  subject_name_en: string
  subject_code: string
  group_name: string
  group_name_uz: string
  group_name_ru: string
  group_name_en: string
  room_name: string
  lesson_pair: number // 1, 2, 3, 4...
  lesson_date: string
  week_day: number // 1-7 (Monday-Sunday)
  start_time: string // "09:00"
  end_time: string // "10:30"
  training_type: string // "Ma'ruza", "Amaliy", "Laboratoriya"
  building_name?: string
  students_count?: number
  attendance_marked?: boolean
  conducted?: boolean
}

export interface WeeklySchedule {
  [key: string]: ScheduleLesson[] // "1": [...], "2": [...]
}

export interface ScheduleResponse {
  success: boolean
  data: WeeklySchedule
}

export interface DayScheduleResponse {
  success: boolean
  data: ScheduleLesson[]
}

export interface WorkloadData {
  total_hours: number
  total_groups: number
  total_students: number
  subjects_count: number
  by_subject: {
    subject_name: string
    hours: number
    groups: number
  }[]
  by_week_day: {
    day: number
    day_name: string
    lessons: number
    hours: number
  }[]
}

export interface WorkloadResponse {
  success: boolean
  data: WorkloadData
}

export interface GroupInfo {
  id: number
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  students_count: number
  specialty_name?: string
  course: number
}

export interface GroupsResponse {
  success: boolean
  data: GroupInfo[]
}

// ==================== API FUNCTIONS ====================

/**
 * Get teacher's weekly schedule
 */
export const getTeacherSchedule = async (): Promise<ScheduleResponse> => {
  const response = await api.get('/teacher/schedule')
  return response.data
}

/**
 * Get teacher's schedule for specific day
 */
export const getDaySchedule = async (day: number): Promise<DayScheduleResponse> => {
  const response = await api.get(`/teacher/schedule/day/${day}`)
  return response.data
}

/**
 * Get teacher's workload statistics
 */
export const getTeacherWorkload = async (): Promise<WorkloadResponse> => {
  const response = await api.get('/teacher/workload')
  return response.data
}

/**
 * Get teacher's groups
 */
export const getTeacherGroups = async (): Promise<GroupsResponse> => {
  const response = await api.get('/teacher/groups')
  return response.data
}

// ==================== CONSTANTS ====================

export const WEEK_DAYS = [
  { id: 1, name: 'Dushanba', short: 'Dush' },
  { id: 2, name: 'Seshanba', short: 'Sesh' },
  { id: 3, name: 'Chorshanba', short: 'Chor' },
  { id: 4, name: 'Payshanba', short: 'Pay' },
  { id: 5, name: 'Juma', short: 'Jum' },
  { id: 6, name: 'Shanba', short: 'Shan' },
  { id: 7, name: 'Yakshanba', short: 'Yak' },
]

export const LESSON_PAIRS = [
  { pair: 1, start: '08:30', end: '10:00' },
  { pair: 2, start: '10:10', end: '11:40' },
  { pair: 3, start: '11:50', end: '13:20' },
  { pair: 4, start: '13:30', end: '15:00' },
  { pair: 5, start: '15:10', end: '16:40' },
  { pair: 6, start: '16:50', end: '18:20' },
]

export const TRAINING_TYPES: { [key: string]: { label: string; color: string } } = {
  "Ma'ruza": { label: "Ma'ruza", color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  "Amaliy": { label: "Amaliy", color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
  "Laboratoriya": { label: "Laboratoriya", color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  "Seminar": { label: "Seminar", color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
}
