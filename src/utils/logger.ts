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
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * Info logging - only in development
   * Use for general information
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  },

  /**
   * Warning logging - always shown
   * Use for important warnings that should always be visible
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args)
  },

  /**
   * Error logging - always shown
   * Use for errors that should always be logged
   */
  error: (...args: unknown[]) => {
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
export const sanitizeForLog = <T>(data: T): T => {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data !== 'object') {
    return data
  }

  const sensitiveKeys = [
    'token',
    'password',
    'access_token',
    'refresh_token',
    'authorization',
    'secret',
    'api_key',
    'apiKey',
  ]

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForLog(item)) as T
  }

  const sanitizedEntries = Object.entries(data as Record<string, unknown>).map(([key, value]) => {
    const shouldRedact = sensitiveKeys.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    )
    return [key, shouldRedact ? '***REDACTED***' : value]
  })

  return Object.fromEntries(sanitizedEntries) as T
}
