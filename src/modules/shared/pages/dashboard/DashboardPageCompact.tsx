import { Users, GraduationCap, BookOpen, Award, TrendingUp, Code, Stethoscope, Calculator, Brain, Microscope } from 'lucide-react'
import { mockDashboardStats } from '@/lib/mockData'
import { formatNumber } from '@/lib/utils'

export default function DashboardPageCompact() {
  const stats = mockDashboardStats

  const mainStats = [
    {
      label: 'Talabalar',
      value: formatNumber(stats.total_students),
      trend: '+12%',
      icon: GraduationCap,
      color: 'code-600',
      borderColor: 'code-700',
      textColor: 'text-code-600',
    },
    {
      label: "O'qituvchilar",
      value: formatNumber(stats.total_teachers),
      trend: '+5%',
      icon: Users,
      color: 'primary-600',
      borderColor: 'primary-700',
      textColor: 'text-primary-600',
    },
    {
      label: 'Fanlar',
      value: formatNumber(stats.total_subjects),
      trend: '+8%',
      icon: BookOpen,
      color: 'math-600',
      borderColor: 'math-700',
      textColor: 'text-math-600',
    },
    {
      label: "O'rtacha GPA",
      value: stats.average_gpa.toFixed(2),
      trend: '+3%',
      icon: Award,
      color: 'philosophy-600',
      borderColor: 'philosophy-700',
      textColor: 'text-philosophy-600',
    },
  ]

  const faculties = [
    { name: 'Informatika', count: 850, icon: Code, color: 'primary-600', borderColor: 'primary-700', textColor: 'primary-100' },
    { name: 'Tibbiyot', count: 520, icon: Stethoscope, color: 'pink-600', borderColor: 'pink-700', textColor: 'pink-100' },
    { name: 'Matematika', count: 380, icon: Calculator, color: 'math-600', borderColor: 'math-700', textColor: 'math-100' },
    { name: 'Iqtisodiyot', count: 445, icon: Brain, color: 'code-600', borderColor: 'code-700', textColor: 'code-100' },
    { name: 'Falsafa', count: 352, icon: Microscope, color: 'philosophy-600', borderColor: 'philosophy-700', textColor: 'philosophy-100' },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header - Ko'k: Bilim, ilm-fan */}
      <div className="bg-primary-600 border-2 border-primary-700 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-700 border-2 border-primary-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Boshqaruv Paneli</h1>
              <p className="text-sm text-primary-100">2024-2025 o'quv yili</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-primary-100">{new Date().toLocaleDateString('uz-UZ')}</p>
          </div>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color} border-2 border-${stat.borderColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs ${stat.textColor} flex items-center gap-1`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Faculty Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Fakultetlar bo'yicha</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {faculties.map((faculty, index) => {
            const Icon = faculty.icon
            return (
              <div key={index} className={`bg-${faculty.color} border-2 border-${faculty.borderColor} rounded-lg p-3 text-white hover:shadow-lg transition-shadow cursor-pointer`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{faculty.name}</h3>
                    <p className={`text-xs text-${faculty.textColor}`}>{faculty.count} talaba</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-code-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-code-50 rounded-lg flex items-center justify-center group-hover:bg-code-100 transition-colors">
              <GraduationCap className="w-5 h-5 text-code-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Talabalar</p>
              <p className="text-xs text-gray-600">Boshqarish</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-math-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-math-50 rounded-lg flex items-center justify-center group-hover:bg-math-100 transition-colors">
              <BookOpen className="w-5 h-5 text-math-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Baholash</p>
              <p className="text-xs text-gray-600">Akademik</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-primary-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Xodimlar</p>
              <p className="text-xs text-gray-600">Ro'yxat</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-philosophy-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-philosophy-50 rounded-lg flex items-center justify-center group-hover:bg-philosophy-100 transition-colors">
              <Award className="w-5 h-5 text-philosophy-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Hisobotlar</p>
              <p className="text-xs text-gray-600">Statistika</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

