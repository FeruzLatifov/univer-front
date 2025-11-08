import { useQuery } from '@tanstack/react-query'
import { getStudentGPA } from '@/lib/api/student'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, Award, Target, BarChart3 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { StudentGPAResponse, SemesterGPA, SubjectGPA } from '@/lib/types/student'

export default function StudentGPADetailPage() {
  const { data: gpaData, isLoading } = useQuery<StudentGPAResponse>({
    queryKey: ['student', 'gpa'],
    queryFn: () => getStudentGPA(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const currentGPA = gpaData?.data.current_gpa ?? 0
  const cumulativeGPA = gpaData?.data.cumulative_gpa ?? 0
  const semesterGPAs = gpaData?.data.semesters ?? []
  const subjectGPAs = gpaData?.data.subjects ?? []
  const gradeDistribution = gpaData?.data.grade_distribution ?? {}

  // Get GPA color based on value
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get GPA badge
  const getGPABadge = (gpa: number) => {
    if (gpa >= 3.5) return <Badge className="bg-green-600">A'lo</Badge>
    if (gpa >= 3.0) return <Badge className="bg-blue-600">Yaxshi</Badge>
    if (gpa >= 2.5) return <Badge className="bg-yellow-600">Qoniqarli</Badge>
    return <Badge variant="destructive">Qoniqarsiz</Badge>
  }

  // Prepare chart data for semester trend
  const semesterTrendData = semesterGPAs.map((semester) => ({
    name: semester.name || `${semester.code}-sem`,
    GPA: parseFloat(semester.gpa || 0),
    'O\'rtacha': parseFloat(semester.average || 0),
  }))

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">GPA Tafsilotlari</h1>
        <p className="text-gray-600">Grade Point Average (GPA) tahlili va statistikasi</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umumiy GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGPAColor(cumulativeGPA)}`}>
              {cumulativeGPA.toFixed(2)}
            </div>
            <div className="mt-2">{getGPABadge(cumulativeGPA)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joriy GPA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGPAColor(currentGPA)}`}>
              {currentGPA.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Hozirgi semestr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eng yuqori</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {semesterGPAs.length > 0
                ? Math.max(...semesterGPAs.map((s) => parseFloat(s.gpa || '0'))).toFixed(2)
                : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Maksimal GPA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semestrlar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{semesterGPAs.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Jami semestrlar</p>
          </CardContent>
        </Card>
      </div>

      {/* GPA Trend Chart */}
      {semesterTrendData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>GPA Dinamikasi</CardTitle>
            <CardDescription>Semestrlar bo'yicha GPA o'zgarishi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={semesterTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="GPA"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Mening GPA"
                />
                {semesterTrendData[0]?.['O\'rtacha'] && (
                  <Line
                    type="monotone"
                    dataKey="O'rtacha"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Guruh o'rtachasi"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Semester GPA Details */}
      {semesterGPAs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Semestrlar bo'yicha GPA</CardTitle>
            <CardDescription>Har bir semestr uchun batafsil ma'lumot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {semesterGPAs.map((semester: SemesterGPA, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-semibold">{semester.name || `${semester.code}-semestr`}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">
                        {semester.subjects_count || 0} ta fan
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-600">
                        {semester.credits || 0} kredit
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getGPAColor(parseFloat(semester.gpa || '0'))}`}>
                      {parseFloat(semester.gpa || '0').toFixed(2)}
                    </div>
                    <div className="mt-1">{getGPABadge(parseFloat(semester.gpa || 0))}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject-wise GPA */}
      {subjectGPAs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fanlar bo'yicha natijalar</CardTitle>
            <CardDescription>Har bir fan uchun o'rtacha ball</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectGPAs.slice(0, 10).map((subject: SubjectGPA, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-gray-500">{subject.code}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{subject.grade || '-'}</p>
                      <p className="text-sm text-gray-500">{subject.credits || 0} kr</p>
                    </div>
                    <div className={`text-xl font-bold ${getGPAColor(parseFloat(subject.point || 0))}`}>
                      {parseFloat(subject.point || 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {subjectGPAs.length > 10 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                ... va yana {subjectGPAs.length - 10} ta fan
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grade Distribution */}
      {Object.keys(gradeDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Baholar taqsimoti</CardTitle>
            <CardDescription>Olingan baholar statistikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-600 mt-1">Baho: {grade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {semesterGPAs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">GPA ma'lumotlari topilmadi</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
