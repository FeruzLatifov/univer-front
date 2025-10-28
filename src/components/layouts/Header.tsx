import { Bell, Menu, Moon, Sun, Search, User, LogOut, GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { getInitials } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import NotificationsDropdown from '@/components/NotificationsDropdown'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme, toggleSidebar } = useThemeStore()

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

        {/* Ultra-Dense User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-[10px]">
              {user ? getInitials(user.name) : 'AA'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[11px] font-medium text-gray-900 dark:text-white leading-tight">
                {user?.name || 'Foydalanuvchi'}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                {user?.role || 'admin'}
              </div>
            </div>
          </button>

          {/* Ultra-Dense Dropdown */}
          <div className="absolute right-0 mt-0.5 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-1">
              <button className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <User className="w-3 h-3" />
                <span className="text-[11px]">Profil</span>
              </button>
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

