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
  universityCode: string | null
  appVersion: string
  loginTypes?: {
    student: { label: string, enabled: boolean }
    staff: { label: string, enabled: boolean }
  }
}

export interface SystemLoginConfigBackendResponse {
  university_code: string | null
  university_name: string
  university_short_name: string
  university_logo: string
  favicon: string
  system_name: string
  app_version: string
  login_types: {
    student: {
      enabled: boolean
      label: string
      icon: string
      endpoint: string
    }
    staff: {
      enabled: boolean
      label: string
      icon: string
      endpoint: string
    }
  }
  available_languages: Array<{
    code: string
    name: string
    flag: string
    active: boolean
  }>
  default_language: string
  theme: {
    primary_color: string
    secondary_color: string
  }
  features: {
    registration_enabled: boolean
    password_reset_enabled: boolean
    remember_me_enabled: boolean
  }
  contact: {
    email: string
    phone: string
    address: string
  }
}

/**
 * Get system configuration for login page
 */
export const getLoginConfig = async (): Promise<SystemLoginConfig> => {
  const response = await apiClient.get<SystemLoginConfigBackendResponse>('/system/login-config')
  const data = response.data

  // Map backend response to frontend format
  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api'
  const origin = (() => {
    try { return new URL(apiUrl).origin } catch { return 'http://localhost:8080' }
  })()

  let logo = data.university_logo || data.favicon || '/images/hemis-logo.png'
  if (logo && logo.startsWith('/')) {
    logo = origin + logo
  }

  return {
    logo,
    name: data.university_short_name || data.university_name || 'HEMIS Universitet axborot tizimi',
    description: data.system_name || 'HEMIS Universitet axborot tizimi',
    universityCode: data.university_code || null,
    appVersion: data.app_version || '2.0.0',
    loginTypes: data.login_types ? {
      student: { label: data.login_types.student?.label || 'Talaba', enabled: !!data.login_types.student?.enabled },
      staff: { label: data.login_types.staff?.label || 'Xodim', enabled: !!data.login_types.staff?.enabled },
    } : undefined
  }
}
