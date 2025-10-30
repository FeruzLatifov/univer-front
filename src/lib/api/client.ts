import axios from 'axios'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token and language parameter
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token from sessionStorage (more secure)
    const token = sessionStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add language parameter (Yii2 compatible: ?l=ru-RU)
    // Language can stay in localStorage (not sensitive data)
    const apiLocale = localStorage.getItem('api_locale') || 'uz-UZ'
    if (!config.params) {
      config.params = {}
    }
    config.params.l = apiLocale

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors and unwrapping Laravel format
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap Laravel {success: true, data: ...} format
    // This makes Laravel API compatible with existing Yii2 frontend code
    if (response.data && typeof response.data === 'object') {
      if ('success' in response.data && 'data' in response.data) {
        // Extract the actual data from the wrapper
        response.data = response.data.data
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
