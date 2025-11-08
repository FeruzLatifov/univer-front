import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  UserCheck,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { mockDashboardStats, mockStudents } from '@/lib/mockData'
import { formatNumber } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function DashboardUltra() {
  const stats = mockDashboardStats

  // Quick stats
  const mainStats = [
    {
      label: 'Jami Talabalar',
      value: formatNumber(stats.total_students),
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: "O'qituvchilar",
      value: formatNumber(stats.total_teachers),
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Fanlar',
      value: formatNumber(stats.total_subjects),
      change: '+8%',
      trend: 'up',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: "O'rtacha GPA",
      value: stats.average_gpa.toFixed(2),
      change: '+3%',
      trend: 'up',
      icon: Award,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
  ]

  // Today's summary
  const todayStats = [
    { label: 'Bugungi darslar', value: '128', icon: Calendar, color: 'text-gray-700' },
    { label: 'Davomat: Qatnashdi', value: '2,345', icon: CheckCircle, color: 'text-gray-700' },
    { label: 'Davomat: Kelmadi', value: '87', icon: AlertCircle, color: 'text-gray-700' },
    { label: 'Yangi topshiriqlar', value: '24', icon: FileText, color: 'text-gray-700' },
  ]

  // Recent activities
  const recentActivities = [
    {
      type: 'enrollment',
      text: '45 ta yangi talaba qabul qilindi',
      time: '30 daqiqa oldin',
      icon: GraduationCap,
      color: 'bg-gray-100 text-gray-700',
    },
    {
      type: 'decree',
      text: 'Buyruq #125 tasdiqlandi',
      time: '1 soat oldin',
      icon: FileText,
      color: 'bg-gray-100 text-gray-700',
    },
    {
      type: 'performance',
      text: '15 ta baholar yangilandi',
      time: '2 soat oldin',
      icon: Award,
      color: 'bg-gray-100 text-gray-700',
    },
    {
      type: 'payment',
      text: "12 ta to'lov tasdiqlandi",
      time: '3 soat oldin',
      icon: DollarSign,
      color: 'bg-gray-100 text-gray-700',
    },
  ]

  // Performance overview
  const performanceData = [
    { label: 'A (A\'lo)', count: 450, percent: 35, color: 'bg-green-500' },
    { label: 'B (Yaxshi)', count: 580, percent: 45, color: 'bg-blue-500' },
    { label: 'C (Qoniqarli)', count: 200, percent: 15, color: 'bg-amber-500' },
    { label: 'D/F (Qoniqarsiz)', count: 65, percent: 5, color: 'bg-orange-500' },
  ]

  // Pending tasks
  const pendingTasks = [
    { title: 'Buyruqlar tasdiqlanishi kerak', count: 5, link: '/decrees', color: 'text-gray-700' },
    { title: "Ko'chirishlar kutilmoqda", count: 8, link: '/transfers', color: 'text-gray-700' },
    { title: 'Baholar kiritilmagan', count: 12, link: '/performance', color: 'text-gray-700' },
    { title: "To'lovlar tekshirilishi kerak", count: 3, link: '/finance', color: 'text-gray-700' },
  ]

  // Quick actions
  const quickActions = [
    { title: 'Yangi talaba', link: '/students', icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
    { title: 'Yangi buyruq', link: '/decrees', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { title: 'Baholar kiritish', link: '/performance', icon: Award, color: 'from-blue-500 to-blue-600' },
    { title: 'Hisobot yaratish', link: '/reports', icon: Activity, color: 'from-blue-500 to-blue-600' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-page">Boshqaruv Paneli</h1>
          <p className="text-caption">
            {new Date().toLocaleDateString('uz-UZ', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>2024-2025 o'quv yili</p>
          <p className="text-caption">1-semestr</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card-professional">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--active-bg)', color: 'var(--primary)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-orange-600'} flex items-center gap-0.5`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-caption">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 space-y-4">
          {/* Today's Stats */}
          <div className="card-professional">
            <h2 className="heading-panel mb-3">Bugungi holat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {todayStats.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--app-bg)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card-professional">
            <div className="flex items-center justify-between mb-3">
              <h2 className="heading-panel">Akademik ko'rsatkichlar</h2>
              <Link to="/performance" className="text-sm font-medium hover:underline flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                Batafsil <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-bg)' }}>
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-professional">
            <h2 className="heading-panel mb-3">So'nggi faoliyat</h2>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--active-bg)', color: 'var(--primary)' }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{activity.text}</p>
                      <p className="text-caption">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Access Table - Top Students */}
          <div className="card-professional">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900">Eng yaxshi talabalar (GPA)</h2>
              <Link to="/students" className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Barchasi <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-dense">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-gray-600">#</th>
                    <th className="text-left text-gray-600">Talaba</th>
                    <th className="text-left text-gray-600">Guruh</th>
                    <th className="text-center text-gray-600">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents
                    .filter(s => s && s.name && s.gpa)
                    .sort((a, b) => b.gpa - a.gpa)
                    .slice(0, 5)
                    .map((student, index) => (
                      <tr key={student.id}>
                        <td>
                          <span className="text-gray-500 font-medium">{index + 1}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {student.name?.split(' ').map((n: string) => n[0]).join('') || 'N/A'}
                            </div>
                            <span className="text-gray-900 font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <Badge className="bg-gray-100 text-gray-700 text-[10px]">
                            {typeof student.group === 'string' ? student.group : student.group?.name || '—'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-5 bg-blue-50 text-blue-700 rounded font-bold text-[11px] px-1.5">
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="card-professional">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="heading-panel">Vazifalar</h2>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--active-bg)', color: 'var(--primary)' }}>
                {pendingTasks.reduce((sum, task) => sum + task.count, 0)}
              </span>
            </div>
            <div className="space-y-2">
              {pendingTasks.map((task, index) => (
                <Link
                  key={index}
                  to={task.link}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded text-sm font-bold" style={{ backgroundColor: 'var(--active-bg)', color: 'var(--primary)' }}>
                      {task.count}
                    </span>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card-professional">
            <h2 className="heading-panel mb-3">Tez amallar</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--active-bg)', color: 'var(--primary)' }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-center font-medium" style={{ color: 'var(--text-primary)' }}>
                      {action.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="card-professional">
            <h2 className="heading-panel mb-3">Moliyaviy holat</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>To'langan</span>
                <span className="text-sm font-bold text-green-700">85%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(242, 201, 76, 0.1)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Qisman to'langan</span>
                <span className="text-sm font-bold text-amber-700">12%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(235, 87, 87, 0.1)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Qarzdorlar</span>
                <span className="text-sm font-bold text-red-700">3%</span>
              </div>
            </div>
            <Link
              to="/finance"
              className="mt-3 btn-primary w-full flex items-center justify-center gap-2"
            >
              Batafsil ko'rish
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Attendance Summary */}
          <div className="card-professional">
            <h2 className="heading-panel mb-3">Haftalik davomat</h2>
            <div className="space-y-3">
              {['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'].map((day, index) => {
                const attendance = 92 - index * 2
                return (
                  <div key={day}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{day}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{attendance}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-bg)' }}>
                      <div
                        className={`h-full transition-all ${
                          attendance >= 90
                            ? 'bg-green-500'
                            : attendance >= 80
                            ? 'bg-amber-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${attendance}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: System Status */}
      <div className="card-professional">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success)' }}></div>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Sistema ishlayapti</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Sinxronizatsiya: 5 daq. oldin</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Faol: 45</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Yuklangan: 23%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

