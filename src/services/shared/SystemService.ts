/**
 * System Service
 *
 * Handles system-wide configuration and settings.
 */

import { BaseApiService } from '../base/BaseApiService'

export interface SystemConfig {
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
    employee: {
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
 * System Service
 */
export class SystemService extends BaseApiService {
  constructor() {
    super('/system')
  }

  /**
   * Get login page configuration
   */
  async getLoginConfig(): Promise<SystemConfig> {
    return this.get<SystemConfig>('/login-config')
  }

  /**
   * Get system settings
   */
  async getSettings() {
    return this.get('/settings')
  }

  /**
   * Get available languages
   */
  async getLanguages() {
    return this.get('/languages')
  }

  /**
   * Get system health status
   */
  async getHealthStatus() {
    return this.get('/health')
  }
}

// Export singleton instance
export const systemService = new SystemService()
