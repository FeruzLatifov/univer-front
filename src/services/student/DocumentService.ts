/**
 * Student Document Service
 *
 * Handles student document requests and downloads.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface DocumentRequest {
  id: number
  document_type: string
  document_name: string
  status: 'pending' | 'approved' | 'rejected' | 'ready' | 'issued'
  request_date: string
  approval_date?: string
  ready_date?: string
  issued_date?: string
  quantity: number
  notes?: string
  rejection_reason?: string
  file_path?: string
}

export interface AvailableDocument {
  code: string
  name: string
  description: string
  processing_days: number
  requires_approval: boolean
  fee: number
}

/**
 * Student Document Service
 */
export class StudentDocumentService extends BaseApiService {
  constructor() {
    super('/v1/student/documents')
  }

  /**
   * Get student's document requests
   */
  async getDocumentRequests(filters?: {
    status?: string
    document_type?: string
  }): Promise<DocumentRequest[]> {
    const query = filters ? this.buildQueryString(filters) : ''
    return this.get<DocumentRequest[]>(query)
  }

  /**
   * Get single document request
   */
  async getDocumentRequest(id: number): Promise<DocumentRequest> {
    return this.get<DocumentRequest>(`/${id}`)
  }

  /**
   * Get available document types
   */
  async getAvailableDocuments(): Promise<AvailableDocument[]> {
    return this.get<AvailableDocument[]>('/available')
  }

  /**
   * Request a new document
   */
  async requestDocument(data: {
    document_type: string
    quantity?: number
    notes?: string
  }) {
    return this.post('', data)
  }

  /**
   * Cancel document request
   */
  async cancelRequest(id: number) {
    return this.delete(`/${id}`)
  }

  /**
   * Download document file
   */
  async downloadDocument(id: number): Promise<Blob> {
    const response = await this.get<Blob>(`/${id}/download`, {
      responseType: 'blob'
    })
    return response
  }

  /**
   * Get academic transcript
   */
  async getTranscript(format: 'pdf' | 'json' = 'json') {
    if (format === 'pdf') {
      return this.get<Blob>('/transcript/pdf', { responseType: 'blob' })
    }
    return this.get('/transcript')
  }

  /**
   * Get certificate (diploma)
   */
  async getCertificate() {
    return this.get('/certificate')
  }
}

// Export singleton instance
export const studentDocumentService = new StudentDocumentService()
