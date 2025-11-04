import { apiClient } from './client'

export interface SignItem {
  id: number
  hash: string
  title: string
  type: string
  created_at: string | null
  status: 'pending' | 'signed'
  can_sign: boolean
}

export interface SignList {
  items: SignItem[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export async function listDocumentsToSign(params: {
  status?: 'pending' | 'signed'
  q?: string
  type?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}): Promise<SignList> {
  const res = await apiClient.get('/v1/employee/documents/sign', { params })
  // Axios interceptor unwraps {success, data} → data
  return res.data as SignList
}

export async function getViewUrl(hash: string): Promise<string> {
  const res = await apiClient.get(`/v1/employee/documents/${hash}/view`)
  return res.data.view_url as string
}

export async function signDocument(hash: string): Promise<string> {
  const res = await apiClient.post(`/v1/employee/documents/${hash}/sign`)
  return res.data.redirect_url as string
}

export async function getStatus(hash: string): Promise<{ status: string; updated_at: string | null }> {
  const res = await apiClient.post(`/v1/employee/documents/${hash}/status`)
  return res.data as { status: string; updated_at: string | null }
}


