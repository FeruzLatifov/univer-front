import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import uz from './locales/uz.json'
import oz from './locales/oz.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

/**
 * i18n Configuration
 *
 * Frontend uchun til tizimi (react-i18next)
 * Backend API dan kelgan ma'lumotlar uchun ?l= parametri ishlatiladi
 */

i18n
  // Browser tilini aniqlash
  .use(LanguageDetector)
  // React integration
  .use(initReactI18next)
  // Konfiguratsiya
  .init({
    resources: {
      uz: { translation: uz },
      oz: { translation: oz },
      ru: { translation: ru },
      en: { translation: en },
    },

    // Default til
    fallbackLng: 'uz',

    // LocalStorage dan olish yoki brauzerdan aniqlash
    lng: localStorage.getItem('language') || undefined,

    // Interpolation sozlamalari
    interpolation: {
      escapeValue: false, // React allaqachon XSS dan himoyalaydi
    },

    // Debug mode (faqat development da)
    debug: import.meta.env.DEV,

    // Detection sozlamalari
    detection: {
      // Qayerdan til aniqlanadi (tartib muhim)
      order: ['localStorage', 'navigator', 'htmlTag'],

      // LocalStorage key
      lookupLocalStorage: 'language',

      // Cache
      caches: ['localStorage'],

      // Til kodini qisqartirish (uz-UZ -> uz)
      convertDetectedLanguage: (lng: string) => {
        // uz-UZ, ru-RU -> uz, ru
        return lng.split('-')[0]
      },
    },
  })

// Til o'zgarganda localStorage ga saqlash
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)

  // HTML lang attribute ni yangilash (SEO uchun)
  document.documentElement.lang = lng
})

export default i18n

/**
 * Tillarni mapping qilish (Backend uchun)
 * uz -> uz-UZ
 * oz -> oz-UZ
 * ru -> ru-RU
 * en -> en-EN
 */
export const getFullLocaleCode = (shortCode: string): string => {
  const map: Record<string, string> = {
    uz: 'uz-UZ',
    oz: 'oz-UZ',
    ru: 'ru-RU',
    en: 'en-EN',
  }
  return map[shortCode] || 'uz-UZ'
}

/**
 * Til nomlari
 */
export const languageNames: Record<string, string> = {
  uz: "O'zbekcha",
  oz: "Ўзбекча",
  ru: 'Русский',
  en: 'English',
}

/**
 * Til bayroqlari (emoji)
 */
export const languageFlags: Record<string, string> = {
  uz: '🇺🇿',
  oz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
}

/**
 * Ruxsat berilgan tillar
 */
export const availableLanguages = ['uz', 'oz', 'ru', 'en'] as const

export type AvailableLanguage = (typeof availableLanguages)[number]
