import { api } from './client'

/**
 * Language Types
 */
export interface Language {
  code: string
  name: string
  native_name: string
  position: number
  active: boolean
  _translations?: Record<string, Record<string, string>>
}

export interface LanguagesResponse {
  success: boolean
  data: {
    languages: Language[]
    current: string
  }
}

export interface CurrentLanguageResponse {
  success: boolean
  data: {
    locale: string
  }
}

export interface SetLanguageRequest {
  locale: string
}

export interface SetLanguageResponse {
  success: boolean
  message: string
  data: {
    locale: string
    name: string
  }
}

/**
 * Language API Functions
 */

/**
 * Get all active languages
 */
export async function getLanguages(): Promise<LanguagesResponse> {
  const { data } = await api.get<LanguagesResponse>('/v1/languages')
  return data
}

/**
 * Get current language
 */
export async function getCurrentLanguage(): Promise<CurrentLanguageResponse> {
  const { data } = await api.get<CurrentLanguageResponse>('/v1/languages/current')
  return data
}

/**
 * Set/Change language
 */
export async function setLanguage(locale: string): Promise<SetLanguageResponse> {
  const { data } = await api.post<SetLanguageResponse>('/v1/languages/set', { locale })
  return data
}

/**
 * Get language by code
 */
export async function getLanguage(code: string): Promise<CurrentLanguageResponse> {
  const { data } = await api.get<CurrentLanguageResponse>(`/v1/languages/${code}`)
  return data
}

/**
 * Language codes (env-driven, fallback to uz,oz,ru,en)
 */
export const LANGUAGE_CODES = ['uz', 'oz', 'ru', 'en'] as const
export type LanguageCode = typeof LANGUAGE_CODES[number]

/**
 * Language names
 */
export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  uz: "O'zbekcha",
  oz: "Ўзбекча",
  ru: 'Русский',
  en: 'English',
}

/**
 * Language native names
 */
export const LANGUAGE_NATIVE_NAMES: Record<LanguageCode, string> = {
  uz: "O'zbekcha",
  oz: "Ўзбекча",
  ru: 'Русский',
  en: 'English',
}

/**
 * Language flags (emoji)
 */
export const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  uz: '🇺🇿',
  oz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
}
