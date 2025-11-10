import { apiClient } from './client'

/**
 * Auth API Service
 *
 * Connects to Laravel backend authentication endpoints
 * Supports both employee and student authentication
 */

export interface LoginCredentials {
  login?: string        // For employee (admin, teacher, etc.)
  student_id?: string   // For students
  password: string
  userType: 'employee' | 'student'
}

export interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: number
      type: 'admin' | 'student'
      login?: string
      student_id_number?: string
      full_name: string
      email?: string
      phone?: string
      role?: string
      role_id?: number
      role_code?: string | null
      role_name?: string | null
      roles?: Array<{ id: number; code?: string | null; name: string }>
      active: boolean
      employee?: {
        id: number
        full_name: string
        department?: string
      }
      meta?: {
        student_status?: string
        education_type?: string
        specialty?: {
          code: string
          name: string
        }
        group?: {
          name: string
        }
      }
    }
    access_token: string
    token_type: string
    expires_in: number
  }
  message?: string
}

export interface RefreshResponse {
  success: boolean
  data: {
    access_token: string
    token_type: string
    expires_in: number
  }
}

export interface UserProfileResponse {
  success: boolean
  data: AuthResponse['data']['user']
}

/**
 * Employee Login
 */
export const employeeLogin = async (login: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/employee/auth/login', {
    login,
    password,
  })
  
  // Interceptor already unwrapped {success, data} → data
  // response.data now contains: { user, access_token, token_type, expires_in, _success, _message }
  const data = response.data
  
  return {
    success: data._success !== undefined ? data._success : true,
    data: {
      user: data.user,
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in || 3600,
    },
    message: data._message
  }
}


/**
 * Student Login
 */
export const studentLogin = async (studentId: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/student/auth/login', {
    student_id: studentId,
    password,
  })
  
  // Interceptor already unwrapped {success, data} → data
  const data = response.data
  
  return {
    success: data._success !== undefined ? data._success : true,
    data: {
      user: data.user,
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in || 3600,
    },
    message: data._message
  }
}

/**
 * Universal Login (determines user type automatically)
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (credentials.userType === 'employee' && credentials.login) {
    return employeeLogin(credentials.login, credentials.password)
  } else if (credentials.userType === 'student' && credentials.student_id) {
    return studentLogin(credentials.student_id, credentials.password)
  } else {
    throw new Error('Invalid credentials: missing login or student_id')
  }
}

/**
 * Employee Logout
 */
export const employeeLogout = async (): Promise<void> => {
  await apiClient.post('/v1/employee/auth/logout')
}


/**
 * Student Logout
 */
export const studentLogout = async (): Promise<void> => {
  await apiClient.post('/v1/student/auth/logout')
}

/**
 * Logout (universal)
 */
export const logout = async (userType: 'employee' | 'student'): Promise<void> => {
  if (userType === 'employee') {
    await employeeLogout()
  } else {
    await studentLogout()
  }
}

/**
 * Refresh Token (Employee)
 */
export const employeeRefreshToken = async (): Promise<RefreshResponse> => {
  const response = await apiClient.post('/v1/employee/auth/refresh')
  // Interceptor unwraps {success, data} → data
  return {
    success: response.data._success ?? true,
    data: response.data
  }
}


/**
 * Refresh Token (Student)
 */
export const studentRefreshToken = async (): Promise<RefreshResponse> => {
  const response = await apiClient.post('/v1/student/auth/refresh')
  // Interceptor unwraps {success, data} → data
  return {
    success: response.data._success ?? true,
    data: response.data
  }
}

/**
 * Get Current User (Employee)
 */
export const getEmployeeProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get('/v1/employee/auth/me')
  // Interceptor unwraps {success, data} → data
  return {
    success: response.data._success ?? true,
    data: response.data
  }
}


/**
 * Get Current User (Student)
 */
