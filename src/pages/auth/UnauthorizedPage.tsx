import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Kirish taqiqlangan
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            Sizning rollingiz ushbu sahifaga kirish huquqiga ega emas.
            Agar bu xato deb hisoblasangiz, administrator bilan bog'laning.
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span>Bosh sahifa</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Savol yoki muammo bo'lsa, administrator bilan bog'laning
        </div>
      </div>
    </div>
  )
}
