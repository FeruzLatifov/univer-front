import { BaseApiService } from '../base/BaseApiService'

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

export interface CreateResourcePayload {
  subject_id: number
  title: string
  description?: string
  resource_type: string
  file?: File
  url?: string
}

export interface UpdateResourcePayload {
  title?: string
  description?: string
  url?: string
}

// ==================== SERVICE ====================

/**
 * Teacher Resource Service
 * Manages subject learning resources
 */
export class ResourceService extends BaseApiService {
  constructor() {
    super('/v1/teacher/subjects')
  }

  /**
   * Get all resources for a subject
   */
  async getSubjectResources(subjectId: number) {
    return this.get<Resource[]>(`/${subjectId}/resources`)
  }

  /**
   * Upload new resource (file or link)
   */
  async uploadResource(payload: CreateResourcePayload) {
    const formData = new FormData()
    formData.append('subject_id', payload.subject_id.toString())
    formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)
    formData.append('resource_type', payload.resource_type)
    if (payload.file) formData.append('file', payload.file)
    if (payload.url) formData.append('url', payload.url)

    return this.post<Resource>(`/${payload.subject_id}/resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  /**
   * Update resource metadata
   */
  async updateResource(resourceId: number, payload: UpdateResourcePayload) {
    // Note: resource updates are at /v1/teacher/resources/{id}
    const response = await this.client.put(`/v1/teacher/resources/${resourceId}`, payload)
    return this.unwrapResponse(response)
  }

  /**
   * Delete resource
   */
  async deleteResource(resourceId: number) {
    // Note: resource deletion is at /v1/teacher/resources/{id}
    const response = await this.client.delete(`/v1/teacher/resources/${resourceId}`)
    return this.unwrapResponse(response)
  }

  /**
   * Download resource file
   */
  async downloadResource(resourceId: number) {
    // Note: resource download is at /v1/teacher/resources/{id}/download
    const response = await this.client.get(`/v1/teacher/resources/${resourceId}/download`, {
      responseType: 'blob',
    })

    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `resource-${resourceId}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  /**
   * Get available resource types
   */
  async getResourceTypes() {
    const response = await this.client.get('/v1/teacher/resources/types')
    return this.unwrapResponse(response)
  }
}

// Export singleton instance
export const teacherResourceService = new ResourceService()
