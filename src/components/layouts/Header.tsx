import { Bell, Menu, Moon, Sun, Search, User, LogOut } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { getInitials } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import NotificationsDropdown from '@/components/NotificationsDropdown'

export default function Header() {
  const { user, logout, switchRole, refreshUserSilent, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme, toggleSidebar } = useThemeStore()
  const { locale } = useLanguageStore()
  const isInitialMount = useRef(true)

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
  }, [locale])

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
    <header className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        {/* Ultra-Dense Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Qidiruv..."
            className="pl-7 pr-2 py-1 w-48 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Ultra-Dense Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title={theme === 'light' ? 'Qorong\'i rejim' : 'Yorug\' rejim'}
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Ultra-Dense User Menu (Avatar + Name + Role) */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-[10px]">
                {user ? getInitials(user.name) : 'AA'}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-[11px] font-medium text-gray-900 dark:text-white leading-tight">
                {getShortName(user?.name)}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                {(() => {
                  const active = user?.roles?.find(r => r.id === user.roleId || r.code === user.role)
                  const name = active?.name || user?.roleName
                  const code = (active?.code || user?.role || '').toString()
                  const fallback = roleI18n[(useLanguageStore.getState().locale) as keyof typeof roleI18n]?.[code]
                  return name || fallback || code || 'Admin'
                })()}
              </div>
            </div>
          </button>

          {/* Ultra-Dense Dropdown */}
          <div className="absolute right-0 mt-0.5 w-44 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-1">
              <button className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <User className="w-3 h-3" />
                <span className="text-[11px]">Profil</span>
              </button>
              {/* Roles list (if multiple roles available in future) */}
              {user?.roles && user.roles.length > 0 && (
                <div className="mt-1 border-t border-gray-200 dark:border-gray-700 pt-1">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-gray-400">Foydalanuvchi rollari</div>
                  {user.roles.map((r, idx) => {
                    const active = user.roleId === r.id
                    const roleKey = r.id ?? idx
                    return (
                    <button
                      key={String(roleKey)}
                      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={() => {
                        if (!active && r.id) {
                          switchRole(r.id)
                        }
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-[11px]">{r.name || roleI18n[(useLanguageStore.getState().locale) as keyof typeof roleI18n]?.[String(r.code)] || String(r.code)}</span>
                    </button>
                  )})}
                </div>
              )}
              <button
                onClick={logout}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-50 text-red-700"
              >
                <LogOut className="w-3 h-3" />
                <span className="text-[11px]">Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

