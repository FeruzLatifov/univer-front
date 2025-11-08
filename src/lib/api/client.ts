import axios from 'axios'
import { API_CONFIG } from '@/config/api'
import { logger } from '@/utils/logger'

// Create axios instance with default config
export const apiClient = axios.create(API_CONFIG)

// Initialize language headers from persisted store (early)
try {
  if (typeof window !== 'undefined') {
    const persisted = localStorage.getItem('language-storage')
    if (persisted) {
      const parsed = JSON.parse(persisted)
      const locale = parsed?.state?.locale
      if (locale) {
        apiClient.defaults.headers.common['Accept-Language'] = locale
        apiClient.defaults.headers.common['X-Locale'] = locale
      }
    }
  }
} catch (error) {
  logger.warn('[API] Failed to initialize language headers', error)
}

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token from sessionStorage (more secure)
    const token = sessionStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Note: Language headers (X-Locale, Accept-Language) are set by languageStore
    // No need to add ?l= parameter here

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors and unwrapping Laravel format
apiClient.interceptors.response.use(
  (response) => {
    // Smart unwrap: Only unwrap Laravel {success: true, data: ...} format
    // This makes the API transparent - callers don't need to know about wrapping
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data && 'data' in response.data) {
        // Laravel format detected - unwrap it
        // But keep success status and meta accessible
        const unwrapped = response.data.data
        // Add success flag and meta to the unwrapped data if it's an object
        if (unwrapped && typeof unwrapped === 'object' && !Array.isArray(unwrapped)) {
          unwrapped._success = response.data.success
          unwrapped._message = response.data.message
          // Preserve meta field if it exists
          if (response.data.meta) {
            unwrapped._meta = response.data.meta
          }
        }
        response.data = unwrapped
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = sessionStorage.getItem('refresh_token')

      // If no refresh token, immediately redirect to login
      if (!refreshToken) {
        logger.info('[API] 401 error: No refresh token, redirecting to login')
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Try to refresh the token
      try {
        const userType = sessionStorage.getItem('user_type') || 'student'
        logger.info('[API] 401 error: Attempting token refresh', {
          userType,
          hasRefreshToken: !!refreshToken,
        })

        // JWT refresh requires token in Authorization header
        const response = await axios.post(
          `${API_CONFIG.baseURL}/v1/${userType}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          }
        )

        logger.debug('[API] Refresh response received')

        const newToken = response.data?.data?.access_token || response.data?.access_token

        if (!newToken) {
          logger.error('[API] No access_token in refresh response')
          throw new Error('No access_token in response')
        }

        sessionStorage.setItem('access_token', newToken)
        logger.info('[API] Token refreshed successfully')

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        const isAxios = axios.isAxiosError(refreshError)
        const message = isAxios
          ? refreshError.message
          : refreshError instanceof Error
            ? refreshError.message
            : 'Unknown error'
        const status = isAxios ? refreshError.response?.status : undefined

        // Refresh failed, logout user and redirect to login
        logger.error('[API] Token refresh failed', {
          error: message,
          status,
        })
        logger.info('[API] Redirecting to login...')

        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        sessionStorage.removeItem('user_type')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle Laravel error format
    if (error.response?.data) {
      const errorData = error.response.data

      // Extract error message from Laravel format
      if (errorData.message) {
        error.message = errorData.message
      }

      // Extract validation errors
      if (errorData.errors) {
        error.validationErrors = errorData.errors
      }

      // Log API errors to console (except 401 - already logged above)
      if (error.response.status !== 401) {
        logger.error('[API] Request failed', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          message: error.message,
        })
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

// Export as both 'apiClient' and 'api' for compatibility
export const api = apiClient
