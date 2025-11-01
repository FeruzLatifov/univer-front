/**
 * Utility for dynamically changing page favicon and title
 */

// Default favicon path from index.html
export const DEFAULT_FAVICON = '/hemis-logo.png'

// Global system name and logo - will be set from backend
let globalSystemName = 'UNIVER'
let globalSystemLogo: string | null = null

export const setGlobalSystemName = (name: string) => {
  globalSystemName = name
}

export const getGlobalSystemName = () => globalSystemName

export const setGlobalSystemLogo = (logo: string | null) => {
  globalSystemLogo = logo
}

export const getGlobalSystemLogo = () => globalSystemLogo

export const setPageMeta = (options: {
  title?: string
  favicon?: string
  description?: string
  useSystemName?: boolean
}) => {
  const { title, favicon, description, useSystemName = false } = options

  // Update title (without system name by default)
  if (title) {
    document.title = useSystemName && globalSystemName ? `${title} - ${globalSystemName}` : title
  }

  // Update favicon
  if (favicon) {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll("link[rel*='icon']")
    existingFavicons.forEach(link => link.remove())

    // Add new favicon
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.href = favicon
    document.head.appendChild(link)
  }

  // Update description meta tag
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }
}

// Initialize global favicon from backend (one time on app load)
export const initGlobalFavicon = async () => {
  try {
    // Fetch system config from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    const response = await fetch(`${apiUrl}/system/login-config?l=uz-UZ`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      const config = result.data

      // Set favicon if available
      if (config.university_logo || config.favicon) {
        const faviconUrl = config.favicon || config.university_logo
        setPageMeta({ favicon: faviconUrl })
        setGlobalSystemLogo(faviconUrl)
      } else {
        setGlobalSystemLogo(null)
      }

      // Store system name
      if (config.university_name) {
        setGlobalSystemName(config.university_name)
      } else if (config.university_short_name) {
        setGlobalSystemName(config.university_short_name)
      }
    }
  } catch (error) {
    console.error('Failed to load system favicon:', error)
    // Keep default favicon if fetch fails
    setGlobalSystemLogo(null)
  }
}

// Predefined page configs (title only, favicon is global)
export const PAGE_META = {
  login: {
    title: 'Kirish',
    description: 'Tizimga kirish'
  },
  dashboard: {
    title: 'Boshqaruv paneli',
    description: 'Boshqaruv paneli'
  },
  students: {
    title: 'Talabalar',
    description: 'Talabalar ro\'yxati va boshqaruvi'
  },
  faculty: {
    title: 'Fakultetlar',
    description: 'Fakultetlar ro\'yxati va boshqaruvi'
  },
  subjects: {
    title: 'Fanlar',
    description: 'Fanlar ro\'yxati va boshqaruvi'
  },
  schedule: {
    title: 'Dars jadvali',
    description: 'Dars jadvali'
  },
  grades: {
    title: 'Baholar',
    description: 'Talabalar baholari'
  },
  reports: {
    title: 'Hisobotlar',
    description: 'Tizim hisobotlari'
  },
  settings: {
    title: 'Sozlamalar',
    description: 'Tizim sozlamalari'
  }
} as const

export type PageMetaKey = keyof typeof PAGE_META
