import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  LogIn, Lock, GraduationCap, User, IdCard, Moon, Sun, Sparkles, Eye, EyeOff,
  FileText, Award, FileCheck, BarChart3, MoreVertical, KeyRound, Calendar, Code
} from 'lucide-react'
import { toast } from 'sonner'
import * as systemApi from '@/lib/api/system'
import { setPageMeta, PAGE_META, DEFAULT_FAVICON } from '@/utils/favicon'

type UserType = 'staff' | 'student'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login, loading, error, clearError } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { locale } = useLanguageStore()
  const [userType, setUserType] = useState<UserType>('staff')
  const [loginField, setLoginField] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // System configuration
  const [systemConfig, setSystemConfig] = useState<systemApi.SystemLoginConfig>({
    logo: null,
    name: 'HEMIS Universitet axborot tizimi',
    description: 'Universitet Boshqaruv Tizimi',
    universityCode: null,
    appVersion: '1.0.0'
  })
  const [configLoading, setConfigLoading] = useState(true)

  // Current date/time for footer
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  // Set page meta (title & favicon)
  useEffect(() => {
    setPageMeta(PAGE_META.login)
  }, [])

  // Fetch system configuration on mount and when language changes
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setConfigLoading(true)
        const config = await systemApi.getLoginConfig()
        setSystemConfig(config)
        // Update description if available
        if (config.description) {
          setPageMeta({
            description: config.description
          })
        }
      } catch (error) {
        console.error('Failed to fetch system config:', error)
        // Keep default values if API fails
      } finally {
        setConfigLoading(false)
      }
    }

    fetchConfig()
  }, [locale]) // Refetch when language changes

  // Update current date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login({
        login: userType === 'staff' ? loginField : undefined,
        student_id: userType === 'student' ? studentId : undefined,
        password,
        userType,
      })
      toast.success(t('auth.login_to_continue'))
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || t('auth.welcome_back'))
    }
  }

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type)
    clearError()
    if (type === 'staff') {
      setLoginField('')
      setPassword('')
    } else {
      setStudentId('')
      setPassword('')
    }
  }

  // Format date/time for footer
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date)
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300 flex items-center justify-center">
      {/* Professional Background - WCAG AA Compliant */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}></div>

      {/* Floating Gradient Orbs - Subtle & Professional */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Orb - Blue */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/40 to-cyan-200/30 dark:from-blue-500/20 dark:to-cyan-400/10 rounded-full blur-3xl animate-float"></div>

        {/* Secondary Orb - Violet */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/40 to-purple-200/30 dark:from-violet-500/20 dark:to-purple-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Accent Orb - Emerald */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/40 to-teal-200/30 dark:from-emerald-500/20 dark:to-teal-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Extra highlight orb - Top right */}
        <div
          className="absolute top-10 right-10 w-[300px] h-[300px] bg-gradient-to-br from-cyan-300/30 to-blue-200/20 dark:from-cyan-400/15 dark:to-blue-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMzksMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60"></div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-3 animate-slide-up">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700'
              : 'bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-lg'
          }`}
          aria-label={theme === 'light' ? 'Qorong\'i rejim' : 'Yorug\' rejim'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Language Switcher */}
        <div className={`backdrop-blur-xl rounded-xl border-2 shadow-lg ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <LanguageSwitcher variant="ghost" size="sm" showFlag={true} showName={false} />
        </div>

        {/* More Menu (Dropdown) */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-lg'
            }`}
            aria-label="Ko'proq"
          >
            <MoreVertical className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowDropdown(false)}
              ></div>
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border-2 shadow-2xl z-40 overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/dashboard/reset')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Parolni tiklash</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/find-diploma')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Diplom topish</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/find-contract')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Shartnoma topish</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      window.open('https://data.univer.uz', '_blank')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Ochiq ma'lumotlar</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-md mx-auto w-full">
          {/* Login Card */}
          <div className="w-full animate-slide-up">
            {/* Glass Card with Glow Effect */}
            <div className="relative group">
              {/* Glow Effect - WCAG AA Compliant */}
              <div className={`absolute inset-0 rounded-3xl blur-3xl transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-500/30 to-slate-700/30 opacity-50 group-hover:opacity-70'
                  : 'bg-gradient-to-br from-blue-400/40 to-slate-300/40 opacity-60 group-hover:opacity-80'
              }`}></div>

              {/* Glass Card */}
              <div className={`relative backdrop-blur-3xl rounded-3xl border-2 shadow-2xl hover:shadow-3xl p-6 md:p-8 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}>
                {/* Logo & University Name - Inside Form */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    {configLoading ? (
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-xl border-2 p-2 animate-pulse ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600'
                            : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200'
                        }`}>
                          <div className="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                        </div>
                      </div>
                    ) : systemConfig.logo ? (
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-xl border-2 p-2 ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600'
                            : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200'
                        }`}>
                          <img
                            src={systemConfig.logo}
                            alt={systemConfig.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Sparkles Icon */}
                        <Sparkles className="absolute -top-0.5 -right-0.5 w-5 h-5 text-yellow-500 animate-pulse" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-xl border-2 p-2 ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600'
                            : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200'
                        }`}>
                          <img
                            src={DEFAULT_FAVICON}
                            alt="Default Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Sparkles Icon */}
                        <Sparkles className="absolute -top-0.5 -right-0.5 w-5 h-5 text-yellow-500 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {configLoading ? (
                    <>
                      <div className="h-7 w-36 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-1.5 animate-pulse"></div>
                      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <h1 className={`text-2xl font-bold font-display mb-1.5 ${
                        theme === 'dark'
                          ? 'text-white'
                          : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
                      }`}>
                        {systemConfig.name || 'HEMIS Universitet axborot tizimi'}
                      </h1>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {systemConfig.description}
                      </p>
                    </>
                  )}
                </div>

                {/* User Type Tabs - Compact & Modern */}
                <div className={`flex gap-1.5 p-1 rounded-xl mb-4 border ${
                  theme === 'dark'
                    ? 'bg-slate-700/30 border-slate-600/50'
                    : 'bg-slate-100/80 border-slate-300/50'
                }`}>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('staff')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      userType === 'staff'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-[1.02]'
                        : theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{systemConfig.loginTypes?.staff?.label || t('roles.staff', { defaultValue: 'Xodim' })}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('student')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      userType === 'student'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-[1.02]'
                        : theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{systemConfig.loginTypes?.student?.label || t('roles.student', { defaultValue: 'Talaba' })}</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Login Field (match Yii2: placeholder-based, icon on the right) */}
                  <div className="space-y-1.5">
                    <div className="relative group">
                      {userType === 'staff' ? (
                        <input
                          type="text"
                          value={loginField}
                          onChange={(e) => setLoginField(e.target.value)}
                          placeholder={t('auth.login_or_employee_id', { defaultValue: 'Login / Xodim ID' })}
                          aria-label={t('auth.login_or_employee_id', { defaultValue: 'Login / Xodim ID' })}
                          className={`relative w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm transition-all shadow-sm ${
                            theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500'
                              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-slate-300'
                          } focus:outline-none`}
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder={t('auth.student_id', { defaultValue: 'Student ID' })}
                          aria-label={t('auth.student_id', { defaultValue: 'Student ID' })}
                          className={`relative w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm transition-all shadow-sm ${
                            theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500'
                              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-slate-300'
                          } focus:outline-none`}
                          required
                        />
                      )}
                      {userType === 'staff' ? (
                        <User className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                          theme === 'dark'
                            ? 'text-slate-400 group-focus-within:text-blue-400'
                            : 'text-slate-400 group-focus-within:text-blue-600'
                        }`} />
                      ) : (
                        <IdCard className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                          theme === 'dark'
                            ? 'text-slate-400 group-focus-within:text-blue-400'
                            : 'text-slate-400 group-focus-within:text-blue-600'
                        }`} />
                      )}
                    </div>
                  </div>

                  {/* Password (match Yii2: placeholder-based, eye toggle on right) */}
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.password', { defaultValue: 'Password' })}
                        aria-label={t('auth.password', { defaultValue: 'Password' })}
                        className={`relative w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-slate-300'
                        } focus:outline-none`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:scale-110 ${
                          theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`w-4 h-4 rounded border-2 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800'
                          : 'bg-white border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-white'
                      } focus:ring-2 focus:ring-offset-2`}
                    />
                    <label
                      htmlFor="remember-me"
                      className={`ml-2 text-xs font-medium cursor-pointer select-none ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {t('auth.remember_me')}
                    </label>
                  </div>

                  {/* Submit Button - Compact */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('common.loading')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{t('auth.login_button')}</span>
                        <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/reset')}
                      className={`text-xs font-medium transition-colors hover:underline ${
                        theme === 'dark'
                          ? 'text-slate-400 hover:text-blue-400'
                          : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      {t('auth.forgot_password')}
                    </button>
                  </div>

                  {/* Error message removed; toast already shows feedback */}
                </form>

                {/* Footer - App Version, UID, Date */}
                {!configLoading && (
                  <div className={`mt-6 pt-4 border-t ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <div className={`text-center text-xs space-y-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3" />
                          <span className="font-semibold">{t('common.version')}:</span>
                          <span>{systemConfig.appVersion}</span>
                        </div>
                        {systemConfig.universityCode && (
                          <div className="flex items-center gap-1.5">
                            <Code className="w-3 h-3" />
                            <span className="font-semibold">{t('common.uid')}:</span>
                            <span>{systemConfig.universityCode}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span className="font-semibold">{t('common.date')}:</span>
                        <span>{formatDateTime(currentDateTime)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
