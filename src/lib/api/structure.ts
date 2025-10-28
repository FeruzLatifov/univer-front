import { apiClient } from './client'
import type {
  University,
  Faculty,
  Department,
  Section,
  StructureFilters,
  StructureStats,
} from '@/lib/types/structure'
import { mockUniversity, mockFaculties, mockDepartments, mockStructureStats } from '@/lib/mockData/structure'

// Mock mode for development (backend mavjud bo'lguncha)
const USE_MOCK = true

export const structureApi = {
  // University
  getUniversity: async (): Promise<University> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockUniversity), 300))
    }
    const response = await apiClient.get<University>('/structure/university')
    return response.data
  },

  updateUniversity: async (data: Partial<University>): Promise<University> => {
    const response = await apiClient.put<University>('/structure/university', data)
    return response.data
  },

  // Faculties
  getFaculties: async (filters?: StructureFilters): Promise<Faculty[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockFaculties]
          
          // Apply filters
          if (filters?.search) {
            result = result.filter(f => 
              f.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
              f.code.toLowerCase().includes(filters.search!.toLowerCase())
            )
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(f => f.status === filters.status)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<Faculty[]>('/structure/faculties', { params: filters })
    return response.data
  },

  getFaculty: async (id: string): Promise<Faculty> => {
    const response = await apiClient.get<Faculty>(`/structure/faculties/${id}`)
    return response.data
  },

  createFaculty: async (data: Partial<Faculty>): Promise<Faculty> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newFaculty: Faculty = {
            id: Date.now().toString(),
            code: data.code || '',
            name: data.name || '',
            name_uz: data.name || '',
            name_ru: data.name || '',
            name_en: data.name || '',
            short_name: data.short_name,
            university_id: '1',
            dean_name: data.dean_name,
            dean_phone: data.dean_phone,
            dean_email: data.dean_email,
            location: data.location,
            students_count: 0,
            teachers_count: 0,
            departments_count: 0,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          mockFaculties.push(newFaculty)
          resolve(newFaculty)
        }, 500)
      })
    }
    const response = await apiClient.post<Faculty>('/structure/faculties', data)
    return response.data
  },

  updateFaculty: async (id: string, data: Partial<Faculty>): Promise<Faculty> => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockFaculties.findIndex(f => f.id === id)
          if (index !== -1) {
            mockFaculties[index] = { ...mockFaculties[index], ...data, updated_at: new Date().toISOString() }
            resolve(mockFaculties[index])
          } else {
            reject(new Error('Faculty not found'))
          }
        }, 500)
      })
    }
    const response = await apiClient.put<Faculty>(`/structure/faculties/${id}`, data)
    return response.data
  },

  deleteFaculty: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockFaculties.findIndex(f => f.id === id)
          if (index !== -1) {
            mockFaculties.splice(index, 1)
          }
          resolve()
        }, 500)
      })
    }
    await apiClient.delete(`/structure/faculties/${id}`)
  },

  // Departments
  getDepartments: async (filters?: StructureFilters): Promise<Department[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockDepartments]
          
          // Apply filters
          if (filters?.search) {
            result = result.filter(d => 
              d.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
              d.code.toLowerCase().includes(filters.search!.toLowerCase())
            )
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(d => d.status === filters.status)
          }
          if (filters?.faculty_id) {
            result = result.filter(d => d.faculty_id === filters.faculty_id)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<Department[]>('/structure/departments', { params: filters })
    return response.data
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await apiClient.get<Department>(`/structure/departments/${id}`)
    return response.data
  },

  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const faculty = mockFaculties.find(f => f.id === data.faculty_id)
          const newDepartment: Department = {
            id: Date.now().toString(),
            code: data.code || '',
            name: data.name || '',
            name_uz: data.name || '',
            name_ru: data.name || '',
            name_en: data.name || '',
            short_name: data.short_name,
            faculty_id: data.faculty_id || '',
            faculty_name: faculty?.name,
            head_name: data.head_name,
            head_phone: data.head_phone,
            head_email: data.head_email,
            location: data.location,
            teachers_count: 0,
            subjects_count: 0,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          mockDepartments.push(newDepartment)
          resolve(newDepartment)
        }, 500)
      })
    }
    const response = await apiClient.post<Department>('/structure/departments', data)
    return response.data
  },

  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = mockDepartments.findIndex(d => d.id === id)
          if (index !== -1) {
            const faculty = mockFaculties.find(f => f.id === (data.faculty_id || mockDepartments[index].faculty_id))
            mockDepartments[index] = {
              ...mockDepartments[index],
              ...data,
              faculty_name: faculty?.name,
              updated_at: new Date().toISOString()
            }
            resolve(mockDepartments[index])
          } else {
            reject(new Error('Department not found'))
          }
        }, 500)
      })
    }
    const response = await apiClient.put<Department>(`/structure/departments/${id}`, data)
    return response.data
  },

  deleteDepartment: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockDepartments.findIndex(d => d.id === id)
          if (index !== -1) {
            mockDepartments.splice(index, 1)
          }
          resolve()
        }, 500)
      })
    }
    await apiClient.delete(`/structure/departments/${id}`)
  },

  // Sections
  getSections: async (filters?: StructureFilters): Promise<Section[]> => {
    const response = await apiClient.get<Section[]>('/structure/sections', { params: filters })
    return response.data
  },

  getSection: async (id: string): Promise<Section> => {
    const response = await apiClient.get<Section>(`/structure/sections/${id}`)
    return response.data
  },

  createSection: async (data: Partial<Section>): Promise<Section> => {
    const response = await apiClient.post<Section>('/structure/sections', data)
    return response.data
  },

  updateSection: async (id: string, data: Partial<Section>): Promise<Section> => {
    const response = await apiClient.put<Section>(`/structure/sections/${id}`, data)
    return response.data
  },

  deleteSection: async (id: string): Promise<void> => {
    await apiClient.delete(`/structure/sections/${id}`)
  },

  // Statistics
  getStats: async (): Promise<StructureStats> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockStructureStats), 300))
    }
    const response = await apiClient.get<StructureStats>('/structure/stats')
    return response.data
  },
}

