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
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: "O'qituvchilar",
      value: formatNumber(stats.total_teachers),
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Fanlar',
      value: formatNumber(stats.total_subjects),
      change: '+8%',
      trend: 'up',
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: "O'rtacha GPA",
      value: stats.average_gpa.toFixed(2),
      change: '+3%',
      trend: 'up',
      icon: Award,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ]

  // Today's summary
  const todayStats = [
    { label: 'Bugungi darslar', value: '128', icon: Calendar, color: 'text-blue-600' },
    { label: 'Davomat: Qatnashdi', value: '2,345', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Davomat: Kelmadi', value: '87', icon: AlertCircle, color: 'text-red-600' },
    { label: 'Yangi topshiriqlar', value: '24', icon: FileText, color: 'text-purple-600' },
  ]

  // Recent activities
  const recentActivities = [
    {
      type: 'enrollment',
      text: '45 ta yangi talaba qabul qilindi',
      time: '30 daqiqa oldin',
      icon: GraduationCap,
      color: 'bg-green-50 text-green-600',
    },
    {
      type: 'decree',
      text: 'Buyruq #125 tasdiqlandi',
      time: '1 soat oldin',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      type: 'performance',
      text: '15 ta baholar yangilandi',
      time: '2 soat oldin',
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      type: 'payment',
      text: "12 ta to'lov tasdiqlandi",
      time: '3 soat oldin',
      icon: DollarSign,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  // Performance overview
  const performanceData = [
    { label: 'A (A\'lo)', count: 450, percent: 35, color: 'bg-green-500' },
    { label: 'B (Yaxshi)', count: 580, percent: 45, color: 'bg-blue-500' },
    { label: 'C (Qoniqarli)', count: 200, percent: 15, color: 'bg-yellow-500' },
    { label: 'D/F (Qoniqarsiz)', count: 65, percent: 5, color: 'bg-red-500' },
  ]

  // Pending tasks
  const pendingTasks = [
    { title: 'Buyruqlar tasdiqlanishi kerak', count: 5, link: '/decrees', color: 'text-red-600' },
    { title: "Ko'chirishlar kutilmoqda", count: 8, link: '/transfers', color: 'text-yellow-600' },
    { title: 'Baholar kiritilmagan', count: 12, link: '/performance', color: 'text-orange-600' },
    { title: "To'lovlar tekshirilishi kerak", count: 3, link: '/finance', color: 'text-blue-600' },
  ]

  // Quick actions
  const quickActions = [
    { title: 'Yangi talaba', link: '/students', icon: GraduationCap, color: 'from-green-500 to-emerald-600' },
    { title: 'Yangi buyruq', link: '/decrees', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { title: 'Baholar kiritish', link: '/performance', icon: Award, color: 'from-purple-500 to-violet-600' },
    { title: 'Hisobot yaratish', link: '/reports', icon: Activity, color: 'from-orange-500 to-amber-600' },
  ]

  return (
    <div className="p-3 space-y-3">
      {/* Ultra-Dense Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2.5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold">Boshqaruv Paneli</h1>
              <p className="text-[11px] text-blue-100">
                {new Date().toLocaleDateString('uz-UZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold">2024-2025 o'quv yili</p>
            <p className="text-[11px] text-blue-100">1-semestr</p>
          </div>
        </div>
      </div>

      {/* Main Stats - 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[11px] font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-0.5`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-600">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: 2/3 */}
        <div className="lg:col-span-2 space-y-3">
          {/* Today's Stats */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Bugungi holat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {todayStats.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                    <div>
                      <p className="text-base font-bold text-gray-900">{item.value}</p>
                      <p className="text-[10px] text-gray-600 leading-tight">{item.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Performance Overview */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900">Akademik ko'rsatkichlar</h2>
              <Link to="/performance" className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Batafsil <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">So'nggi faoliyat</h2>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`w-7 h-7 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900">{activity.text}</p>
                      <p className="text-[10px] text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Quick Access Table - Top Students */}
          <Card className="p-3">
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
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {student.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                            </div>
                            <span className="text-gray-900 font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <Badge className="bg-purple-50 text-purple-700 text-[10px]">
                            {student.group}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-5 bg-green-50 text-green-700 rounded font-bold text-[11px] px-1.5">
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: 1/3 */}
        <div className="space-y-3">
          {/* Pending Tasks */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Vazifalar
              <Badge className="ml-2 bg-red-100 text-red-700 text-[10px]">
                {pendingTasks.reduce((sum, task) => sum + task.count, 0)}
              </Badge>
            </h2>
            <div className="space-y-2">
              {pendingTasks.map((task, index) => (
                <Link
                  key={index}
                  to={task.link}
                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-900 group-hover:text-blue-700">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${task.color} bg-opacity-10 text-[11px] font-bold`}>
                      {task.count}
                    </Badge>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Tez amallar</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex flex-col items-center gap-1.5 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[11px] text-gray-700 text-center leading-tight">
                      {action.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Moliyaviy holat
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-xs text-gray-700">To'langan</span>
                <span className="text-xs font-bold text-green-700">85%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="text-xs text-gray-700">Qisman to'langan</span>
                <span className="text-xs font-bold text-yellow-700">12%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <span className="text-xs text-gray-700">Qarzdorlar</span>
                <span className="text-xs font-bold text-red-700">3%</span>
              </div>
            </div>
            <Link
              to="/finance"
              className="mt-2 w-full flex items-center justify-center gap-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-[11px]"
            >
              Batafsil ko'rish
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          {/* Attendance Summary */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Davomat (haftalik)</h2>
            <div className="space-y-1.5">
              {['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'].map((day, index) => {
                const attendance = 92 - index * 2
                return (
                  <div key={day}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-gray-700">{day}</span>
                      <span className="text-[11px] font-semibold text-gray-900">{attendance}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          attendance >= 90
                            ? 'bg-green-500'
                            : attendance >= 80
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${attendance}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: System Status */}
      <Card className="p-2.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] text-gray-700">Sistema ishlayapti</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-[11px] text-gray-700">Oxirgi sinxronizatsiya: 5 daqiqa oldin</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-3 h-3 text-gray-500" />
            <span className="text-[11px] text-gray-700">Faol foydalanuvchilar: 45</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-gray-500" />
            <span className="text-[11px] text-gray-700">Tizim yuklangan: 23%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

