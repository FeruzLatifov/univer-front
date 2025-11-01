import { Languages, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageStore } from '@/stores/languageStore'
import {
  LANGUAGE_CODES,
  LANGUAGE_NAMES,
  type LanguageCode,
} from '@/lib/api/language'
import { toast } from 'sonner'

/**
 * Language Switcher Component
 *
 * Single canonical component (backend-synced, no duplicates)
 * Uses languageStore with single-fetch pattern
 * - Renders from store's languages when loaded
 * - Falls back to constants if not loaded
 * - Shows active checkmark for current locale
 * - Syncs with backend API
 */

interface LanguageSwitcherProps {
  /**
   * Variant - button style
   */
  variant?: 'default' | 'ghost' | 'outline'

  /**
   * Size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'

  /**
   * Show language name
   */
  showName?: boolean
}

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'sm',
  showName = true,
}: LanguageSwitcherProps) {
  const { locale, setLocale, isChanging, languages, languagesLoaded } = useLanguageStore()

  const handleLanguageChange = async (newLocale: LanguageCode) => {
    if (newLocale === locale || isChanging) return

    try {
      await setLocale(newLocale)

      // Get language name from database if available
      const dbLang = languages.find(l => l.code === newLocale)
      const name = dbLang?.native_name || dbLang?.name || LANGUAGE_NAMES[newLocale]
      toast.success('Til o\'zgartirildi', {
        description: `${name} tiliga o'tkazildi`,
      })
    } catch (error) {
      toast.error('Tilni o\'zgartishda xatolik', {
        description: 'Iltimos qaytadan urinib ko\'ring',
      })
    }
  }

  // Use languages from store if loaded, otherwise fallback to constants
  // Filter only active languages from database
  const displayLanguages = languagesLoaded && languages.length > 0
    ? languages
        .filter(lang => lang.active) // Faqat active tillar
        .map(lang => ({
          code: lang.code as LanguageCode,
          name: lang.native_name || lang.name,
        }))
    : LANGUAGE_CODES.map(code => ({
        code,
        name: LANGUAGE_NAMES[code],
      }))

  // Get current language display name from database
  const currentLangName = (() => {
    const dbLang = languages.find(l => l.code === locale)
    return dbLang?.native_name || dbLang?.name || LANGUAGE_NAMES[locale]
  })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="gap-2"
          disabled={isChanging}
        >
          {showName && (
            <span>{currentLangName}</span>
          )}
          {!showName && <Languages className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {displayLanguages.map(({ code, name }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{name}</span>
            {locale === code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Simple Language Switcher (Icon only)
 */
export function LanguageSwitcherIcon() {
  return (
    <LanguageSwitcher
      variant="ghost"
      size="icon"
      showName={false}
    />
  )
}

/**
 * Compact Language Switcher (Flag + Code)
 */
export function LanguageSwitcherCompact() {
  const { locale, setLocale, isChanging, languages } = useLanguageStore()

  const handleLanguageChange = async (newLocale: LanguageCode) => {
    if (newLocale === locale || isChanging) return

    try {
      await setLocale(newLocale)

      // Get language name from database if available
      const dbLang = languages.find(l => l.code === newLocale)
      const name = dbLang?.native_name || dbLang?.name || LANGUAGE_NAMES[newLocale]
      toast.success('Til o\'zgartirildi', {
        description: `${name} tiliga o'tkazildi`,
      })
    } catch (error) {
      toast.error('Tilni o\'zgartishda xatolik', {
        description: 'Iltimos qaytadan urinib ko\'ring',
      })
    }
  }

  // Get current language name
  const currentLangName = (() => {
    const dbLang = languages.find(l => l.code === locale)
    return dbLang?.native_name || dbLang?.name || LANGUAGE_NAMES[locale]
  })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 px-2" disabled={isChanging}>
          <span className="text-sm">{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGE_CODES.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="text-sm">{LANGUAGE_NAMES[code]}</span>
            {locale === code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
