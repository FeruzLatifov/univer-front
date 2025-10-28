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
  const response = await apiClient.post<AuthResponse>('/v1/staff/auth/login', {
    login,
    password,
  })
  return response.data
}

/**
 * Student Login
 */
export const studentLogin = async (studentId: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/v1/student/auth/login', {
    student_id: studentId,
    password,
  })
  return response.data
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
  const response = await apiClient.post<RefreshResponse>('/v1/staff/auth/refresh')
  return response.data
}

/**
 * Refresh Token (Student)
 */
export const studentRefreshToken = async (): Promise<RefreshResponse> => {
  const response = await apiClient.post<RefreshResponse>('/v1/student/auth/refresh')
  return response.data
}

/**
 * Get Current User (Staff)
 */
export const getStaffProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>('/v1/staff/auth/me')
  return response.data
}

/**
 * Get Current User (Student)
 */
export const getStudentProfile = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>('/v1/student/auth/me')
  return response.data
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