export const getStudentProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get('/v1/student/auth/me')
  // Interceptor unwraps {success, data} → data
  return {
    success: response.data._success ?? true,
    data: response.data
  }
}

/**
 * Get Current User Profile (universal)
 */
export const getCurrentUser = async (userType: 'employee' | 'student'): Promise<UserProfileResponse> => {
  if (userType === 'employee') {
    return getEmployeeProfile()
  } else {
    return getStudentProfile()
  }
}

/**
 * Switch active role (Employee)
 */
export const switchEmployeeRole = async (role: number): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/employee/auth/role/switch', { role })
  return {
    success: response.data._success ?? true,
    data: response.data,
    message: response.data._message
  }
}


/**
 * Update Employee Profile
 */
export const updateEmployeeProfile = async (data: {
  phone?: string
  email?: string
  telegram_username?: string
}): Promise<UserProfileResponse> => {
  const response = await apiClient.put<UserProfileResponse>('/v1/employee/profile', data)
  return response.data
}


/**
 * Update Student Profile
 */
export const updateStudentProfile = async (data: {
  phone?: string
  phone_secondary?: string
  email?: string
  telegram_username?: string
}): Promise<UserProfileResponse> => {
  const response = await apiClient.put<UserProfileResponse>('/v1/student/profile', data)
  return response.data
}

/**
 * Upload Avatar (Employee)
 */
export const uploadEmployeeAvatar = async (file: File): Promise<{ success: boolean; data: { image: string; image_url: string } }> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post('/v1/employee/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}


/**
 * Upload Avatar (Student)
 */
export const uploadStudentAvatar = async (file: File): Promise<{ success: boolean; data: { image: string; image_url: string } }> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post('/v1/student/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Password Reset Types
 */
export interface ForgotPasswordResponse {
  success: boolean
  message: string
  debug?: {
    token: string
    reset_link: string
  }
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

type ForgotPasswordPayload = { email: string } | { login: string }

/**
 * Forgot Password - Student
 */
export const studentForgotPassword = async (identifier: string): Promise<ForgotPasswordResponse> => {
  const payload: ForgotPasswordPayload = /@/.test(identifier) ? { email: identifier } : { login: identifier }
  const response = await apiClient.post<ForgotPasswordResponse>('/v1/student/auth/forgot-password', payload)
  return response.data
}

/**
 * Forgot Password - Employee
 */
export const employeeForgotPassword = async (identifier: string): Promise<ForgotPasswordResponse> => {
  const payload: ForgotPasswordPayload = /@/.test(identifier) ? { email: identifier } : { login: identifier }
  const response = await apiClient.post<ForgotPasswordResponse>('/v1/employee/auth/forgot-password', payload)
  return response.data
}


/**
 * Forgot Password - Universal
 */
export const forgotPassword = async (identifier: string, userType: 'employee' | 'student'): Promise<ForgotPasswordResponse> => {
  if (userType === 'employee') {
    return employeeForgotPassword(identifier)
  } else {
    return studentForgotPassword(identifier)
  }
}

/**
 * Reset Password - Student
 */
export const studentResetPassword = async (
  email: string,
  token: string,
  password: string,
  password_confirmation: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>('/student/auth/reset-password', {
    email,
    token,
    password,
    password_confirmation,
  })
  return response.data
}

/**
 * Reset Password - Employee
 */
export const employeeResetPassword = async (
  email: string,
  token: string,
  password: string,
  password_confirmation: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>('/v1/employee/auth/reset-password', {
    email,
    token,
    password,
    password_confirmation,
  })
  return response.data
}


/**
 * Reset Password - Universal
 */
export const resetPassword = async (
  email: string,
  token: string,
  password: string,
  password_confirmation: string,
  userType: 'employee' | 'student'
): Promise<ResetPasswordResponse> => {
  if (userType === 'employee') {
    return employeeResetPassword(email, token, password, password_confirmation)
  } else {
    return studentResetPassword(email, token, password, password_confirmation)
  }
}
