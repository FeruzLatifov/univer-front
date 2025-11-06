# 🛡️ Security Best Practices Implementation Guide

This document provides actionable steps to implement security improvements in the Univer Frontend application.

---

## 📋 Table of Contents

1. [Quick Wins (Immediate Implementation)](#quick-wins-immediate-implementation)
2. [XSS Protection](#xss-protection)
3. [Logging Security](#logging-security)
4. [Content Security Policy](#content-security-policy)
5. [Build Configuration](#build-configuration)
6. [API Security](#api-security)
7. [Testing Security](#testing-security)

---

## ⚡ Quick Wins (Immediate Implementation)

### 1. Disable Source Maps in Production

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    // Disable source maps in production
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
  },
})
```

### 2. Create Logger Utility

**File:** `src/utils/logger.ts`

```typescript
/**
 * Logger Utility for Secure Logging
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
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * Info logging - only in development
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  },

  /**
   * Warning logging - always shown
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args)
  },

  /**
   * Error logging - always shown
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },
}

/**
 * Sanitize sensitive data before logging
 */
export const sanitizeForLog = (data: any): any => {
  if (!data) return data
  
  const sanitized = { ...data }
  const sensitiveKeys = ['token', 'password', 'access_token', 'refresh_token', 'authorization']
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '***REDACTED***'
    }
  }
  
  return sanitized
}
```

### 3. Update API Client Logging

**File:** `src/lib/api/client.ts`

Replace all `console.log` with `logger.debug`:

```typescript
import { logger, sanitizeForLog } from '@/utils/logger'

// Before
console.log('[API] 401 error: Attempting token refresh', {
  userType,
  hasRefreshToken: !!refreshToken,
  refreshTokenLength: refreshToken?.length
})

// After
logger.debug('[API] 401 error: Attempting token refresh', {
  userType,
  hasRefreshToken: !!refreshToken,
})
```

### 4. Update Auth Store Logging

**File:** `src/stores/auth/authStore.ts`

```typescript
import { logger, sanitizeForLog } from '@/utils/logger'

// Before
console.log('[AuthStore] Login successful', {
  userId: user.id,
  userName: user.name,
  userType: credentials.userType,
  tokenLength: access_token?.length
})

// After
logger.debug('[AuthStore] Login successful', {
  userId: user.id,
  userName: user.name,
  userType: credentials.userType,
})
```

---

## 🔒 XSS Protection

### 1. Install DOMPurify

```bash
yarn add dompurify
yarn add -D @types/dompurify
```

### 2. Create HTML Sanitizer Utility

**File:** `src/utils/sanitize.ts`

```typescript
import DOMPurify from 'dompurify'

/**
 * Sanitize HTML to prevent XSS attacks
 * 
 * Usage:
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 */
export const sanitizeHtml = (html: string, options?: {
  allowedTags?: string[]
  allowedAttributes?: string[]
}): string => {
  const defaultConfig = {
    ALLOWED_TAGS: [
      'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'a', 
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  }

  const config = {
    ...defaultConfig,
    ...(options?.allowedTags && { ALLOWED_TAGS: options.allowedTags }),
    ...(options?.allowedAttributes && { ALLOWED_ATTR: options.allowedAttributes }),
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Sanitize for rich text (forum posts, comments)
 */
export const sanitizeRichText = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'a',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
    ],
    allowedAttributes: ['href', 'title'],
  })
}

/**
 * Sanitize for basic text (comments, replies)
 */
export const sanitizeBasicText = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
    allowedAttributes: [],
  })
}
```

### 3. Update Forum Pages

**File:** `src/modules/teacher/pages/ForumTopicDetailPage.tsx`

```typescript
import { sanitizeRichText } from '@/utils/sanitize'

// Before
<div dangerouslySetInnerHTML={{ __html: topic.description }} />

// After
<div dangerouslySetInnerHTML={{ __html: sanitizeRichText(topic.description) }} />

