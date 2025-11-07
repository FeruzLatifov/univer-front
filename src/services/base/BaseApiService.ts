/**
 * Base API Service
 *
 * Base class for all API services providing common functionality.
 * Follows the same pattern as Laravel backend service layer.
 */

import { apiClient } from '@/lib/api/client'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Base class for all API services
 *
 * Provides common CRUD operations and API interaction methods.
 * All service classes should extend this base class.
 */
export class BaseApiService {
  /**
   * Base API path for this service (e.g., '/v1/teacher/dashboard')
   */
  protected basePath: string
  protected client = apiClient

  constructor(basePath: string) {
    this.basePath = basePath
  }

  /**
   * Build full URL path
   */
  protected buildPath(path: string = ''): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return cleanPath ? `${this.basePath}/${cleanPath}` : this.basePath
  }

  /**
   * Generic GET request
   */
  protected async get<T = any>(
    path: string = '',
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.get<T>(this.buildPath(path), config)
    return response.data
  }

  /**
   * Generic POST request
   */
  protected async post<T = any>(
    path: string = '',
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<T>(this.buildPath(path), data, config)
    return response.data
  }

  /**
   * Generic PUT request
   */
  protected async put<T = any>(
    path: string = '',
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<T>(this.buildPath(path), data, config)
    return response.data
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T = any>(
    path: string = '',
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.patch<T>(this.buildPath(path), data, config)
    return response.data
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T = any>(
    path: string = '',
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.delete<T>(this.buildPath(path), config)
    return response.data
  }

  /**
   * Some endpoints still rely on the raw Axios client.
   * Provide a helper to keep typings consistent when we bypass the helpers.
   */
  protected unwrapResponse<T>(response: AxiosResponse<T>): T {
    return response.data
  }

  /**
   * Build query string from params object
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }
}
