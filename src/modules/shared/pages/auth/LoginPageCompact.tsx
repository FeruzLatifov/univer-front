import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { LogIn, Mail, Lock, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginPageCompact() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HEMIS</h1>
              <p className="text-sm text-blue-100">Universitet Boshqaruv Tizimi</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-10"
                placeholder="email@univer.uz"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parol
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Yuklanmoqda...
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Kirish
              </>
            )}
          </Button>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2">Demo kirish:</p>
            <div className="bg-blue-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Email:</span> admin@univer.uz
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-medium">Parol:</span> password
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <p className="text-xs text-gray-600 text-center">
            © 2024 HEMIS. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </Card>
    </div>
  )
}

