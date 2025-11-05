import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { LogIn, Mail, Lock, GraduationCap, BookOpen, Users, Award, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPageFull() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('admin@univer.uz')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Tizimga muvaffaqiyatli kirdingiz!')
      navigate('/dashboard')
    } catch {
      toast.error('Login yoki parol noto\'g\'ri')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Blobs - Compact */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-32 left-32 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left Side - Branding (Compact) */}
          <div className="text-center lg:text-left space-y-6">
            {/* Logo & Title */}
            <div className="space-y-3">
              <div className="flex justify-center lg:justify-start">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                  <GraduationCap className="w-11 h-11" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  HEMIS
                </h1>
                <h2 className="text-xl font-semibold text-gray-800">
                  Universitet Boshqaruv Tizimi
                </h2>
                <p className="text-base text-gray-600 max-w-md mx-auto lg:mx-0">
                  Zamonaviy ta'lim texnologiyalari bilan universitetni boshqaring
                </p>
              </div>
            </div>

            {/* Compact Features */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">2,500+</p>
                  <p className="text-xs text-gray-600">Talabalar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">340+</p>
                  <p className="text-xs text-gray-600">Fanlar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">180+</p>
                  <p className="text-xs text-gray-600">O'qituvchilar</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">5</p>
                  <p className="text-xs text-gray-600">Fakultetlar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form (Compact) */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
              {/* Form Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Tizimga kirish
                </h3>
                <p className="text-sm text-gray-600">
                  HEMIS boshqaruv paneliga xush kelibsiz
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email manzil
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="admin@univer.uz"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Remember & Forgot */}
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
              <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 text-center">
                  <strong>Demo kirish:</strong><br />
                  Email: admin@univer.uz • Parol: istalgan
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-gray-600 text-sm">
              © 2025 HEMIS. Barcha huquqlar himoyalangan.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

