import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ArrowLeft, User, IdCard, Moon, Sun, Loader2, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { forgotPassword } from '@/lib/api/auth'
import { DEFAULT_FAVICON } from '@/utils/favicon'
import { useTranslation } from 'react-i18next'

type UserType = 'employee' | 'student'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const { t } = useTranslation()

  const [userType, setUserType] = useState<UserType>('employee')
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await forgotPassword(identifier, userType)
      setSubmitted(true)
      toast.success(response.message)

      // Show debug info in development
      if (response.debug) {
        console.log('Reset token:', response.debug.token)
        console.log('Reset link:', response.debug.reset_link)
      }
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
        <span className="hidden sm:inline">{t('common.back', { defaultValue: 'Orqaga' })}</span>
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
              {t('auth.reset_password', { defaultValue: 'Parolni tiklash' })}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('auth.reset_password_desc', { defaultValue: 'Emailingizga parolni tiklash havolasi yuboriladi' })}
            </p>
          </div>

          {/* User Type Tabs - Match Login Style */}
          <div className={`flex gap-1.5 p-1 rounded-xl mb-6 border ${
            theme === 'dark'
              ? 'bg-slate-700/30 border-slate-600/50'
              : 'bg-slate-100/80 border-slate-300/50'
          }`}>
            <button
              type="button"
              onClick={() => setUserType('employee')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                userType === 'employee'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-[1.02]'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('roles.staff', { defaultValue: 'Xodim' })}</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                userType === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-[1.02]'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('roles.student', { defaultValue: 'Talaba' })}</span>
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identifier Input (Login/EmployeeID or Student ID) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {userType === 'employee'
                    ? t('auth.reset_prompt_staff', { defaultValue: 'Xodim ID yoki akkaunt loginini kiriting' })
                    : t('auth.reset_prompt_student', { defaultValue: 'Talaba ID (Student ID) ni kiriting' })}
                </label>
                <div className="relative">
                  {userType === 'employee' ? (
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  ) : (
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  )}
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={userType === 'employee'
                      ? t('auth.login_or_employee_id', { defaultValue: 'Login / Xodim ID' })
                      : t('auth.student_id', { defaultValue: 'Student ID' })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                      theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500/50'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Submit Button - Match Login Button Style */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('common.sending', { defaultValue: 'Yuborilmoqda...' })}
                  </>
                ) : (
                  t('auth.reset_password', { defaultValue: 'Parolni tiklash' })
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {t('auth.reset_link_sent', { defaultValue: 'Parolni tiklash havolasi quyidagi manzilga yuborildi:' })} <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
              >
                {t('auth.back_to_login', { defaultValue: 'Kirish sahifasiga qaytish' })}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('auth.remember_password', { defaultValue: 'Parolingiz eslab qoldingizmi?' })}{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-semibold hover:underline ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
              }`}
            >
              {t('auth.login', { defaultValue: 'Kirish' })}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
