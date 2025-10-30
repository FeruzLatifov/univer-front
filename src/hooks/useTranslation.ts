import { useLanguageStore } from '@/stores/languageStore'
import type { LanguageCode } from '@/lib/api/language'

/**
 * Translation Hook
 *
 * Provides utilities for working with translatable fields from API
 *
 * Usage:
 * ```tsx
 * const { t, locale } = useTranslation()
 *
 * // Object has: name, name_uz, name_ru, name_en
 * const department = {
 *   name: "Axborot texnologiyalari",
 *   name_uz: "Axborot texnologiyalari",
 *   name_ru: "Информационные технологии",
 *   name_en: "Information Technologies"
 * }
 *
 * // Get translated name for current locale
 * t(department, 'name')  // Returns based on current locale
 *
 * // Force specific locale
 * t(department, 'name', 'ru')  // Returns Russian version
 * ```
 */
export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale)
  const setLocale = useLanguageStore((state) => state.setLocale)
  const isChanging = useLanguageStore((state) => state.isChanging)

  /**
   * Get translated value from object
   *
   * @param obj Object with translatable fields (name, name_uz, name_ru, name_en)
   * @param field Field name (e.g., 'name')
   * @param forcedLocale Optional: Force specific locale
   * @returns Translated string
   */
  const t = <T extends Record<string, any>>(
    obj: T | null | undefined,
    field: keyof T,
    forcedLocale?: LanguageCode
  ): string => {
    if (!obj) return ''

    const targetLocale = forcedLocale || locale

    // Try to get translated field (e.g., name_uz)
    const translatedField = `${String(field)}_${targetLocale}` as keyof T
    if (obj[translatedField] !== undefined && obj[translatedField] !== null) {
      return String(obj[translatedField])
    }

    // Fallback to original field
    if (obj[field] !== undefined && obj[field] !== null) {
      return String(obj[field])
    }

    return ''
  }

  /**
   * Get all translations for a field
   *
   * @param obj Object with translatable fields
   * @param field Field name
   * @returns Object with all translations { uz: '...', ru: '...', en: '...' }
   */
  const getAllTranslations = <T extends Record<string, any>>(
    obj: T | null | undefined,
    field: keyof T
  ): Record<LanguageCode, string> => {
    if (!obj) {
      return { uz: '', ru: '', en: '' }
    }

    return {
      uz: t(obj, field, 'uz'),
      ru: t(obj, field, 'ru'),
      en: t(obj, field, 'en'),
    }
  }

  /**
   * Check if translation exists for a field
   */
  const hasTranslation = <T extends Record<string, any>>(
    obj: T | null | undefined,
    field: keyof T,
    targetLocale?: LanguageCode
  ): boolean => {
    if (!obj) return false

    const checkLocale = targetLocale || locale
    const translatedField = `${String(field)}_${checkLocale}` as keyof T

    return (
      obj[translatedField] !== undefined &&
      obj[translatedField] !== null &&
      obj[translatedField] !== ''
    )
  }

  return {
    locale,
    setLocale,
    isChanging,
    t,
    getAllTranslations,
    hasTranslation,
  }
}

/**
 * Get translated value (standalone function, doesn't use hook)
 *
 * Useful for contexts where hooks can't be used
 */
export function getTranslatedValue<T extends Record<string, any>>(
  obj: T | null | undefined,
  field: keyof T,
  locale: LanguageCode
): string {
  if (!obj) return ''

  const translatedField = `${String(field)}_${locale}` as keyof T
  if (obj[translatedField] !== undefined && obj[translatedField] !== null) {
    return String(obj[translatedField])
  }

  if (obj[field] !== undefined && obj[field] !== null) {
    return String(obj[field])
  }

  return ''
}
