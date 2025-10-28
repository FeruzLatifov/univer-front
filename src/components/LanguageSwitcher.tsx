import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  languageFlags,
  languageNames,
  availableLanguages,
  getFullLocaleCode,
  type AvailableLanguage,
} from '@/i18n'

/**
 * Language Switcher Component
 *
 * Foydalanuvchi tilni o'zgartirish uchun dropdown
 * Xuddi Yii2 dagi kabi - navbar da chiqadi
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
   * Show flag emoji
   */
  showFlag?: boolean

  /**
   * Show language name
   */
  showName?: boolean
}

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'sm',
  showFlag = true,
  showName = true,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language as AvailableLanguage

  const changeLanguage = (lng: AvailableLanguage) => {
    // React i18n tilni o'zgartirish
    i18n.changeLanguage(lng)

    // localStorage ga saqlash (i18n.ts da avtomatik, lekin shu yerda ham qo'shamiz)
    localStorage.setItem('language', lng)

    // API so'rovlar uchun to'liq til kodi
    const fullLocaleCode = getFullLocaleCode(lng)
    localStorage.setItem('api_locale', fullLocaleCode)

    // Sahifani qayta yuklash (agar kerak bo'lsa)
    // Odatda kerak emas, chunki React i18n avtomatik yangilaydi
    // window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          {showFlag && (
            <span className="text-lg">{languageFlags[currentLanguage]}</span>
          )}
          {showName && <span>{languageNames[currentLanguage]}</span>}
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={
              lng === currentLanguage
                ? 'bg-accent font-medium'
                : ''
            }
          >
            <span className="mr-2 text-lg">{languageFlags[lng]}</span>
            <span>{languageNames[lng]}</span>
            {lng === currentLanguage && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
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
      showFlag={false}
      showName={false}
    />
  )
}

/**
 * Compact Language Switcher (Flag + Code)
 */
export function LanguageSwitcherCompact() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language as AvailableLanguage

  const changeLanguage = (lng: AvailableLanguage) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
    localStorage.setItem('api_locale', getFullLocaleCode(lng))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 px-2">
          <span className="text-base">{languageFlags[currentLanguage]}</span>
          <span className="text-xs uppercase">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={lng === currentLanguage ? 'bg-accent' : ''}
          >
            <span className="mr-2 text-base">{languageFlags[lng]}</span>
            <span className="text-xs uppercase">{lng}</span>
            <span className="ml-2 flex-1 text-sm">{languageNames[lng]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
