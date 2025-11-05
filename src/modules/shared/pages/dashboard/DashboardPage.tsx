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
      {/* Compact Header - Ko'k: Bilim, ilm-fan */}
      <div className="bg-primary-600 rounded-lg p-4 text-white border-2 border-primary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center border-2 border-primary-800">
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

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Students - Yashil: Muvaffaqiyat, o'sish */}
        <div className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-code-600 border-2 border-code-700 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">Talabalar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_students)}</p>
              <p className="text-xs text-code-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </p>
            </div>
          </div>
        </div>

        {/* Teachers - Ko'k: Bilim, ilm-fan */}
        <div className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-600 border-2 border-primary-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">O'qituvchilar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_teachers)}</p>
              <p className="text-xs text-primary-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5%
              </p>
            </div>
          </div>
        </div>

        {/* Subjects - Binafsha: Ta'lim kurslari, fanlar */}
        <div className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-math-600 border-2 border-math-700 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">Fanlar</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(stats.total_subjects)}</p>
              <p className="text-xs text-math-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8%
              </p>
            </div>
          </div>
        </div>

        {/* Average GPA - Oltin: Yutuq, mukofot */}
        <div className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-philosophy-600 border-2 border-philosophy-700 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">O'rtacha GPA</p>
              <p className="text-xl font-bold text-gray-900">{stats.average_gpa.toFixed(2)}</p>
              <p className="text-xs text-philosophy-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +3%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-primary-600 border-2 border-primary-700 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Informatika</h3>
              <p className="text-primary-100 text-xs">850 talaba</p>
            </div>
          </div>
        </div>

        <div className="bg-pink-600 border-2 border-pink-700 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Tibbiyot</h3>
              <p className="text-pink-100 text-xs">520 talaba</p>
            </div>
          </div>
        </div>

        <div className="bg-math-600 border-2 border-math-700 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Matematika</h3>
              <p className="text-math-100 text-xs">380 talaba</p>
            </div>
          </div>
        </div>

        <div className="bg-code-600 border-2 border-code-700 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Iqtisodiyot</h3>
              <p className="text-code-100 text-xs">445 talaba</p>
            </div>
          </div>
        </div>

        <div className="bg-philosophy-600 border-2 border-philosophy-700 rounded-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Microscope className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Falsafa</h3>
              <p className="text-philosophy-100 text-xs">352 talaba</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Faculty */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-code-600" />
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-code-600" />
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-philosophy-600" />
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
                  className="bg-philosophy-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.attendance_rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-code-600" />
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
                  className="bg-code-600 h-2 rounded-full transition-all"
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