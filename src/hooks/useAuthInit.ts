import { useEffect, useState } from 'react'
import { useAuthStore, useUserStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

/**
 * Initialize authentication on app load
 * Fetches current user if token exists in localStorage
 */
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { fetchCurrentUser } = useUserStore()

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      // Check if we have a token and user type in localStorage
      const accessToken = localStorage.getItem('access_token')
      const userType = localStorage.getItem('user_type')

      if (accessToken && userType && !isAuthenticated) {
        try {
          // Fetch current user to restore session
          await fetchCurrentUser()
        } catch (error) {
          logger.warn('[AuthInit] Failed to restore session', error)
          // Token might be expired, user will need to login again
        }
      }

      if (isMounted) {
        setIsInitialized(true)
      }
    }

    void initAuth()

    return () => {
      isMounted = false
    }
  }, [fetchCurrentUser, isAuthenticated])

  return isInitialized
}
