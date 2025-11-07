import { Bell, Menu, Moon, Sun, Search, User, LogOut, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore, useUserStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useMenuStore } from '@/stores/menuStore'
import { getInitials } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api/client'

export default function Header() {
  const { logout, isAuthenticated } = useAuthStore()
  const { user, switchRole, refreshUserSilent } = useUserStore()
  const { theme, toggleTheme, toggleSidebar } = useThemeStore()
  const { locale } = useLanguageStore()
  const { fetchMenu } = useMenuStore()
  const { toast } = useToast()
  const isInitialMount = useRef(true)
  const [isClearingCache, setIsClearingCache] = useState(false)

  // Cache clear mutation
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/v1/employee/menu/clear-cache')
      return response.data
    },
    onSuccess: async (data) => {
      // Refresh menu and user data after clearing cache
      await fetchMenu()
      await refreshUserSilent()

      toast({
        title: 'Muvaffaqiyat',
        description: data.message || 'Tizim keshi tozalandi',
        variant: 'default',
      })
      setIsClearingCache(false)
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Keshni tozalashda xatolik yuz berdi',
        variant: 'destructive',
      })
      setIsClearingCache(false)
    },
  })

  const handleClearCache = () => {
    setIsClearingCache(true)
    clearCacheMutation.mutate()
  }

  // Refetch user when language changes to get translated role names
  useEffect(() => {
    // Skip on first mount to avoid duplicate fetch
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    if (isAuthenticated && user) {
      // Small delay to ensure Axios headers are updated
      const timer = setTimeout(() => {
        refreshUserSilent()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [locale, isAuthenticated, user, refreshUserSilent])

  const getShortName = (fullName?: string) => {
    if (!fullName) return 'Foydalanuvchi'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].toUpperCase()
    const surname = parts[0].toUpperCase()
    const firstName = parts[1] || ''
    const patronymic = parts[2] || ''
    const firstInitial = firstName[0] ? firstName[0].toUpperCase() + '.' : ''
    const patronymicInitial = patronymic[0] ? patronymic[0].toUpperCase() + '.' : ''
    return `${surname} ${firstInitial} ${patronymicInitial}`.trim()
  }

  const roleLabel = (roleName?: string | null, roleCode?: string) => roleName || roleCode || 'Admin'

  // Frontend fallback dictionary when DB lacks translations for some roles
  const roleI18n: Record<string, Record<string, string>> = {
    uz: { user: 'Foydalanuvchi', teacher: "O'qituvchi", department: 'Kafedra mudiri', admin: 'Admin' },
    oz: { user: 'Фойдаланувчи', teacher: 'Ўқитувчи', department: 'Кафедра мудири', admin: 'Админ' },
    ru: { user: 'Пользователь', teacher: 'Преподаватель', department: 'Заведующий кафедрой', admin: 'Админ' },
    en: { user: 'User', teacher: 'Teacher', department: 'Head of Department', admin: 'Admin' },
  }

  return (
    <header className="h-14 flex items-center justify-between px-4" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search - Responsive width */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Qidiruv..."
            className="pl-9 pr-3 py-2 w-40 md:w-52 lg:w-64 text-sm rounded-md border focus:outline-none focus:ring-1"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--primary)'
            } as any}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Language Switcher - Responsive (show name on larger screens, icon on small) */}
        <LanguageSwitcher showName={true} className="hidden sm:block" />
        <LanguageSwitcher showName={false} size="icon" className="block sm:hidden" />

        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
          title={theme === 'light' ? 'Qorong\'i rejim' : 'Yorug\' rejim'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Cache Clear Button */}
        <button
          onClick={handleClearCache}
          disabled={isClearingCache}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: 'var(--text-secondary)' }}
          title="Tizim keshini tozalash"
        >
          <RefreshCw className={`w-4 h-4 ${isClearingCache ? 'animate-spin' : ''}`} />
        </button>

        {/* Temporarily disabled to test menu system */}
        {/* <NotificationsDropdown /> */}

        {/* User Menu - Click-based Dropdown (Mobile-friendly) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 h-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-0 bg-transparent">
            <div className="flex items-center gap-2">
              {/* Avatar - always a single div element */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                style={user?.avatar ? {
                  backgroundImage: `url(${user.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {
                  backgroundColor: 'var(--primary)'
                }}
              >
                {!user?.avatar && (user ? getInitials(user.name ?? user.full_name ?? 'AA') : 'AA')}
              </div>
              {/* Show name and role only on large screens */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {getShortName(user?.name ?? user?.full_name ?? '')}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {(() => {
                    const active = user?.roles?.find(r => r.id === user.roleId || r.code === user.role)
                    const name = active?.name || user?.roleName
                    const code = (active?.code || user?.role || '').toString()
                    const fallback = roleI18n[(useLanguageStore.getState().locale) as keyof typeof roleI18n]?.[code]
                    return name || fallback || code || 'Admin'
                  })()}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Profile */}
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              <span>Profil</span>
            </DropdownMenuItem>

            {/* Roles Section */}
            {user?.roles && user.roles.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  ROLLAR
                </div>
                {user.roles.map((r, idx) => {
                  const active = user.roleId === r.id
                  const roleKey = r.id ?? idx
                  return (
                    <DropdownMenuItem
                      key={String(roleKey)}
                      className={`cursor-pointer ${active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={async () => {
                        if (!active && r.id) {
                          console.log('🔄 [Header] Role switching to:', r.id, r.name)
                          await switchRole(r.id)
                          console.log('✅ [Header] Role switched, now fetching menu...')
                          await fetchMenu()
                          console.log('✅ [Header] Menu fetched!')
                        }
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: active ? 'var(--success)' : 'var(--border-color)' }}
                      />
                      <span className="text-sm">
                        {r.name || roleI18n[(useLanguageStore.getState().locale) as keyof typeof roleI18n]?.[String(r.code)] || String(r.code)}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </>
            )}

            {/* Logout */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Chiqish</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
