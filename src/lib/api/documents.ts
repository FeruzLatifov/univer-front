/**
 * Documents API Client
 *
 * Handles document signing workflow API calls
 * Based on Yii2 implementation
 */

import { apiClient } from './client'
import type { DocumentDetail } from '@/services/employee/DocumentService'

// ============================================
// TYPES
// ============================================

export interface DocumentSignerItem {
  id: number
  document: {
    hash: string
    title: string
    type: string
    type_label: string
    document_id: number
    status: string
  }
  signer_type: 'reviewer' | 'approver'
  signer_type_label: string
  employee_position: string
  department: string
  status: 'pending' | 'signed'
  status_label: string
  signed_at: string | null
  signed_at_human: string | null
  created_at: string
  created_at_human: string
}

export interface DocumentsResponse {
  success: boolean
  data: DocumentSignerItem[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number
    to: number
  }
  filters: {
    available_statuses: Array<{ value: string; label: string }>
    available_types: Array<{ value: string; label: string }>
    available_signer_types: Array<{ value: string; label: string }>
  }
}

export interface DocumentStatsResponse {
  success: boolean
  data: {
    total: number
    pending: number
    signed: number
    rejected: number
    today: number
    this_week: number
    this_month: number
  }
}

export interface DocumentsFilters {
  page?: number
  per_page?: number
  search?: string
  status?: string
  document_type?: string
  signer_type?: string
  date_from?: string
  date_to?: string
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get paginated list of documents for employee to sign
 */
export const getDocuments = async (filters?: DocumentsFilters): Promise<DocumentsResponse> => {
  const response = await apiClient.get<DocumentsResponse>('/v1/employee/documents/sign', {
    params: filters,
  })
  return response.data
}

/**
 * Get document by ID
 */
export const getDocument = async (id: number): Promise<{ success: boolean; data: DocumentDetail }> => {
  const response = await apiClient.get(`/v1/employee/documents/${id}`)
  return response.data
}

/**
 * Get dashboard statistics
 */
export const getDocumentStats = async (): Promise<DocumentStatsResponse> => {
  const response = await apiClient.get('/v1/employee/documents/stats')
  return response.data
}

/**
 * Export documents to Excel (future feature)
 */
export const exportDocuments = async (filters?: DocumentsFilters): Promise<Blob> => {
  const response = await apiClient.get('/v1/employee/documents/export', {
    params: filters,
    responseType: 'blob',
  })
  return response.data
}
