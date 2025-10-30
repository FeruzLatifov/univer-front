import { useNavigate } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'

/**
 * 404 Not Found Page
 * Shows when:
 * 1. Page truly doesn't exist
 * 2. User doesn't have permission (security: hide existence)
 */
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <FileQuestion className="relative w-24 h-24 text-blue-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-slate-900 mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-3">
          Sahifa topilmadi
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Orqaga qaytish
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Bosh sahifa
          </button>
        </div>

        {/* Hint */}
        <p className="mt-8 text-sm text-slate-500">
          Agar muammo davom etsa, administrator bilan bog'laning
        </p>
      </div>
    </div>
  )
}
