import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ArrowLeft, Lock, Moon, Sun, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { resetPassword } from '@/lib/api/auth'
import { DEFAULT_FAVICON } from '@/utils/favicon'

type UserType = 'staff' | 'student'

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

  useEffect(() => {
    // Get token and email from URL params
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
    if (userTypeParam === 'staff' || userTypeParam === 'student') {
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300 flex items-center justify-center">
      {/* Background */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}></div>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/40 to-cyan-200/30 dark:from-blue-500/20 dark:to-cyan-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/40 to-purple-200/30 dark:from-violet-500/20 dark:to-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMzksMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60"></div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-3 animate-slide-up">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700'
              : 'bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-lg'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
        <LanguageSwitcher variant="outline" size="sm" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/login')}
        className={`absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl transition-all animate-slide-up ${
          theme === 'dark'
            ? 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-slate-200'
            : 'bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-lg text-slate-700'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Orqaga</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-fade-up">
        <div
          className={`backdrop-blur-xl rounded-3xl border-2 shadow-2xl p-8 ${
            theme === 'dark'
              ? 'bg-slate-800/70 border-slate-700/50'
              : 'bg-white/70 border-slate-200/50'
          }`}
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30'
                    : 'bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200'
                }`}
              >
                <img src={DEFAULT_FAVICON} alt="Logo" className="w-12 h-12" />
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Yangi parol o'rnating
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Yangi parol
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Confirmation Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                'Parolni o\'zgartirish'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Parolingiz eslab qoldingizmi?{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-semibold hover:underline ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
              }`}
            >
              Kirish
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
