import { api } from './client'

// ==================== TYPES ====================

export interface Resource {
  id: number
  subject_id: number
  title: string
  description?: string
  resource_type: string // "file", "url", "video", "document"
  file_path?: string
  file_name?: string
  file_size?: number
  url?: string
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface ResourcesResponse {
  success: boolean
  data: Resource[]
}

export interface ResourceResponse {
  success: boolean
  data: Resource
  message?: string
}

export interface CreateResourcePayload {
  subject_id: number
  title: string
  description?: string
  resource_type: string
  file?: File
  url?: string
}

// ==================== API FUNCTIONS ====================

export const getSubjectResources = async (subjectId: number): Promise<ResourcesResponse> => {
  const response = await api.get(`/subject/${subjectId}/resources`)
  return response.data
}

export const uploadResource = async (payload: CreateResourcePayload): Promise<ResourceResponse> => {
  const formData = new FormData()
  formData.append('subject_id', payload.subject_id.toString())
  formData.append('title', payload.title)
  if (payload.description) formData.append('description', payload.description)
  formData.append('resource_type', payload.resource_type)
  if (payload.file) formData.append('file', payload.file)
  if (payload.url) formData.append('url', payload.url)

  const response = await api.post(`/subject/${payload.subject_id}/resource`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const deleteResource = async (resourceId: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/resource/${resourceId}`)
  return response.data
}

export const downloadResource = async (resourceId: number): Promise<Blob> => {
  const response = await api.get(`/resource/${resourceId}/download`, {
    responseType: 'blob',
  })
  return response.data
}
