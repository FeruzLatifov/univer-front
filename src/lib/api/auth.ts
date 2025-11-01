import { apiClient } from './client'

/**
 * Auth API Service
 *
 * Connects to Laravel backend authentication endpoints
 * Supports both staff and student authentication
 */

export interface LoginCredentials {
  login?: string        // For staff (admin, teacher, etc.)
  student_id?: string   // For students
  password: string
  userType: 'staff' | 'student'
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
 * Staff Login
 */
export const staffLogin = async (login: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/staff/auth/login', {
    login,
    password,
  })
  // Interceptor already unwrapped {success, data} → data
  // But we need to return {success, data} format for AuthResponse
  return {
    success: response.data._success ?? true,
    data: response.data,
    message: response.data._message
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
  return {
    success: response.data._success ?? true,
    data: response.data,
    message: response.data._message
  }
}

/**
 * Universal Login (determines user type automatically)
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (credentials.userType === 'staff' && credentials.login) {
    return staffLogin(credentials.login, credentials.password)
  } else if (credentials.userType === 'student' && credentials.student_id) {
    return studentLogin(credentials.student_id, credentials.password)
  } else {
    throw new Error('Invalid credentials: missing login or student_id')
  }
}

/**
 * Staff Logout
 */
export const staffLogout = async (): Promise<void> => {
  await apiClient.post('/v1/staff/auth/logout')
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
export const logout = async (userType: 'staff' | 'student'): Promise<void> => {
  if (userType === 'staff') {
    await staffLogout()
  } else {
    await studentLogout()
  }
}

/**
 * Refresh Token (Staff)
 */
export const staffRefreshToken = async (): Promise<RefreshResponse> => {
  const response = await apiClient.post('/v1/staff/auth/refresh')
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
 * Get Current User (Staff)
 */
export const getStaffProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get('/v1/staff/auth/me')
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
export const getCurrentUser = async (userType: 'staff' | 'student'): Promise<UserProfileResponse> => {
  if (userType === 'staff') {
    return getStaffProfile()
  } else {
    return getStudentProfile()
  }
}

/**
 * Switch active role (Staff)
 */
export const switchStaffRole = async (role: number): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/staff/auth/role/switch', { role })
  return {
    success: response.data._success ?? true,
    data: response.data,
    message: response.data._message
  }
}

/**
 * Update Staff Profile
 */
export const updateStaffProfile = async (data: {
  phone?: string
  email?: string
  telegram_username?: string
}): Promise<UserProfileResponse> => {
  const response = await apiClient.put<UserProfileResponse>('/v1/staff/profile', data)
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
 * Upload Avatar (Staff)
 */
export const uploadStaffAvatar = async (file: File): Promise<{ success: boolean; data: { image: string; image_url: string } }> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post('/v1/staff/profile/avatar', formData, {
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

/**
 * Forgot Password - Student
 */
export const studentForgotPassword = async (identifier: string): Promise<ForgotPasswordResponse> => {
  const payload: any = /@/.test(identifier) ? { email: identifier } : { login: identifier }
  const response = await apiClient.post<ForgotPasswordResponse>('/v1/student/auth/forgot-password', payload)
  return response.data
}

/**
 * Forgot Password - Staff
 */
export const staffForgotPassword = async (identifier: string): Promise<ForgotPasswordResponse> => {
  const payload: any = /@/.test(identifier) ? { email: identifier } : { login: identifier }
  const response = await apiClient.post<ForgotPasswordResponse>('/v1/staff/auth/forgot-password', payload)
  return response.data
}

/**
 * Forgot Password - Universal
 */
export const forgotPassword = async (identifier: string, userType: 'staff' | 'student'): Promise<ForgotPasswordResponse> => {
  if (userType === 'staff') {
    return staffForgotPassword(identifier)
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
 * Reset Password - Staff
 */
export const staffResetPassword = async (
  email: string,
  token: string,
  password: string,
  password_confirmation: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>('/admin/auth/reset-password', {
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
  userType: 'staff' | 'student'
): Promise<ResetPasswordResponse> => {
  if (userType === 'staff') {
    return staffResetPassword(email, token, password, password_confirmation)
  } else {
    return studentResetPassword(email, token, password, password_confirmation)
  }
}
