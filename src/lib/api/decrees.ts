import { apiClient } from './client'
import type {
  Decree,
  DecreeTemplate,
  Transfer,
  Expulsion,
  AcademicLeave,
  Restore,
  Graduation,
  StudentStatus,
  DecreeFilters,
  TransferFilters,
  DecreeStats,
} from '@/lib/types/decree'
import { mockDecrees, mockTransfers, mockDecreeStats } from '@/lib/mockData/decrees'

const USE_MOCK = true

export const decreesApi = {
  // Decrees
  getDecrees: async (filters?: DecreeFilters): Promise<Decree[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockDecrees]
          
          if (filters?.search) {
            result = result.filter(d =>
              d.decree_number.toLowerCase().includes(filters.search!.toLowerCase()) ||
              d.title.toLowerCase().includes(filters.search!.toLowerCase())
            )
          }
          if (filters?.decree_type) {
            result = result.filter(d => d.decree_type === filters.decree_type)
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(d => d.status === filters.status)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<Decree[]>('/decrees', { params: filters })
    return response.data
  },

  getDecree: async (id: string): Promise<Decree> => {
    const response = await apiClient.get<Decree>(`/decrees/${id}`)
    return response.data
  },

  createDecree: async (data: Partial<Decree>): Promise<Decree> => {
    const response = await apiClient.post<Decree>('/decrees', data)
    return response.data
  },

  updateDecree: async (id: string, data: Partial<Decree>): Promise<Decree> => {
    const response = await apiClient.put<Decree>(`/decrees/${id}`, data)
    return response.data
  },

  deleteDecree: async (id: string): Promise<void> => {
    await apiClient.delete(`/decrees/${id}`)
  },

  approveDecree: async (id: string): Promise<Decree> => {
    const response = await apiClient.post<Decree>(`/decrees/${id}/approve`)
    return response.data
  },

  rejectDecree: async (id: string, reason: string): Promise<Decree> => {
    const response = await apiClient.post<Decree>(`/decrees/${id}/reject`, { reason })
    return response.data
  },

  // Decree Templates
  getTemplates: async (): Promise<DecreeTemplate[]> => {
    const response = await apiClient.get<DecreeTemplate[]>('/decrees/templates')
    return response.data
  },

  getTemplate: async (id: string): Promise<DecreeTemplate> => {
    const response = await apiClient.get<DecreeTemplate>(`/decrees/templates/${id}`)
    return response.data
  },

  createTemplate: async (data: Partial<DecreeTemplate>): Promise<DecreeTemplate> => {
    const response = await apiClient.post<DecreeTemplate>('/decrees/templates', data)
    return response.data
  },

  // Transfers
  getTransfers: async (filters?: TransferFilters): Promise<Transfer[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let result = [...mockTransfers]
          
          if (filters?.search) {
            result = result.filter(t =>
              t.student_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
              t.student_id_number.toLowerCase().includes(filters.search!.toLowerCase())
            )
          }
          if (filters?.transfer_type) {
            result = result.filter(t => t.transfer_type === filters.transfer_type)
          }
          if (filters?.status && filters.status !== 'all') {
            result = result.filter(t => t.status === filters.status)
          }
          
          resolve(result)
        }, 300)
      })
    }
    const response = await apiClient.get<Transfer[]>('/transfers', { params: filters })
    return response.data
  },

  getTransfer: async (id: string): Promise<Transfer> => {
    const response = await apiClient.get<Transfer>(`/transfers/${id}`)
    return response.data
  },

  createTransfer: async (data: Partial<Transfer>): Promise<Transfer> => {
    const response = await apiClient.post<Transfer>('/transfers', data)
    return response.data
  },

  approveTransfer: async (id: string): Promise<Transfer> => {
    const response = await apiClient.post<Transfer>(`/transfers/${id}/approve`)
    return response.data
  },

  rejectTransfer: async (id: string, reason: string): Promise<Transfer> => {
    const response = await apiClient.post<Transfer>(`/transfers/${id}/reject`, { reason })
    return response.data
  },

  // Expulsions
  getExpulsions: async (filters?: DecreeFilters): Promise<Expulsion[]> => {
    const response = await apiClient.get<Expulsion[]>('/expulsions', { params: filters })
    return response.data
  },

  createExpulsion: async (data: Partial<Expulsion>): Promise<Expulsion> => {
    const response = await apiClient.post<Expulsion>('/expulsions', data)
    return response.data
  },

  approveExpulsion: async (id: string): Promise<Expulsion> => {
    const response = await apiClient.post<Expulsion>(`/expulsions/${id}/approve`)
    return response.data
  },

  // Academic Leave
  getAcademicLeaves: async (filters?: DecreeFilters): Promise<AcademicLeave[]> => {
    const response = await apiClient.get<AcademicLeave[]>('/academic-leaves', { params: filters })
    return response.data
  },

  createAcademicLeave: async (data: Partial<AcademicLeave>): Promise<AcademicLeave> => {
    const response = await apiClient.post<AcademicLeave>('/academic-leaves', data)
    return response.data
  },

  approveAcademicLeave: async (id: string): Promise<AcademicLeave> => {
    const response = await apiClient.post<AcademicLeave>(`/academic-leaves/${id}/approve`)
    return response.data
  },

  returnFromLeave: async (id: string, actualReturnDate: string): Promise<AcademicLeave> => {
    const response = await apiClient.post<AcademicLeave>(`/academic-leaves/${id}/return`, {
      actual_return_date: actualReturnDate,
    })
    return response.data
  },

  // Restore
  getRestores: async (filters?: DecreeFilters): Promise<Restore[]> => {
    const response = await apiClient.get<Restore[]>('/restores', { params: filters })
    return response.data
  },

  createRestore: async (data: Partial<Restore>): Promise<Restore> => {
    const response = await apiClient.post<Restore>('/restores', data)
    return response.data
  },

  approveRestore: async (id: string): Promise<Restore> => {
    const response = await apiClient.post<Restore>(`/restores/${id}/approve`)
    return response.data
  },

  // Graduation
  getGraduations: async (filters?: DecreeFilters): Promise<Graduation[]> => {
    const response = await apiClient.get<Graduation[]>('/graduations', { params: filters })
    return response.data
  },

  createGraduation: async (data: Partial<Graduation>): Promise<Graduation> => {
    const response = await apiClient.post<Graduation>('/graduations', data)
    return response.data
  },

  approveGraduation: async (id: string): Promise<Graduation> => {
    const response = await apiClient.post<Graduation>(`/graduations/${id}/approve`)
    return response.data
  },

  // Student Status
  getStudentStatus: async (studentId: string): Promise<StudentStatus> => {
    const response = await apiClient.get<StudentStatus>(`/students/${studentId}/status`)
    return response.data
  },

  // Statistics
  getStats: async (): Promise<DecreeStats> => {
    if (USE_MOCK) {
      return new Promise((resolve) => setTimeout(() => resolve(mockDecreeStats), 300))
    }
    const response = await apiClient.get<DecreeStats>('/decrees/stats')
    return response.data
  },
}

