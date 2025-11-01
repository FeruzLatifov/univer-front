import { useQuery } from '@tanstack/react-query'
import {
  Clock,
  Users,
  UsersRound,
  BookOpen,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'
import { getTeacherWorkload, WEEK_DAYS } from '@/lib/api/schedule'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

export default function WorkloadPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher-workload'],
    queryFn: getTeacherWorkload,
  })

  const workload = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error || !workload) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Yuklama ma'lumotlari topilmadi
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate max hours for progress bars
  const maxHoursBySubject = Math.max(
    ...workload.by_subject.map((s) => s.hours),
    1
  )
  const maxHoursByDay = Math.max(
    ...workload.by_week_day.map((d) => d.hours),
    1
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">O'qituvchi yuklamasi</h1>
        <p className="text-muted-foreground mt-1">
          Dars yuklama statistikasi va taqsimoti
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami soatlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{workload.total_hours}</div>
                <p className="text-sm text-muted-foreground">soat/hafta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Fanlar soni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{workload.subjects_count}</div>
                <p className="text-sm text-muted-foreground">ta fan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Guruhlar soni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <UsersRound className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{workload.total_groups}</div>
                <p className="text-sm text-muted-foreground">ta guruh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Talabalar soni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{workload.total_students}</div>
                <p className="text-sm text-muted-foreground">talaba</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Subject */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle>Fanlar bo'yicha yuklama</CardTitle>
            </div>
            <CardDescription>
              Har bir fan bo'yicha haftalik soatlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workload.by_subject.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1 font-medium truncate pr-4">
                      {subject.subject_name}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Badge variant="outline" className="gap-1">
                        <UsersRound className="w-3 h-3" />
                        {subject.groups}
                      </Badge>
                      <span className="font-semibold text-foreground min-w-[60px] text-right">
                        {subject.hours} soat
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(subject.hours / maxHoursBySubject) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Week Day */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>Kunlar bo'yicha taqsimot</CardTitle>
            </div>
            <CardDescription>
              Hafta kunlari bo'yicha dars yuklama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workload.by_week_day.map((day) => {
                const dayInfo = WEEK_DAYS.find((d) => d.id === day.day)
                return (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium min-w-[100px]">
                          {dayInfo?.name}
                        </span>
                        <Badge variant="secondary">
                          {day.lessons} ta dars
                        </Badge>
                      </div>
                      <span className="font-semibold min-w-[60px] text-right">
                        {day.hours} soat
                      </span>
                    </div>
                    <Progress
                      value={(day.hours / maxHoursByDay) * 100}
                      className="h-2"
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              O'rtacha yuklama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workload.by_week_day.length > 0
                ? (
                    workload.by_week_day.reduce((sum, d) => sum + d.hours, 0) /
                    workload.by_week_day.filter((d) => d.hours > 0).length
                  ).toFixed(1)
                : 0}{' '}
              soat
            </div>
            <p className="text-sm text-muted-foreground mt-1">Kunlik o'rtacha</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="w-4 h-4 text-muted-foreground" />
              Eng yuklangan kun
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workload.by_week_day.length > 0 && (
              <>
                <div className="text-2xl font-bold">
                  {
                    WEEK_DAYS.find(
                      (d) =>
                        d.id ===
                        workload.by_week_day.reduce((max, day) =>
                          day.hours > max.hours ? day : max
                        ).day
                    )?.name
                  }
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.max(...workload.by_week_day.map((d) => d.hours))} soat
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              O'rtacha guruh hajmi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workload.total_groups > 0
                ? (workload.total_students / workload.total_groups).toFixed(0)
                : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              talaba/guruh
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Yuklama haqida</h3>
              <p className="text-sm text-muted-foreground">
                Bu sahifada sizning haftalik dars yuklamangiz, fanlar va guruhlar soni,
                hamda kunlar bo'yicha yuklama taqsimoti ko'rsatilgan. Yuklamangizni
                muvozanatlash uchun bu ma'lumotlardan foydalaning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
