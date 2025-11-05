/**
 * Employee Document Service
 *
 * Handles e-document signing for employees.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface DocumentSigner {
  id: number
  document_hash: string
  document_title: string
  document_type: string
  status: 'pending' | 'signed'
  type: 'reviewer' | 'approver'
  priority: number
  employee_name: string
  employee_position: string
  signed_at?: string
  created_at: string
}

export interface DocumentDetail {
  id: number
  hash: string
  document_title: string
  document_type: string
  status: 'pending' | 'signed' | 'rejected'
  provider: 'webimzo' | 'eduimzo' | 'local'
  signers: DocumentSignerDetail[]
  created_at: string
}

export interface DocumentSignerDetail {
  id: number
  employee_name: string
  employee_position: string
  type: 'reviewer' | 'approver'
  priority: number
  status: 'pending' | 'signed'
  signed_at?: string
}

export interface DocumentStatus {
  status: string
  can_sign: boolean
  already_signed: boolean
  provider: string
  signed_count: number
  total_signers: number
}

export interface DocumentListFilters {
  search?: string
  status?: 'pending' | 'signed'
  type?: 'reviewer' | 'approver'
  document_type?: string
  date_from?: string
  date_to?: string
  per_page?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

/**
 * Employee Document Service
 */
export class EmployeeDocumentService extends BaseApiService {
  constructor() {
    super('/v1/employee/documents')
  }

  /**
   * Get documents to sign with pagination
   */
  async getDocumentsToSign(
    filters?: DocumentListFilters
  ): Promise<PaginatedResponse<DocumentSigner>> {
    const query = filters ? this.buildQueryString(filters) : ''
    // Axios interceptor unwraps { success, data } → data
    const data = await this.get<PaginatedResponse<DocumentSigner>>(`/sign${query}`)
    return data
  }

  /**
   * Get document details by hash
   */
  async getDocumentByHash(hash: string): Promise<DocumentDetail> {
    // Interceptor unwraps Laravel format
    const data = await this.get<DocumentDetail>(`/${hash}/view`)
    return data
  }

  /**
   * Sign a document
   */
  async signDocument(hash: string): Promise<{ redirect_url?: string; message?: string }> {
    // Interceptor will unwrap to { redirect_url }
    return this.post<{ redirect_url?: string; message?: string }>(`/${hash}/sign`)
  }

  /**
   * Get document sign status
   */
  async getDocumentStatus(hash: string): Promise<DocumentStatus> {
    const data = await this.get<DocumentStatus>(`/${hash}/status`)
    return data
  }
}

// Export singleton instance
export const employeeDocumentService = new EmployeeDocumentService()