// Even better - avoid dangerouslySetInnerHTML if possible
// If content is plain text, just use:
<div>{topic.description}</div>
```

---

## 📝 Logging Security

### Best Practices

1. **Never log sensitive data:**
   - ❌ Tokens
   - ❌ Passwords
   - ❌ API keys
   - ❌ Personal information (unless necessary)

2. **Use appropriate log levels:**
   - `debug`: Development only
   - `info`: Development only
   - `warn`: Important warnings
   - `error`: Critical errors

3. **Production logging:**
   - Use external services (Sentry, LogRocket)
   - Don't log to browser console
   - Sanitize all data before sending

### Example: Secure Logging

```typescript
// ❌ BAD
console.log('Login response:', response.data)
console.log('Token:', token)

// ✅ GOOD
logger.debug('Login successful', { userId: user.id })
logger.error('Login failed', { error: error.message })
```

---

## 🔐 Content Security Policy

### 1. Add CSP Meta Tag

**File:** `index.html`

```html
<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/hemis-logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' http://localhost:8000 https://api.dicebear.com https://sentry.io;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    ">
    
    <title>HEMIS - Universitet Boshqaruv Tizimi 2025</title>
    <meta name="description" content="Zamonaviy universitet boshqaruv tizimi - React 19, TypeScript 5.9, Vite 7" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. Configure Server Headers (Production)

**Nginx:**

```nginx
# /etc/nginx/sites-available/univer-frontend

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # CSP Header (more flexible and secure than meta tag)
    # PRODUCTION NOTE: Remove 'unsafe-inline' and 'unsafe-eval' for better security
    # Use nonce-based CSP: script-src 'self' 'nonce-{random}';
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https: blob:;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src 'self' https://api.yourdomain.com https://sentry.io;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
    " always;

    # Root directory
    root /var/www/univer-frontend/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🏗️ Build Configuration

### 1. Environment Variables

**File:** `.env.example`

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Sentry Error Tracking
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# App Version
VITE_APP_VERSION=1.0.0

# Debug Mode (only for development)
VITE_DEBUG_MODE=false
```

### 2. Production Build Script

**File:** `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "NODE_ENV=production vite build",
    "build:staging": "NODE_ENV=staging vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "security-check": "yarn audit --level moderate"
  }
}
```

### 3. Sentry Configuration

**File:** `src/main.tsx`

```typescript
import * as Sentry from '@sentry/react'

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
    
    // Performance Monitoring
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.2'),
    
    // Session Replay
    replaysSessionSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1'),
    replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0'),
    
    // Security: Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request) {
        delete event.request.cookies
        if (event.request.headers) {
          delete event.request.headers['Authorization']
          delete event.request.headers['Cookie']
        }
      }
      
      // Remove sensitive data from extra
      if (event.extra) {
        const sanitized = { ...event.extra }
        const sensitiveKeys = ['token', 'password', 'access_token', 'refresh_token']
        
        for (const key in sanitized) {
          if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
            sanitized[key] = '***REDACTED***'
          }
        }
        
        event.extra = sanitized
      }
      
      return event
    },
  })
}
```

---

## 🔌 API Security

### 1. Request Timeout

Already implemented in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}
```

### 2. Request Debouncing

**File:** `src/utils/debounce.ts`

```typescript
/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
```

**Usage:**

```typescript
import { debounce } from '@/utils/debounce'

// Search with debounce
const handleSearch = debounce((query: string) => {
  api.get('/search', { params: { q: query } })
}, 300)
```

### 3. CSRF Token (if needed)

**File:** `src/lib/api/client.ts`

```typescript
// Get CSRF token from meta tag (if Laravel CSRF protection is used)
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

if (csrfToken) {
  apiClient.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}
```

---

## 🧪 Testing Security

### 1. XSS Testing

Create a test file: `src/__tests__/security/xss.test.ts`

```typescript
import { sanitizeHtml, sanitizeRichText } from '@/utils/sanitize'

