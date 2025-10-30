import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ArrowLeft, User, Lock, Mail, Phone, KeyRound, Moon, Sun, IdCard } from 'lucide-react'
import { toast } from 'sonner'
import { DEFAULT_FAVICON } from '@/utils/favicon'

type Step = 'request' | 'verify' | 'reset'
type UserType = 'staff' | 'student'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()

  const [step, setStep] = useState<Step>('request')
  const [userType, setUserType] = useState<UserType>('staff')
  const [loading, setLoading] = useState(false)

  // Step 1 - Request
  const [login, setLogin] = useState('')
  const [code, setCode] = useState('')
  const [contactInfo, setContactInfo] = useState<{ email?: string; phone?: string }>({})

  // Step 2 - Verify
  const [pin, setPin] = useState('')
  const [token, setToken] = useState('')

  // Step 3 - Reset
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: API call to /api/v1/auth/reset
      // const response = await fetch('/api/v1/auth/reset', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ login })
      // })
      // const data = await response.json()

      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockData = {
        code: 'mock_encrypted_token_' + Math.random(),
        email: 'user@example.com',
        phone: '+998 ** *** ** 45'
      }

      setCode(mockData.code)
      setContactInfo({ email: mockData.email, phone: mockData.phone })
      setStep('verify')
      toast.success('PIN kod yuborildi')
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: API call to /api/v1/auth/reset?code={code}&pin={pin}
      // const response = await fetch(`/api/v1/auth/reset?code=${code}&pin=${pin}`, {
      //   method: 'POST'
      // })
      // const data = await response.json()

      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockToken = 'mock_password_reset_token_' + Math.random()

      setToken(mockToken)
      setStep('reset')
      toast.success('PIN kod tasdiqlandi')
    } catch (error: any) {
      toast.error(error.message || 'PIN kod xato')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmation) {
      toast.error('Parollar mos kelmadi')
      return
    }

    if (password.length < 8) {
      toast.error('Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
      return
    }

    setLoading(true)

    try {
      // TODO: API call to /api/v1/auth/reset/{token}
      // const response = await fetch(`/api/v1/auth/reset/${token}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password, confirmation })
      // })

      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Parol muvaffaqiyatli yangilandi')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi')
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

        <div className={`backdrop-blur-xl rounded-xl border-2 shadow-lg ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <LanguageSwitcher variant="ghost" size="sm" showFlag={true} showName={false} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-md mx-auto w-full">
          <div className="w-full animate-slide-up">
            <div className="relative group">
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl blur-3xl transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-500/30 to-slate-700/30 opacity-50 group-hover:opacity-70'
                  : 'bg-gradient-to-br from-blue-400/40 to-slate-300/40 opacity-60 group-hover:opacity-80'
              }`}></div>

              {/* Glass Card */}
              <div className={`relative backdrop-blur-3xl rounded-3xl border-2 shadow-2xl hover:shadow-3xl p-6 md:p-8 transition-all duration-300 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                {/* Back Button */}
                <button
                  onClick={() => navigate('/login')}
                  className={`mb-4 flex items-center gap-2 text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Orqaga</span>
                </button>

                {/* Logo & Title */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-xl border-2 p-2 ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-200'
                    }`}>
                      <img src={DEFAULT_FAVICON} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <h1 className={`text-2xl font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-white' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
                  }`}>
                    Parolni tiklash
                  </h1>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {step === 'request' && 'Login ma\'lumotingizni kiriting'}
                    {step === 'verify' && 'PIN kodni kiriting'}
                    {step === 'reset' && 'Yangi parol yarating'}
                  </p>
                </div>

                {/* User Type Tabs - Only for Step 1 */}
                {step === 'request' && (
                  <div className={`flex gap-1.5 p-1 rounded-xl mb-4 border ${
                    theme === 'dark' ? 'bg-slate-700/30 border-slate-600/50' : 'bg-slate-100/80 border-slate-300/50'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setUserType('staff')}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        userType === 'staff'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md scale-[1.02]'
                          : theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Xodimlar</span>
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
                      <IdCard className="w-4 h-4" />
                      <span>Talabalar</span>
                    </button>
                  </div>
                )}

                {/* Step 1: Request Reset */}
                {step === 'request' && (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center space-x-1.5 ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        <User className="w-3.5 h-3.5" />
                        <span>{userType === 'staff' ? 'Login' : 'Student ID'}</span>
                      </label>
                      <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder={userType === 'staff' ? 'admin' : 'ST001'}
                        className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Yuborilmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>PIN kod yuborish</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Verify PIN */}
                {step === 'verify' && (
                  <form onSubmit={handleVerifyPin} className="space-y-4">
                    {/* Contact Info Display */}
                    <div className={`p-3 rounded-lg border text-xs ${
                      theme === 'dark' ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <p className={`mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        PIN kod quyidagi manzillarga yuborildi:
                      </p>
                      {contactInfo.email && (
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-3.5 h-3.5 text-blue-500" />
                          <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{contactInfo.email}</span>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{contactInfo.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center space-x-1.5 ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>PIN kod (6 raqam)</span>
                      </label>
                      <input
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm text-center tracking-widest font-mono transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || pin.length !== 6}
                      className="w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Tekshirilmoqda...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>PIN kodni tasdiqlash</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center space-x-1.5 ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Yangi parol</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center space-x-1.5 ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Parolni tasdiqlang</span>
                      </label>
                      <input
                        type="password"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className={`text-xs p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      Parol kamida 8 ta belgi va raqamlardan iborat bo'lishi kerak
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Parolni yangilash</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
