import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  Award,
  Calendar,
  BookOpen,
  PieChart
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { teacherSubjectService } from '@/services/teacher/SubjectService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

type ReportType = 'overview' | 'attendance' | 'grades'

export default function ReportsPage() {
  const { t } = useTranslation()
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [reportType, setReportType] = useState<ReportType>('overview')

  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: () => teacherSubjectService.getSubjects({ per_page: 100 }),
  })

  const subjects = subjectsData?.data || []

  // Mock data for demonstration
  const mockData = {
    totalStudents: 120,
    averageAttendance: 87.5,
    averageGrade: 78.3,
    totalLessons: 45,
    completedTopics: 12,
    totalTopics: 15,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hisobotlar</h1>
          <p className="text-muted-foreground mt-1">
            Umumiy hisobotlar va statistika
          </p>
        </div>
        <Button variant="outline" disabled>
          <Download className="w-4 h-4 mr-2" />
          PDF yuklab olish
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fan</label>
              <Select
                value={selectedSubject?.toString()}
                onValueChange={(value) => setSelectedSubject(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fanni tanlang yoki umumiy ko'ring" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fanlar</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {t(subject, 'name')} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hisobot turi</label>
              <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Umumiy ko'rinish</SelectItem>
                  <SelectItem value="attendance">Davomat hisoboti</SelectItem>
                  <SelectItem value="grades">Baholar hisoboti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami talabalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{mockData.totalStudents}</div>
                <p className="text-sm text-muted-foreground">Talaba</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'rtacha davomat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{mockData.averageAttendance}%</div>
                <p className="text-sm text-muted-foreground">Davomat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'rtacha baho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{mockData.averageGrade}</div>
                <p className="text-sm text-muted-foreground">Ball</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'tilgan mavzular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {mockData.completedTopics}/{mockData.totalTopics}
                </div>
                <p className="text-sm text-muted-foreground">Mavzu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="attendance">Davomat</TabsTrigger>
          <TabsTrigger value="grades">Baholar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Dars jarayoni
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>O'tilgan mavzular</span>
                    <span className="font-semibold">
                      {mockData.completedTopics} / {mockData.totalTopics}
                    </span>
                  </div>
                  <Progress
                    value={(mockData.completedTopics / mockData.totalTopics) * 100}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>O'tkazilgan darslar</span>
                    <span className="font-semibold">{mockData.totalLessons}</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Talabalar ko'rsatkichi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Davomat ko'rsatkichi</span>
                    <span className="font-semibold">{mockData.averageAttendance}%</span>
                  </div>
                  <Progress value={mockData.averageAttendance} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>O'zlashtirish darajasi</span>
                    <span className="font-semibold">{mockData.averageGrade}%</span>
                  </div>
                  <Progress value={mockData.averageGrade} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Davomat hisoboti</CardTitle>
              <CardDescription>Talabalar davomat statistikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>Davomat hisoboti tez orada tayyorlanadi</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Baholar hisoboti</CardTitle>
              <CardDescription>Talabalar baholar statistikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p>Baholar hisoboti tez orada tayyorlanadi</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Hisobot haqida</h3>
              <p className="text-sm text-muted-foreground">
                Bu sahifada sizning o'qituvchilik faoliyatingiz bo'yicha umumiy statistika,
                talabalar davomat va baholar hisoboti ko'rsatilgan. Batafsil hisobotlarni
                PDF formatida yuklab olishingiz mumkin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
