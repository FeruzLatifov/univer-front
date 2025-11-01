import axios from 'axios'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
} catch (_) {}

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
        // But keep success status accessible
        const unwrapped = response.data.data
        // Add success flag to the unwrapped data if it's an object
        if (unwrapped && typeof unwrapped === 'object' && !Array.isArray(unwrapped)) {
          unwrapped._success = response.data.success
          unwrapped._message = response.data.message
        }
        response.data = unwrapped
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = sessionStorage.getItem('refresh_token')
        const userType = sessionStorage.getItem('user_type') || 'student'
        if (refreshToken) {
          // Try to refresh the token (Laravel format)
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/${userType}/auth/refresh`,
            { refresh_token: refreshToken }
          )

          const { access_token } = response.data
          sessionStorage.setItem('access_token', access_token)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
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
    }

  // Handle other errors
  return Promise.reject(error)
  }
)

// Export as both 'apiClient' and 'api' for compatibility
export const api = apiClient
