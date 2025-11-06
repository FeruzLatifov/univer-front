import DOMPurify from 'dompurify'

/**
 * HTML Sanitization Utilities for XSS Protection
 * 
 * These utilities use DOMPurify to sanitize HTML content and prevent
 * Cross-Site Scripting (XSS) attacks.
 * 
 * SECURITY NOTE: Always use these utilities when rendering user-generated
 * HTML content with dangerouslySetInnerHTML.
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * 
 * @param html - The HTML string to sanitize
 * @param options - Optional configuration for allowed tags and attributes
 * @returns Sanitized HTML string
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
 * ```
 */
export const sanitizeHtml = (html: string, options?: {
  allowedTags?: string[]
  allowedAttributes?: string[]
}): string => {
  if (!html) return ''
  
  const defaultConfig = {
    ALLOWED_TAGS: [
      // Text formatting
      'b', 'i', 'u', 'strong', 'em', 's', 'mark',
      // Structure
      'p', 'br', 'div', 'span',
      // Links
      'a',
      // Lists
      'ul', 'ol', 'li',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Quotes and code
      'blockquote', 'code', 'pre',
      // Tables (if needed)
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    // Prevent DOM clobbering attacks
    SANITIZE_DOM: true,
    // Keep safe HTML elements
    KEEP_CONTENT: true,
  }

  const config = {
    ...defaultConfig,
    ...(options?.allowedTags && { ALLOWED_TAGS: options.allowedTags }),
    ...(options?.allowedAttributes && { ALLOWED_ATTR: options.allowedAttributes }),
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Sanitize rich text content (forum posts, articles, descriptions)
 * 
 * Allows more HTML tags suitable for rich text content like forum posts.
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeRichText(forumPost) }} />
 * ```
 */
export const sanitizeRichText = (html: string): string => {
  if (!html) return ''
  
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'u', 'strong', 'em', 's', 'mark',
      'p', 'br', 'div',
      'a',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre',
    ],
    allowedAttributes: ['href', 'title', 'rel'],
  })
}

/**
 * Sanitize basic text (comments, short replies)
 * 
 * Very restrictive - only allows basic text formatting.
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeBasicText(comment) }} />
 * ```
 */
export const sanitizeBasicText = (html: string): string => {
  if (!html) return ''
  
  return sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
    allowedAttributes: [],
  })
}

/**
 * Strip all HTML tags and return plain text
 * 
 * Use this when you need plain text only (e.g., meta descriptions, previews)
 * 
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 * 
 * @example
 * ```tsx
 * const preview = stripHtml(content).substring(0, 100)
 * ```
 */
export const stripHtml = (html: string): string => {
  if (!html) return ''
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  })
}
