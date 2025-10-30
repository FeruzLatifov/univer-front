import { apiClient } from './client'

/**
 * System API Service
 *
 * Get system configuration and settings
 */

export interface SystemLoginConfig {
  logo: string | null
  name: string
  description: string
}

export interface SystemLoginConfigResponse {
  logo: string | null
  name: string
  description: string
}

/**
 * Get system configuration for login page
 */
export const getLoginConfig = async (): Promise<SystemLoginConfig> => {
  const response = await apiClient.get<SystemLoginConfigResponse>('/system/login-config')
  return response.data
}
