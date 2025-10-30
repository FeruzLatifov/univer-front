import { Languages, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/hooks/useTranslation'
import {
  LANGUAGE_CODES,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  type LanguageCode,
} from '@/lib/api/language'
import { toast } from 'sonner'

/**
 * Language Switcher Component
 *
 * Displays current language and allows switching between available languages
 * Shows in header/navbar
 */
export function LanguageSwitcher() {
  const { locale, setLocale, isChanging } = useTranslation()

  const handleLanguageChange = async (newLocale: LanguageCode) => {
    if (newLocale === locale || isChanging) return

    try {
      await setLocale(newLocale)
      toast.success('Til o\'zgartirildi', {
        description: `${LANGUAGE_FLAGS[newLocale]} ${LANGUAGE_NAMES[newLocale]} tiliga o'tkazildi`,
      })
    } catch (error) {
      toast.error('Tilni o\'zgartishda xatolik', {
        description: 'Iltimos qaytadan urinib ko\'ring',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-8 px-2"
          disabled={isChanging}
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>{LANGUAGE_FLAGS[locale]}</span>
            <span className="text-xs font-medium">{locale.toUpperCase()}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGE_CODES.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{LANGUAGE_FLAGS[code]}</span>
              <span>{LANGUAGE_NAMES[code]}</span>
            </div>
            {locale === code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
