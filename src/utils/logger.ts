/**
 * Logger Utility for Secure Logging
 * 
 * This utility ensures that sensitive information is not logged in production
 * and provides a consistent logging interface across the application.
 * 
 * Usage:
 *   logger.debug('Debug info') // Only in development
 *   logger.info('Info message') // Only in development
 *   logger.warn('Warning')     // Always logged
 *   logger.error('Error')      // Always logged
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  /**
   * Debug logging - only in development
   * Use for detailed debugging information
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * Info logging - only in development
   * Use for general information
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  },

  /**
   * Warning logging - always shown
   * Use for important warnings that should always be visible
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args)
  },

  /**
   * Error logging - always shown
   * Use for errors that should always be logged
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },
}

/**
 * Sanitize sensitive data before logging
 * Removes or redacts sensitive information like tokens and passwords
 * 
 * @param data - The data object to sanitize
 * @returns Sanitized data object
 */
export const sanitizeForLog = (data: any): any => {
  if (!data) return data
  
  // Handle primitive types
  if (typeof data !== 'object') return data
  
  const sanitized = { ...data }
  const sensitiveKeys = [
    'token', 'password', 'access_token', 'refresh_token', 
    'authorization', 'secret', 'api_key', 'apiKey'
  ]
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '***REDACTED***'
    }
  }
  
  return sanitized
}
