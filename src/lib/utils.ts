import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'time') {
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('uz-UZ', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  return d.toLocaleDateString('uz-UZ')
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: 'UZS' | 'USD' = 'UZS'): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('uz-UZ').format(num)
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Generate random color based on string
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    'bg-primary-500',
    'bg-medical-500',
    'bg-math-500',
    'bg-code-500',
    'bg-philosophy-500',
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Get grade color
 */
export function getGradeColor(grade: number): string {
  if (grade >= 86) return 'text-success-600 bg-success-50'
  if (grade >= 71) return 'text-code-600 bg-code-50'
  if (grade >= 55) return 'text-philosophy-600 bg-philosophy-50'
  return 'text-error-600 bg-error-50'
}

/**
 * Get grade label
 */
export function getGradeLabel(grade: number): string {
  if (grade >= 86) return 'A'
  if (grade >= 71) return 'B'
  if (grade >= 55) return 'C'
  if (grade >= 0) return 'F'
  return 'N/A'
}

/**
 * Get attendance color
 */
export function getAttendanceColor(percentage: number): string {
  if (percentage >= 90) return 'text-success-600'
  if (percentage >= 75) return 'text-code-600'
  if (percentage >= 60) return 'text-philosophy-600'
  return 'text-error-600'
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'bg-success-50 text-success-700 border-success-200',
    pending: 'bg-philosophy-50 text-philosophy-700 border-philosophy-200',
    overdue: 'bg-error-50 text-error-700 border-error-200',
    partial: 'bg-primary-50 text-primary-700 border-primary-200',
  }
  
  return colors[status] || 'bg-muted text-muted-foreground'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format date and time
 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

