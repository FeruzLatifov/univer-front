import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ArrowLeft, Lock, Moon, Sun, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { resetPassword } from '@/lib/api/auth'
import { DEFAULT_FAVICON } from '@/utils/favicon'
import { getErrorMessage } from '@/lib/utils/error'

type UserType = 'employee' | 'student'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { theme, toggleTheme } = useThemeStore()

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [userType, setUserType] = useState<UserType>('student')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  type RingedStyle = CSSProperties & { '--tw-ring-color': string }

  const inputStyle: RingedStyle = {
    borderColor: 'var(--border-color)',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    '--tw-ring-color': 'var(--primary)'
  }

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')
    const userTypeParam = searchParams.get('type') as UserType

    if (!tokenParam || !emailParam) {
      toast.error('Token yoki email topilmadi')
      navigate('/forgot-password')
      return
    }

    setToken(tokenParam)
    setEmail(emailParam)
    if (userTypeParam === 'employee' || userTypeParam === 'student') {
      setUserType(userTypeParam)
    }
  }, [searchParams, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
      toast.error('Parollar mos kelmadi')
      return
    }

    if (password.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
      return
    }

    setLoading(true)

    try {
      const response = await resetPassword(email, token, password, passwordConfirmation, userType)
      toast.success(response.message)
      navigate('/login')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Xatolik yuz berdi'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--app-bg)' }}>
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <LanguageSwitcher variant="ghost" size="sm" />
      </div>

      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Orqaga</span>
      </button>

      <div className="w-full max-w-md px-4">
        <div className="card-professional p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center border p-2" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--active-bg)' }}>
                <img src={DEFAULT_FAVICON} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <h2 className="heading-page mb-2">Yangi parol o'rnating</h2>
            <p className="text-caption">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Yangi parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-md border focus:outline-none focus:ring-1"
                  style={inputStyle}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-md border focus:outline-none focus:ring-1"
                  style={inputStyle}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                'Parolni o\'zgartirish'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Parolingiz eslab qoldingizmi?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Kirish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
