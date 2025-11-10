import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeRichText, sanitizeBasicText, stripHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("XSS")</script><p>Safe content</p>'
    const output = sanitizeHtml(input)
    
    expect(output).not.toContain('<script>')
    expect(output).not.toContain('alert')
    expect(output).toContain('<p>Safe content</p>')
  })

  it('should remove event handlers', () => {
    const input = '<a href="#" onclick="alert(\'XSS\')">Click</a>'
    const output = sanitizeHtml(input)
    
    expect(output).not.toContain('onclick')
    expect(output).toContain('<a')
    expect(output).toContain('Click')
  })

  it('should remove iframe tags', () => {
    const input = '<iframe src="https://evil.com"></iframe><p>Content</p>'
    const output = sanitizeHtml(input)
    
    expect(output).not.toContain('iframe')
    expect(output).toContain('<p>Content</p>')
  })

  it('should allow safe HTML tags', () => {
    const input = '<p><strong>Bold</strong> and <em>italic</em></p>'
    const output = sanitizeHtml(input)
    
    expect(output).toContain('<strong>')
    expect(output).toContain('<em>')
    expect(output).toContain('Bold')
    expect(output).toContain('italic')
  })

  it('should handle empty input', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('should handle null input', () => {
    expect(sanitizeHtml(null)).toBe('')
  })

  it('should handle undefined input', () => {
    expect(sanitizeHtml(undefined)).toBe('')
  })

  it('should remove dangerous attributes', () => {
    const input = '<img src="x" onerror="alert(\'XSS\')">'
    const output = sanitizeHtml(input)
    
    expect(output).not.toContain('onerror')
  })

  it('should allow safe links', () => {
    const input = '<a href="/safe/link" title="Safe">Link</a>'
    const output = sanitizeHtml(input)
    
    expect(output).toContain('href="/safe/link"')
    expect(output).toContain('title="Safe"')
  })

  it('should remove javascript: URLs', () => {
    const input = '<a href="javascript:alert(\'XSS\')">Click</a>'
    const output = sanitizeHtml(input)
    
    expect(output).not.toContain('javascript:')
  })
})

describe('sanitizeRichText', () => {
  it('should allow rich text tags', () => {
    const input = '<h1>Title</h1><p>Text with <a href="/link">link</a></p><ul><li>Item</li></ul>'
    const output = sanitizeRichText(input)
    
    expect(output).toContain('<h1>')
    expect(output).toContain('<a href="/link">')
    expect(output).toContain('<ul>')
    expect(output).toContain('<li>')
  })

  it('should still remove dangerous content', () => {
    const input = '<h1>Title</h1><script>alert("XSS")</script><p>Content</p>'
    const output = sanitizeRichText(input)
    
    expect(output).toContain('<h1>')
    expect(output).not.toContain('<script>')
    expect(output).toContain('<p>Content</p>')
  })

  it('should allow blockquotes and code', () => {
    const input = '<blockquote>Quote</blockquote><code>code()</code>'
    const output = sanitizeRichText(input)
    
    expect(output).toContain('<blockquote>')
    expect(output).toContain('<code>')
  })

  it('should handle empty input', () => {
    expect(sanitizeRichText('')).toBe('')
  })
})

describe('sanitizeBasicText', () => {
  it('should allow basic formatting only', () => {
    const input = '<p>Text with <strong>bold</strong> and <em>italic</em></p>'
    const output = sanitizeBasicText(input)
    
    expect(output).toContain('<strong>')
    expect(output).toContain('<em>')
  })

  it('should remove complex tags', () => {
    const input = '<p>Text</p><div>Div</div><table><tr><td>Cell</td></tr></table>'
    const output = sanitizeBasicText(input)
    
    expect(output).toContain('<p>')
    expect(output).not.toContain('<div>')
    expect(output).not.toContain('<table>')
  })

  it('should remove links', () => {
    const input = '<p>Text with <a href="/link">link</a></p>'
    const output = sanitizeBasicText(input)
    
    expect(output).not.toContain('<a')
    expect(output).toContain('link') // Text should remain
  })

  it('should handle empty input', () => {
    expect(sanitizeBasicText('')).toBe('')
  })
})

describe('stripHtml', () => {
  it('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>'
    const output = stripHtml(input)
    
    expect(output).toBe('Hello World')
    expect(output).not.toContain('<')
    expect(output).not.toContain('>')
  })

  it('should handle complex HTML', () => {
    const input = '<div><h1>Title</h1><p>Paragraph with <a href="#">link</a></p></div>'
    const output = stripHtml(input)
    
    expect(output).toContain('Title')
    expect(output).toContain('Paragraph')
    expect(output).toContain('link')
    expect(output).not.toContain('<')
  })

  it('should handle empty input', () => {
    expect(stripHtml('')).toBe('')
  })

  it('should handle plain text', () => {
    const input = 'Just plain text'
    const output = stripHtml(input)
    
    expect(output).toBe('Just plain text')
  })
})
