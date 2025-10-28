import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, FileText, Banknote, Calculator, Stethoscope, Award, Users, BookOpen } from 'lucide-react'
import { mockPaymentStats, mockContractStats } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

export default function FinancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Banknote className="w-10 h-10" />
              Moliya boshqaruvi
            </h1>
            <p className="text-pink-100 text-lg">
              To'lovlar, shartnomalar va moliyaviy hisobotlar
            </p>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>To'lovlar: 2,547 ta</span>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span>Shartnomalar: 1,234 ta</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calculator className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Jami daromad</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(125000000)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">To'langan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(98000000)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Qarz</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(27000000)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">To'lov foizi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">78.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Informatika</h3>
              <p className="text-blue-100 text-sm">{formatCurrency(45000000)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Stethoscope className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Tibbiyot</h3>
              <p className="text-pink-100 text-sm">{formatCurrency(38000000)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Matematika</h3>
              <p className="text-purple-100 text-sm">{formatCurrency(25000000)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Iqtisodiyot</h3>
              <p className="text-green-100 text-sm">{formatCurrency(32000000)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Falsafa</h3>
              <p className="text-orange-100 text-sm">{formatCurrency(18000000)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tezkor amallar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">To'lov qabul qilish</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yangi to'lov kiritish</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Shartnoma yaratish</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yangi shartnoma</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Receipt className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Hisobot yaratish</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Moliyaviy hisobot</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}