describe('XSS Protection', () => {
  it('should remove script tags', () => {
    const malicious = '<script>alert("XSS")</script><p>Hello</p>'
    const sanitized = sanitizeHtml(malicious)
    
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).toContain('<p>Hello</p>')
  })
  
  it('should remove event handlers', () => {
    const malicious = '<a href="#" onclick="alert(\'XSS\')">Click</a>'
    const sanitized = sanitizeHtml(malicious)
    
    expect(sanitized).not.toContain('onclick')
  })
  
  it('should allow safe HTML tags', () => {
    const safe = '<p><strong>Bold</strong> and <em>italic</em></p>'
    const sanitized = sanitizeRichText(safe)
    
    expect(sanitized).toContain('<strong>')
    expect(sanitized).toContain('<em>')
  })
})
```

### 2. Token Security Testing

```typescript
describe('Token Security', () => {
  it('should not log tokens', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    
    // Simulate login
    authStore.login({ login: 'test', password: 'test', userType: 'student' })
    
    // Check that no token is logged
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('token')
    )
    
    consoleSpy.mockRestore()
  })
})
```

### 3. Manual Security Checklist

Create: `SECURITY_TESTING_CHECKLIST.md`

```markdown
# Security Testing Checklist

## XSS Testing
- [ ] Test forum post with `<script>alert('XSS')</script>`
- [ ] Test comment with `<img src=x onerror=alert('XSS')>`
- [ ] Test input with `javascript:alert('XSS')`
- [ ] Verify DOMPurify is sanitizing correctly

## Token Security
- [ ] Check F12 > Application > Session Storage (tokens should be there)
- [ ] Check F12 > Console (no tokens in logs)
- [ ] Test token expiry and refresh
- [ ] Test logout clears all tokens

## Permission Testing
- [ ] Try accessing admin pages as student (should show 404)
- [ ] Try accessing teacher pages as student (should show 404)
- [ ] Test F12 > React DevTools role modification (backend should reject)

## API Security
- [ ] Test rate limiting (make 100 requests quickly)
- [ ] Test CSRF protection (if implemented)
- [ ] Test invalid token (should redirect to login)
- [ ] Test expired token (should refresh or redirect)

## Build Security
- [ ] Production build has no source maps
- [ ] Production build has no console.log
- [ ] Check F12 > Sources (code should be minified)

## Network Security
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] Security headers are present (check response headers)
- [ ] CSP is active (check console for violations)
```

---

## 📚 Additional Resources

### Security Libraries

```bash
# XSS Protection
yarn add dompurify @types/dompurify

# Input Validation (already installed)
# - zod
# - react-hook-form

# Error Tracking (already installed)
# - @sentry/react

# Security Headers (server-side)
# - helmet (for Express/Node backend)
```

### Useful Tools

1. **OWASP ZAP** - Security testing tool
2. **Burp Suite** - Web security testing
3. **npm audit** - Check for vulnerable dependencies
4. **Snyk** - Continuous security monitoring

### Commands

```bash
# Check for vulnerable dependencies
yarn audit

# Fix vulnerabilities
yarn audit fix

# Check for outdated packages
yarn outdated

# Security scan (if using Snyk)
npx snyk test
```

---

## ✅ Implementation Checklist

### Phase 1: Critical (Week 1)
- [ ] Install DOMPurify
- [ ] Create sanitize utility
- [ ] Update ForumTopicDetailPage with sanitization
- [ ] Create logger utility
- [ ] Update all console.log to use logger
- [ ] Disable source maps in production
- [ ] Configure terser to remove console.log

### Phase 2: Important (Week 2)
- [ ] Add CSP meta tag
- [ ] Configure Sentry PII filtering
- [ ] Add debounce utility
- [ ] Implement request debouncing on search
- [ ] Update .env.example with security variables
- [ ] Create security testing checklist

### Phase 3: Recommended (Week 3)
- [ ] Configure Nginx security headers
- [ ] Set up HTTPS with SSL certificate
- [ ] Add CSRF protection (if needed)
- [ ] Create security documentation
- [ ] Conduct security audit
- [ ] Train team on security best practices

---

**Last Updated:** 2025-11-06  
**Next Review:** 2025-02-06 (Every 3 months)
