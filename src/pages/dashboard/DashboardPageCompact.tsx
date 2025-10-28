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
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
    },
    {
      label: "O'qituvchilar",
      value: formatNumber(stats.total_teachers),
      trend: '+5%',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
    },
    {
      label: 'Fanlar',
      value: formatNumber(stats.total_subjects),
      trend: '+8%',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      textColor: 'text-purple-600',
    },
    {
      label: "O'rtacha GPA",
      value: stats.average_gpa.toFixed(2),
      trend: '+3%',
      icon: Award,
      color: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-600',
    },
  ]

  const faculties = [
    { name: 'Informatika', count: 850, icon: Code, color: 'from-blue-500 to-blue-600' },
    { name: 'Tibbiyot', count: 520, icon: Stethoscope, color: 'from-pink-500 to-pink-600' },
    { name: 'Matematika', count: 380, icon: Calculator, color: 'from-purple-500 to-purple-600' },
    { name: 'Iqtisodiyot', count: 445, icon: Brain, color: 'from-green-500 to-green-600' },
    { name: 'Falsafa', count: 352, icon: Microscope, color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Boshqaruv Paneli</h1>
              <p className="text-sm text-blue-100">2024-2025 o'quv yili</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-blue-100">{new Date().toLocaleDateString('uz-UZ')}</p>
          </div>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
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

      {/* Compact Faculty Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Fakultetlar bo'yicha</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {faculties.map((faculty, index) => {
            const Icon = faculty.icon
            return (
              <div key={index} className={`bg-gradient-to-br ${faculty.color} rounded-lg p-3 text-white hover:shadow-lg transition-shadow cursor-pointer`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{faculty.name}</h3>
                    <p className="text-xs opacity-90">{faculty.count} talaba</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Talabalar</p>
              <p className="text-xs text-gray-600">Boshqarish</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Baholash</p>
              <p className="text-xs text-gray-600">Akademik</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Xodimlar</p>
              <p className="text-xs text-gray-600">Ro'yxat</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <Award className="w-5 h-5 text-orange-600" />
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

