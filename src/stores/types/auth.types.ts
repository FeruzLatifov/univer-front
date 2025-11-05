/**
 * Shared Auth Types
 * Used across authStore, userStore, and permissionStore
 */

/**
 * JWT Payload Interface
 * Permissions stored in JWT token (secure, cannot be tampered)
 */
export interface JWTPayload {
  user_id: number
  role?: string
  permissions?: string[]
  exp: number
  iat?: number
}

/**
 * User Interface
 */
export interface User {
  id: number
  name: string
  email?: string
  phone?: string
  role: string
  roleId?: number | null
  roleName?: string | null
  roles?: Array<{ id?: number; code?: string | null; name: string }>
  type: 'employee' | 'student'
  avatar?: string
  department?: string
  faculty?: string
  login?: string
  student_id?: string
  active: boolean
  permissions?: string[] // Backend'dan kelgan permissions list
  // Additional fields from Laravel
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

/**
 * Custom session storage adapter for Zustand
 * Browser yopilganda avtomatik o'chadi (localStorage emas)
 */
export const sessionStorageAdapter = {
  getItem: (name: string) => {
    const value = sessionStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name)
  },
}
