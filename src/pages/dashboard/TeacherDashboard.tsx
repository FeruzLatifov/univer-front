import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  BarChart3,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { setPageMeta, PAGE_META } from '@/utils/favicon'
import { useAuthStore } from '@/stores/authStore'
import { getDashboard, type DashboardData, type TodayClass } from '@/lib/api/teacher'

interface QuickStatCard {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPageMeta(PAGE_META.dashboard)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // getDashboard() returns unwrapped data directly
      const data = await getDashboard()

      if (data) {
        setDashboardData(data)
      } else {
        setError('Ma\'lumot yuklanmadi')
      }
    } catch (err: any) {
      console.error('Dashboard yuklanmadi:', err)
      setError(err.response?.data?.message || err.message || 'Server bilan bog\'lanishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Xatolik yuz berdi</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  const { summary, today_schedule, pending_attendance_classes, quick_stats } = dashboardData

  const quickStats: QuickStatCard[] = [
    {
      title: 'Jami talabalar',
      value: summary.total_students,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Jami fanlar',
      value: summary.total_subjects,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Jami guruhlar',
      value: summary.total_groups,
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">O'qituvchi Boshqaruv Paneli</h1>
              <p className="text-blue-100 text-sm mt-1">
                Xush kelibsiz, {user?.full_name || "O'qituvchi"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">2024-2025 o'quv yili</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleDateString('uz-UZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-5 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Today's Classes & Pending Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Today's Classes */}
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Bugungi darslar</h2>
                <p className="text-xs text-gray-500">{today_schedule.day_name}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              {summary.today_classes}
            </span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {today_schedule.classes.length > 0 ? (
              today_schedule.classes.map((classItem: TodayClass, index: number) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() => navigate(`/teacher/subjects/${classItem.subject.id}`)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {classItem.subject.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          {classItem.group.name}
                        </span>
                        {classItem.time.start && (
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {classItem.time.start}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{classItem.subject.code}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Bugun darslar yo'q</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pending Attendance */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 shadow-lg border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">Davomat qilinmagan</h2>
                <p className="text-xs text-red-600">Oxirgi 30 kun</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
              {summary.pending_attendance}
            </span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {pending_attendance_classes && pending_attendance_classes.length > 0 ? (
              <>
                {pending_attendance_classes.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-red-200 rounded-lg p-3 hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate(`/teacher/attendance?schedule=${item.id}`)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-red-600 truncate">
                            {item.subject.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.group.name}
                          </span>
                          <span className="text-red-600 font-medium">
                            {Math.floor(item.days_ago)} kun
                          </span>
                          <span className="text-gray-500 truncate">{item.subject.code}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-red-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}

                {summary.pending_attendance > pending_attendance_classes.length && (
                  <button
                    onClick={() => navigate('/teacher/attendance')}
                    className="w-full py-2 text-sm text-red-700 hover:text-red-900 font-semibold transition-colors bg-white rounded-lg border border-red-200 hover:border-red-300"
                  >
                    Barchasi →
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Barcha darslar davomat qilingan ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Haftalik darslar</p>
              <p className="text-2xl font-bold text-green-600">{summary.weekly_classes}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Davomat ko'rsatkichi</p>
              <p className="text-2xl font-bold text-blue-600">{quick_stats.attendance_rate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {summary.pending_assignments > 0 && (
          <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Baholanmagan</p>
                <p className="text-2xl font-bold text-orange-600">{summary.pending_assignments}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Tez harakatlar</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/teacher/schedule')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left group"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Dars jadvali</h3>
            <p className="text-sm text-gray-600">Haftalik jadval ko'rish</p>
          </button>

          <button
            onClick={() => navigate('/teacher/attendance')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left group"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Davomat</h3>
            <p className="text-sm text-gray-600">Davomat belgilash</p>
          </button>

          <button
            onClick={() => navigate('/teacher/grades')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left group"
          >
            <FileText className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Baholar</h3>
            <p className="text-sm text-gray-600">Baholar kiritish</p>
          </button>

          <button
            onClick={() => navigate('/teacher/subjects')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left group"
          >
            <BookOpen className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Fanlarim</h3>
            <p className="text-sm text-gray-600">O'qitayotgan fanlar</p>
          </button>
        </div>
      </div>
    </div>
  )
}
