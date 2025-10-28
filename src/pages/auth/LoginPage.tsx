import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  LogIn, Lock, GraduationCap, BookOpen, Users, Award, Globe, User, IdCard,
  BarChart3, Brain, TrendingUp, FileText, Sparkles, Activity, Target, Zap,
  FileCheck, FileSignature, LayoutDashboard, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

type UserType = 'staff' | 'student'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login, loading, error, clearError } = useAuthStore()
  const [userType, setUserType] = useState<UserType>('staff')
  const [loginField, setLoginField] = useState('admin')
  const [studentId, setStudentId] = useState('ST001')
  const [password, setPassword] = useState('admin123')

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
      setLoginField('admin')
      setPassword('admin123')
    } else {
      setStudentId('ST001')
      setPassword('student123')
    }
  }

  // Features showcase
  const features = [
    {
      icon: Brain,
      title: 'AI Tahlil',
      description: 'Sun\'iy intellekt orqali avtomatik tahlil',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Statistika',
      description: 'Real vaqtda to\'liq statistik ma\'lumotlar',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Tahlillar',
      description: 'O\'qish sifati va natijalarni tahlil qilish',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Hisobotlar',
      description: 'Avtomatik hisobot va dashboardlar',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: Zap,
      title: 'Raqamlashtirish',
      description: 'To\'liq raqamli ta\'lim jarayoni',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Target,
      title: 'Monitoring',
      description: 'Talabalar faoliyatini kuzatish',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 relative overflow-hidden">
      {/* Language Switcher - Top Right - Zamonaviy dizayn */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-2">
          <LanguageSwitcher variant="ghost" size="sm" showFlag={true} showName={false} />
        </div>
      </div>

      {/* AI/Education Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Bright gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" opacity="0.5"/>
                <line x1="30" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                <line x1="30" y1="30" x2="30" y2="60" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Floating AI/Education icons and text */}
        <div className="absolute top-20 left-10 text-white/40 font-bold text-sm animate-float">
          🎓 EDUCATION
        </div>
        <div className="absolute top-32 right-16 text-white/40 font-bold text-sm animate-float animation-delay-2000">
          🤖 AI POWERED
        </div>
        <div className="absolute bottom-40 left-16 text-white/40 font-bold text-sm animate-float animation-delay-4000">
          📊 ANALYTICS
        </div>
        <div className="absolute bottom-24 right-32 text-white/40 font-bold text-sm animate-float">
          🚀 FUTURE
        </div>
        <div className="absolute top-1/2 left-1/4 text-white/40 font-bold text-sm animate-float animation-delay-2000">
          💡 INNOVATION
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/40 font-bold text-sm animate-float animation-delay-4000">
          📈 PROGRESS
        </div>

        {/* Geometric AI patterns */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 border-2 border-white/20 rotate-12"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Modern Branding & Features */}
            <div className="space-y-8">
              {/* Logo & Title - Yorqin Glass Effect */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* Premium Animated Logo */}
                  <div className="relative group">
                    {/* Multi-layered glow effect */}
                    <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-white/50 blur-2xl animate-pulse"></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Main logo container - Glass effect */}
                    <div className="relative w-24 h-24 rounded-3xl bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-white/60 transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                      {/* Inner gradient overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/20"></div>

                      {/* Animated shimmer */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>

                      {/* Sparkle particles */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping shadow-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-300 rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute -top-1 left-3 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>

                      <GraduationCap className="w-14 h-14 text-blue-900 relative z-10 drop-shadow-2xl" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-6xl font-extrabold text-white drop-shadow-2xl">
                      UNIVER
                    </h1>
                    <p className="text-xl font-bold text-white/90 drop-shadow-lg">
                      {t('nav.dashboard')} Tizimi
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden flex items-center gap-3 p-5 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/50 shadow-xl">
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>

                  {/* Premium sparkles effect */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-md">
                      <Sparkles className="w-6 h-6 text-yellow-600 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 w-10 h-10 text-yellow-400 opacity-40 blur-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    {/* Sparkle particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
                  </div>

                  <p className="text-base text-white font-bold relative z-10 drop-shadow-lg">
                    Zamonaviy AI va raqamli texnologiyalar bilan universitet jarayonlarini boshqaring
                  </p>
                </div>
              </div>

              {/* Stats Grid - Yorqin Glass Effect */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group p-5 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        2,500+
                      </p>
                      <p className="text-sm text-white/90 font-semibold">Talabalar</p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <BookOpen className="w-7 h-7 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        340+
                      </p>
                      <p className="text-sm text-white/90 font-semibold">Fanlar</p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Award className="w-7 h-7 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        180+
                      </p>
                      <p className="text-sm text-white/90 font-semibold">O'qituvchilar</p>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Globe className="w-7 h-7 text-pink-700" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white drop-shadow-lg">
                        5
                      </p>
                      <p className="text-sm text-white/90 font-semibold">Fakultetlar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid - Yorqin Glass */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 drop-shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                  Tizim imkoniyatlari
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="group relative p-4 bg-white/25 backdrop-blur-xl rounded-xl border-2 border-white/40 hover:bg-white/35 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="w-11 h-11 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center mb-3 shadow-md">
                        <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1 drop-shadow">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-white/90 font-medium">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto space-y-6">
              {/* Quick Access - univer-yii2 imkoniyatlari */}
              <div className="grid grid-cols-3 gap-3">
                <button className="group p-4 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-md">
                      <FileCheck className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="text-xs font-bold text-white text-center">Diplom tekshirish</span>
                  </div>
                </button>

                <button className="group p-4 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-md">
                      <FileSignature className="w-6 h-6 text-blue-700" />
                    </div>
                    <span className="text-xs font-bold text-white text-center">Shartnoma olish</span>
                  </div>
                </button>

                <button className="group p-4 bg-white/30 backdrop-blur-xl rounded-2xl border-2 border-white/40 hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-md">
                      <LayoutDashboard className="w-6 h-6 text-purple-700" />
                    </div>
                    <span className="text-xs font-bold text-white text-center">Statistika</span>
                  </div>
                </button>
              </div>

              {/* Login Form */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/50">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {t('auth.login')}
                  </h3>
                  <p className="text-gray-600">
                    {t('auth.welcome_back')}
                  </p>
                </div>

                {/* User Type Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('staff')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      userType === 'staff'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Xodimlar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('student')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      userType === 'student'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Talabalar</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Login Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {userType === 'staff' ? 'Login' : t('auth.student_id')}
                    </label>
                    <div className="relative">
                      {userType === 'staff' ? (
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      ) : (
                        <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                      {userType === 'staff' ? (
                        <input
                          type="text"
                          value={loginField}
                          onChange={(e) => setLoginField(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="admin"
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="ST001"
                          required
                        />
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('common.loading')}</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>{t('auth.login_button')}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                  <p className="text-xs text-gray-700">
                    <strong className="text-blue-800">Demo:</strong>
                    <span className="block mt-1.5 text-gray-600">
                      <strong>Xodim:</strong> admin / admin123
                    </span>
                    <span className="block text-gray-600">
                      <strong>Talaba:</strong> ST001 / student123
                    </span>
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-800 text-center">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-xl rounded-2xl border-2 border-white/30 shadow-lg">
                  <p className="text-sm font-bold text-white drop-shadow-lg">
                    © 2025 UNIVER. Barcha huquqlar himoyalangan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
