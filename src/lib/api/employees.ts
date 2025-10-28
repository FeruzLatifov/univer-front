import { apiClient } from './client'
import type {
  Employee,
  Teacher,
  TeacherWorkload,
  AcademicDegree,
  AcademicRank,
  ProfessionalDevelopment,
  ForeignTraining,
  TutorGroup,
  EmployeeFilters,
  EmployeeStats,
  WorkloadFilters,
} from '@/lib/types/employee'
import {
  mockEmployees,
  mockTeacherWorkloads,
  mockAcademicDegrees,
  mockAcademicRanks,
  mockEmployeeStats,
} from '@/lib/mockData/employees'

const USE_MOCK = true

export const employeesApi = {
  // Employees
  getEmployees: async (filters?: EmployeeFilters): Promise<Employee[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockEmployees]
          
          if (filters?.search) {
            result = result.filter(e =>
              e.full_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
              e.employee_id_number.toLowerCase().includes(filters.search!.toLowerCase())
            )
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(e => e.status === filters.status)
          }
          if (filters?.is_teacher !== undefined) {
            result = result.filter(e => e.is_teacher === filters.is_teacher)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<Employee[]>('/employees', { params: filters })
    return response.data
  },

  getEmployee: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<Employee>(`/employees/${id}`)
    return response.data
  },

  createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/employees', data)
    return response.data
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await apiClient.put<Employee>(`/employees/${id}`, data)
    return response.data
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`)
  },

  // Teachers
  getTeachers: async (filters?: EmployeeFilters): Promise<Teacher[]> => {
    const response = await apiClient.get<Teacher[]>('/employees/teachers', { params: filters })
    return response.data
  },

  getTeacher: async (id: string): Promise<Teacher> => {
    const response = await apiClient.get<Teacher>(`/employees/teachers/${id}`)
    return response.data
  },

  // Teacher Workload
  getWorkloads: async (filters?: WorkloadFilters): Promise<TeacherWorkload[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockTeacherWorkloads]
          
          if (filters?.academic_year) {
            result = result.filter(w => w.academic_year === filters.academic_year)
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(w => w.status === filters.status)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<TeacherWorkload[]>('/employees/workloads', { params: filters })
    return response.data
  },

  getTeacherWorkload: async (teacherId: string, academicYear: string): Promise<TeacherWorkload> => {
    const response = await apiClient.get<TeacherWorkload>(`/employees/teachers/${teacherId}/workload`, {
      params: { academic_year: academicYear },
    })
    return response.data
  },

  updateWorkload: async (teacherId: string, data: Partial<TeacherWorkload>): Promise<TeacherWorkload> => {
    const response = await apiClient.put<TeacherWorkload>(`/employees/teachers/${teacherId}/workload`, data)
    return response.data
  },

  approveWorkload: async (teacherId: string, academicYear: string): Promise<TeacherWorkload> => {
    const response = await apiClient.post<TeacherWorkload>(`/employees/teachers/${teacherId}/workload/approve`, {
      academic_year: academicYear,
    })
    return response.data
  },

  // Academic Degrees
  getAcademicDegrees: async (): Promise<AcademicDegree[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockAcademicDegrees), 300))
    }
    const response = await apiClient.get<AcademicDegree[]>('/employees/academic-degrees')
    return response.data
  },

  createAcademicDegree: async (data: Partial<AcademicDegree>): Promise<AcademicDegree> => {
    const response = await apiClient.post<AcademicDegree>('/employees/academic-degrees', data)
    return response.data
  },

  // Academic Ranks
  getAcademicRanks: async (): Promise<AcademicRank[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockAcademicRanks), 300))
    }
    const response = await apiClient.get<AcademicRank[]>('/employees/academic-ranks')
    return response.data
  },

  // Professional Development
  getProfessionalDevelopments: async (employeeId?: string): Promise<ProfessionalDevelopment[]> => {
    const response = await apiClient.get<ProfessionalDevelopment[]>('/employees/professional-development', {
      params: employeeId ? { employee_id: employeeId } : undefined,
    })
    return response.data
  },

  createProfessionalDevelopment: async (
    data: Partial<ProfessionalDevelopment>
  ): Promise<ProfessionalDevelopment> => {
    const response = await apiClient.post<ProfessionalDevelopment>('/employees/professional-development', data)
    return response.data
  },

  // Foreign Training
  getForeignTrainings: async (employeeId?: string): Promise<ForeignTraining[]> => {
    const response = await apiClient.get<ForeignTraining[]>('/employees/foreign-trainings', {
      params: employeeId ? { employee_id: employeeId } : undefined,
    })
    return response.data
  },

  createForeignTraining: async (data: Partial<ForeignTraining>): Promise<ForeignTraining> => {
    const response = await apiClient.post<ForeignTraining>('/employees/foreign-trainings', data)
    return response.data
  },

  // Tutor Groups
  getTutorGroups: async (teacherId?: string): Promise<TutorGroup[]> => {
    const response = await apiClient.get<TutorGroup[]>('/employees/tutor-groups', {
      params: teacherId ? { teacher_id: teacherId } : undefined,
    })
    return response.data
  },

  assignTutorGroup: async (data: Partial<TutorGroup>): Promise<TutorGroup> => {
    const response = await apiClient.post<TutorGroup>('/employees/tutor-groups', data)
    return response.data
  },

  removeTutorGroup: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/tutor-groups/${id}`)
  },

  // Statistics
  getStats: async (): Promise<EmployeeStats> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockEmployeeStats), 300))
    }
    const response = await apiClient.get<EmployeeStats>('/employees/stats')
    return response.data
  },
}

