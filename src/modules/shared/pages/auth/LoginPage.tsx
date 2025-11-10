import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  Lock, GraduationCap, User, IdCard, Moon, Sun, Eye, EyeOff,
  FileText, Calendar, Code
} from 'lucide-react'
import { toast } from 'sonner'
import * as systemApi from '@/lib/api/system'
import { setPageMeta, PAGE_META, DEFAULT_FAVICON } from '@/utils/favicon'
import { getErrorMessage } from '@/lib/utils/error'

type UserType = 'employee' | 'student'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login, loading, clearError } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { locale } = useLanguageStore()
  const [userType, setUserType] = useState<UserType>('employee')
  const [loginField, setLoginField] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
    e.stopPropagation()
    clearError()

    console.log('[LoginPage] Form submitted:', {
      userType,
      login: loginField,
      student_id: studentId,
      timestamp: new Date().toISOString()
    })

    try {
      console.log('[LoginPage] Calling login API...')
      await login({
        login: userType === 'employee' ? loginField : undefined,
        student_id: userType === 'student' ? studentId : undefined,
        password,
        userType,
      })
      console.log('[LoginPage] Login successful, navigating to dashboard')
      toast.success(t('auth.login_to_continue'))
      navigate('/dashboard')
    } catch (error) {
      console.error('[LoginPage] Login failed:', error)
      const errorMessage = getErrorMessage(error, 'Login yoki parol noto\'g\'ri')
      console.log('[LoginPage] Error message:', errorMessage)
      toast.error(errorMessage)
      // Error is already in authStore.error state, will be displayed inline
    }
  }

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type)
    clearError()
    if (type === 'employee') {
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--app-bg)' }}>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={theme === 'light' ? 'Qorong\'i rejim' : 'Yorug\' rejim'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <LanguageSwitcher variant="ghost" size="sm" />

      </div>

      <div className="container mx-auto px-4 w-full">
        <div className="max-w-md mx-auto w-full">
          <div className="w-full">
            <div className="card-professional p-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {configLoading ? (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center border p-2 animate-pulse" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--active-bg)' }}>
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    ) : systemConfig.logo ? (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center border p-2" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--active-bg)' }}>
                        <img src={systemConfig.logo} alt={systemConfig.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center border p-2" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--active-bg)' }}>
                        <img src={DEFAULT_FAVICON} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {configLoading ? (
                    <>
                      <div className="h-7 w-36 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <h1 className="heading-page mb-2">{systemConfig.name || 'HEMIS Universitet axborot tizimi'}</h1>
                      <p className="text-caption">{systemConfig.description}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 p-1 rounded-lg mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('employee')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                      userType === 'employee' ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{systemConfig.loginTypes?.employee?.label || t('roles.staff', { defaultValue: 'Xodim' })}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('student')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                      userType === 'student' ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{systemConfig.loginTypes?.student?.label || t('roles.student', { defaultValue: 'Talaba' })}</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      {userType === 'employee' ? (
                        <input
                          type="text"
                          value={loginField}
                          onChange={(e) => setLoginField(e.target.value)}
                          placeholder={t('auth.login_or_employee_id', { defaultValue: 'Login / Xodim ID' })}
                          className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1"
                          style={inputStyle}
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder={t('auth.student_id', { defaultValue: 'Student ID' })}
                          className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1"
                          style={inputStyle}
                          required
                        />
                      )}
                      {userType === 'employee' ? (
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      ) : (
                        <IdCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.password', { defaultValue: 'Password' })}
                        className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1"
                        style={inputStyle}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-2"
                      style={checkboxStyle}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 text-sm font-medium cursor-pointer select-none"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('auth.remember_me')}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
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
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/reset')}
                      className="text-sm font-medium transition-colors hover:underline"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('auth.forgot_password')}
                    </button>
                  </div>
                </form>

                {!configLoading && (
                  <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="text-center text-caption space-y-1">
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
  )
}
  type RingedStyle = CSSProperties & { '--tw-ring-color': string }

  const inputStyle: RingedStyle = {
    borderColor: 'var(--border-color)',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    '--tw-ring-color': 'var(--primary)'
  }

  const checkboxStyle: RingedStyle = {
    borderColor: 'var(--border-color)',
    '--tw-ring-color': 'var(--primary)'
  }
