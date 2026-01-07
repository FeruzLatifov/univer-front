/**
 * API Security Utility
 *
 * Bu modul API so'rovlarini imzolash va xavfsizlik
 * headerlarini qo'shish uchun ishlatiladi.
 *
 * Boshqa frontend yoki mobile ilovalar bu imzolarni
 * yarata olmaydi, chunki APP_SECRET faqat bizning
 * ilovamizga ma'lum.
 */

// Environment variables
const APP_KEY = import.meta.env.VITE_APP_KEY || ''
const APP_SECRET = import.meta.env.VITE_APP_SECRET || ''
const SECURITY_ENABLED = import.meta.env.VITE_API_SECURITY_ENABLED === 'true'

// Device ID storage key
const DEVICE_ID_KEY = 'univer_device_id'

/**
 * Generate unique device ID
 * Bu qurilmani identifikatsiya qilish uchun ishlatiladi
 */
function generateDeviceId(): string {
  // Check if we already have a device ID
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)

  if (!deviceId) {
    // Generate a new device ID based on browser fingerprint
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
    ].join('|')

    // Create hash from fingerprint + random component
    const random = crypto.getRandomValues(new Uint8Array(16))
    const randomHex = Array.from(random)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Simple hash function
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    deviceId = `${Math.abs(hash).toString(16)}-${randomHex.substring(0, 16)}`
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }

  return deviceId
}

/**
 * Get current timestamp in seconds
 */
function getTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString()
}

/**
 * Generate HMAC-SHA256 signature
 * Bu imzo backend tomonidan tekshiriladi
 */
async function generateSignature(
  appKey: string,
  timestamp: string,
  deviceId: string,
  method: string,
  path: string,
  secret: string
): Promise<string> {
  // Data to sign (same format as backend)
  const data = [appKey, timestamp, deviceId, method.toUpperCase(), path].join('|')

  // Use Web Crypto API for HMAC
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Get API security headers
 * Bu headerlar har bir so'rovga qo'shiladi
 */
export async function getSecurityHeaders(
  method: string,
  url: string
): Promise<Record<string, string>> {
  // If security is disabled, return empty headers
  if (!SECURITY_ENABLED || !APP_KEY || !APP_SECRET) {
    return {}
  }

  const timestamp = getTimestamp()
  const deviceId = generateDeviceId()

  // Extract path from URL
  const urlObj = new URL(url, window.location.origin)
  const path = urlObj.pathname.replace(/^\/api/, 'api')

  // Generate signature
  const signature = await generateSignature(
    APP_KEY,
    timestamp,
    deviceId,
    method,
    path,
    APP_SECRET
  )

  return {
    'X-App-Key': APP_KEY,
    'X-App-Timestamp': timestamp,
    'X-Device-Id': deviceId,
    'X-App-Signature': signature,
  }
}

/**
 * Check if API security is enabled
 */
export function isSecurityEnabled(): boolean {
  return SECURITY_ENABLED && !!APP_KEY && !!APP_SECRET
}

/**
 * Get device ID (for debugging)
 */
export function getDeviceId(): string {
  return generateDeviceId()
}

/**
 * Clear device ID (logout)
 */
export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY)
}
