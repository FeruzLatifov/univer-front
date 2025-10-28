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
  data: Language[]
  current: string
}

export interface CurrentLanguageResponse {
  success: boolean
  data: Language
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
  const { data } = await api.get<LanguagesResponse>('/languages')
  return data
}

/**
 * Get current language
 */
export async function getCurrentLanguage(): Promise<CurrentLanguageResponse> {
  const { data } = await api.get<CurrentLanguageResponse>('/languages/current')
  return data
}

/**
 * Set/Change language
 */
export async function setLanguage(locale: string): Promise<SetLanguageResponse> {
  const { data } = await api.post<SetLanguageResponse>('/languages/set', { locale })
  return data
}

/**
 * Get language by code
 */
export async function getLanguage(code: string): Promise<CurrentLanguageResponse> {
  const { data } = await api.get<CurrentLanguageResponse>(`/languages/${code}`)
  return data
}

/**
 * Language codes
 */
export const LANGUAGE_CODES = ['uz', 'ru', 'en'] as const
export type LanguageCode = typeof LANGUAGE_CODES[number]

/**
 * Language names
 */
export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English',
}

/**
 * Language native names
 */
export const LANGUAGE_NATIVE_NAMES: Record<LanguageCode, string> = {
  uz: "O'zbek tili",
  ru: 'Русский язык',
  en: 'English',
}

/**
 * Language flags (emoji)
 */
export const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
}
