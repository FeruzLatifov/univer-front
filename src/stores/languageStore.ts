import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setLanguage as apiSetLanguage, type LanguageCode } from '@/lib/api/language'
import { api } from '@/lib/api/client'

interface LanguageState {
  locale: LanguageCode
  isChanging: boolean
  setLocale: (locale: LanguageCode) => Promise<void>
  initializeLocale: () => void
}

/**
 * Language Store
 *
 * Manages application language/locale state
 * - Persists to localStorage
 * - Syncs with API
 * - Sets axios headers
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'uz',
      isChanging: false,

      /**
       * Change language
       */
      setLocale: async (locale: LanguageCode) => {
        try {
          set({ isChanging: true })

          // Call API to set language on server
          await apiSetLanguage(locale)

          // Update axios default headers for future requests
          api.defaults.headers.common['X-Locale'] = locale
          api.defaults.headers.common['Accept-Language'] = locale

          // Update store
          set({ locale, isChanging: false })

          // Reload page to apply translations (optional)
          // window.location.reload()
        } catch (error) {
          console.error('Failed to change language:', error)
          set({ isChanging: false })
          throw error
        }
      },

      /**
       * Initialize locale from localStorage and set axios headers
       */
      initializeLocale: () => {
        const { locale } = get()

        // Set axios headers
        api.defaults.headers.common['X-Locale'] = locale
        api.defaults.headers.common['Accept-Language'] = locale
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
)

// Initialize on load
if (typeof window !== 'undefined') {
  useLanguageStore.getState().initializeLocale()
}
