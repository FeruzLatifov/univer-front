/**
 * API Configuration
 *
 * Centralized API configuration for the application.
 * All API-related URLs and settings should be imported from here.
 */

/**
 * Get the API base URL from environment variable or use default
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Get the API origin (protocol + host + port)
 * Used for non-API URLs like storage, websockets, etc.
 */
export const getApiOrigin = (): string => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    return new URL(baseUrl).origin
  } catch {
    return 'http://localhost:8000'
  }
}

/**
 * API Configuration object
 */
export const API_CONFIG = {
  /**
   * Base URL for API endpoints
   * @example 'http://localhost:8000/api'
   */
  baseURL: API_BASE_URL,

  /**
   * Request timeout in milliseconds
   */
  timeout: 30000,

  /**
   * Default headers for API requests
   */
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const

/**
 * Helper function to build API endpoint URLs
 * @param path - The endpoint path (e.g., '/v1/teacher/dashboard')
 * @returns Full URL
 */
export const buildApiUrl = (path: string): string => {
  const url = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${url}`
}

/**
 * Helper function to build storage URLs
 * @param path - The storage path (e.g., 'images/profile.jpg')
 * @returns Full storage URL
 */
export const buildStorageUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiOrigin()}/storage${cleanPath}`
}

/**
 * Helper function to build attachment download URLs
 * @param attachmentId - The attachment ID
 * @returns Full download URL
 */
export const buildAttachmentUrl = (attachmentId: string | number): string => {
  return `${API_BASE_URL}/attachments/${attachmentId}/download`
}
