import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  setLanguage as apiSetLanguage,
  getLanguages,
  type LanguageCode,
  type Language
} from '@/lib/api/language'
import { api } from '@/lib/api/client'
import i18n from '@/i18n'
import { useAuthStore, useUserStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menuStore'

interface LanguageState {
  locale: LanguageCode
  isChanging: boolean
  languages: Language[]
  languagesLoaded: boolean
  setLocale: (locale: LanguageCode) => Promise<void>
  initializeLocale: () => void
  loadLanguagesOnce: () => Promise<void>
}

/**
 * Language Store
 *
 * Single-fetch pattern: loads languages once and persists to localStorage
 * - Persists locale and languages to localStorage
 * - Syncs with API
 * - Sets axios headers
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: (import.meta.env.VITE_DEFAULT_LOCALE as LanguageCode) || 'uz',
      isChanging: false,
      languages: [],
      languagesLoaded: false,

      /**
       * Load languages from API (single-fetch pattern)
       * Returns immediately if already loaded
       */
      loadLanguagesOnce: async () => {
        const { languagesLoaded } = get()

        // Guard: if already loaded, return immediately
        if (languagesLoaded) {
          return
        }

        try {
          const response = await getLanguages()
          if (response.success && response.data) {
            set({
              languages: response.data.languages,
              languagesLoaded: true
            })
          }
        } catch (error) {
          console.error('Failed to load languages:', error)
          // Set loaded to true even on error to prevent repeated failures
          set({ languagesLoaded: true })
        }
      },

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

          // Update i18next language for frontend translations
          await i18n.changeLanguage(locale)

          // Update store
          set({ locale, isChanging: false })

          // Only refresh user data and menu if user is authenticated
          const isAuthenticated = useAuthStore.getState().isAuthenticated

          if (isAuthenticated) {
            // Soft refresh authenticated user to get localized fields (roles, profile labels)
            try {
              console.log('[LOCALE] Refreshing user data with new locale:', locale)
              await useUserStore.getState().refreshUserSilent()
              console.log('[LOCALE] User data refreshed successfully')
            } catch (err) {
              console.error('[LOCALE] Failed to refresh user data:', err)
            }

            // ✅ Refresh menu with new locale (to get translated menu labels)
            try {
              console.log('[LOCALE] Refreshing menu with new locale:', locale)
              await useMenuStore.getState().fetchMenu(locale)
              console.log('[LOCALE] Menu refreshed successfully')
            } catch (err) {
              console.error('[LOCALE] Failed to refresh menu:', err)
            }
          } else {
            console.log('[LOCALE] User not authenticated, skipping user/menu refresh')
          }
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
        const { locale, languages, languagesLoaded } = get()

        // If languages loaded, validate if current locale is active
        if (languagesLoaded && languages.length > 0) {
          const isLocaleActive = languages.some(lang => lang.code === locale && lang.active)

          if (!isLocaleActive) {
            // Fallback to first active language or default
            const fallbackLang = languages.find(lang => lang.active)
            const fallbackLocale = fallbackLang?.code || (import.meta.env.VITE_DEFAULT_LOCALE as LanguageCode) || 'uz'

            set({ locale: fallbackLocale })
            api.defaults.headers.common['X-Locale'] = fallbackLocale
            api.defaults.headers.common['Accept-Language'] = fallbackLocale
            i18n.changeLanguage(fallbackLocale)
            return
          }
        }

        // Set axios headers
        api.defaults.headers.common['X-Locale'] = locale
        api.defaults.headers.common['Accept-Language'] = locale

        // Sync with i18next
        i18n.changeLanguage(locale)
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({
        locale: state.locale,
        languages: state.languages,
        languagesLoaded: state.languagesLoaded
      }),
    }
  )
)

// Initialize on load
if (typeof window !== 'undefined') {
  const store = useLanguageStore.getState()
  store.initializeLocale()
  // Load languages once on app init
  store.loadLanguagesOnce()
}
