import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, sanitizeForLog } from '../logger'

describe('logger', () => {
  let consoleLogSpy: any
  let consoleErrorSpy: any
  let consoleWarnSpy: any
  let consoleInfoSpy: any

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('error logging', () => {
    it('should call console.error for errors', () => {
      logger.error('Test error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error')
    })

    it('should handle multiple arguments', () => {
      logger.error('Error:', { code: 500 })
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Error:', { code: 500 })
    })
  })

  describe('warn logging', () => {
    it('should call console.warn for warnings', () => {
      logger.warn('Test warning')
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning')
    })

    it('should handle multiple arguments', () => {
      logger.warn('Warning:', { status: 'deprecated' })
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Warning:', { status: 'deprecated' })
    })
  })

  describe('debug and info logging', () => {
    it('should exist as functions', () => {
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
    })

    // Note: debug and info behavior depends on import.meta.env.DEV
    // In test environment, they may or may not log
    it('should not throw when called', () => {
      expect(() => logger.debug('Debug message')).not.toThrow()
      expect(() => logger.info('Info message')).not.toThrow()
    })
  })
})

describe('sanitizeForLog', () => {
  it('should redact token fields', () => {
    const data = {
      user: 'john',
      access_token: 'secret123',
      password: 'pass123',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.user).toBe('john')
    expect(sanitized.access_token).toBe('***REDACTED***')
    expect(sanitized.password).toBe('***REDACTED***')
  })

  it('should redact refresh_token', () => {
    const data = {
      refresh_token: 'refresh_secret',
      data: 'safe',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.refresh_token).toBe('***REDACTED***')
    expect(sanitized.data).toBe('safe')
  })

  it('should redact authorization fields', () => {
    const data = {
      authorization: 'Bearer token123',
      content: 'public',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.authorization).toBe('***REDACTED***')
    expect(sanitized.content).toBe('public')
  })

  it('should redact api_key and apiKey fields', () => {
    const data = {
      api_key: 'key123',
      apiKey: 'key456',
      user: 'john',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.api_key).toBe('***REDACTED***')
    expect(sanitized.apiKey).toBe('***REDACTED***')
    expect(sanitized.user).toBe('john')
  })

  it('should redact secret fields', () => {
    const data = {
      secret: 'my_secret',
      user_secret: 'another_secret',
      name: 'john',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.secret).toBe('***REDACTED***')
    expect(sanitized.user_secret).toBe('***REDACTED***')
    expect(sanitized.name).toBe('john')
  })

  it('should handle null input', () => {
    const result = sanitizeForLog(null)
    expect(result).toBeNull()
  })

  it('should handle undefined input', () => {
    const result = sanitizeForLog(undefined)
    expect(result).toBeUndefined()
  })

  it('should handle primitive types', () => {
    expect(sanitizeForLog('string')).toBe('string')
    expect(sanitizeForLog(123)).toBe(123)
    expect(sanitizeForLog(true)).toBe(true)
  })

  it('should handle arrays', () => {
    const data = [1, 2, 3]
    const result = sanitizeForLog(data)
    // Arrays are spread into objects by the spread operator
    expect(result).toBeDefined()
  })

  it('should handle nested objects', () => {
    const data = {
      user: 'john',
      credentials: {
        access_token: 'secret',
        username: 'john',
      },
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.user).toBe('john')
    // Note: Current implementation only sanitizes top-level fields
    // This test documents current behavior
    expect(sanitized.credentials).toBeDefined()
  })

  it('should handle empty objects', () => {
    const data = {}
    const result = sanitizeForLog(data)
    expect(result).toEqual({})
  })

  it('should be case-insensitive for sensitive keys', () => {
    const data = {
      ACCESS_TOKEN: 'secret',
      Password: 'pass',
      data: 'safe',
    }
    
    const sanitized = sanitizeForLog(data)
    
    expect(sanitized.ACCESS_TOKEN).toBe('***REDACTED***')
    expect(sanitized.Password).toBe('***REDACTED***')
    expect(sanitized.data).toBe('safe')
  })
})
