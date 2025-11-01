import { useEffect } from 'react'
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, TrendingDown, Calendar, Award, Microscope, Calculator, Code, Brain, Stethoscope } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { mockDashboardStats, mockStudentsByFaculty, mockStudentsByCourse, mockGPADistribution, mockPaymentStats } from '@/lib/mockData'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { setPageMeta, PAGE_META } from '@/utils/favicon'

export default function DashboardPage() {
  const stats = mockDashboardStats

  // Set page meta (title & favicon)
  useEffect(() => {
    setPageMeta(PAGE_META.dashboard)
  }, [])

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

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Students */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">Talabalar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_students)}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </p>
            </div>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">O'qituvchilar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_teachers)}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5%
              </p>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">Fanlar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_subjects)}</p>
              <p className="text-xs text-purple-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8%
              </p>
            </div>
          </div>
        </div>
              Majburiy: <span className="font-semibold text-purple-600">215</span>
            </p>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">O'rtacha GPA</p>
              <p className="text-xl font-bold text-gray-900">{stats.average_gpa.toFixed(2)}</p>
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +3%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Faculty Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Informatika</h3>
              <p className="text-blue-100 text-xs">850 talaba</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Stethoscope className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Tibbiyot</h3>
              <p className="text-pink-100 text-sm">520 talaba</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Matematika</h3>
              <p className="text-purple-100 text-sm">380 talaba</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Iqtisodiyot</h3>
              <p className="text-green-100 text-sm">445 talaba</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Microscope className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Falsafa</h3>
              <p className="text-orange-100 text-sm">352 talaba</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Faculty */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Talabalar fakultetlar bo'yicha
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockStudentsByFaculty}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {mockStudentsByFaculty.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Students by Course */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Talabalar kurslar bo'yicha
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockStudentsByCourse}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Davomat nazorati
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Umumiy davomat</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.attendance_rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.attendance_rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              To'lovlar hisoboti
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">To'lov foizi</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.payment_rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.payment_rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}