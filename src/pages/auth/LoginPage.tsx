import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LogIn, Mail, Lock, GraduationCap, BookOpen, Users, Award, Globe, User, IdCard } from 'lucide-react'
import { toast } from 'sonner'

type UserType = 'staff' | 'student'

export default function LoginPage() {
  const navigate = useNavigate()
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
      toast.success('Tizimga muvaffaqiyatli kirdingiz!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login yoki parol noto\'g\'ri')
    }
  }

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type)
    clearError()
    // Set default values based on user type
    if (type === 'staff') {
      setLoginField('admin')
      setPassword('admin123')
    } else {
      setStudentId('ST001')
      setPassword('student123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-8">
          
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo & Title */}
            <div className="space-y-4">
              <div className="flex justify-center lg:justify-start">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl">
                  <GraduationCap className="w-14 h-14" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  HEMIS
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Universitet Boshqaruv Tizimi
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
                  Zamonaviy ta'lim texnologiyalari bilan universitetni boshqaring
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">2,500+</p>
                  <p className="text-sm text-gray-600">Talabalar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">340+</p>
                  <p className="text-sm text-gray-600">Fanlar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">180+</p>
                  <p className="text-sm text-gray-600">O'qituvchilar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">5</p>
                  <p className="text-sm text-gray-600">Fakultetlar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-lg mx-auto lg:max-w-md">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Tizimga kirish
                </h3>
                <p className="text-gray-600">
                  HEMIS boshqaruv paneliga xush kelibsiz
                </p>
              </div>

              {/* User Type Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('staff')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    userType === 'staff'
                      ? 'bg-white text-blue-600 shadow-md'
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
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Talabalar</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Login Field (Staff) or Student ID (Student) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {userType === 'staff' ? 'Login' : 'Talaba ID'}
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
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="admin"
                        required
                      />
                    ) : (
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="ST001"
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Eslab qolish
                    </span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Parolni unutdingizmi?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Tizimga kirish</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Demo ma'lumotlar:</strong><br />
                  <span className="block mt-2">
                    <strong>Xodimlar:</strong><br />
                    Login: admin / Parol: admin123<br />
                    Login: rector / Parol: rector123<br />
                    Login: dean / Parol: dean123
                  </span>
                  <span className="block mt-2">
                    <strong>Talabalar:</strong><br />
                    ID: ST001 / Parol: student123
                  </span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-800 text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-600 text-sm">
              © 2025 HEMIS. Barcha huquqlar himoyalangan.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

