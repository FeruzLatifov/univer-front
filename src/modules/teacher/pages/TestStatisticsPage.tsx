import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, TrendingUp, Clock, Award, BarChart3, PieChart } from 'lucide-react'
import { useTest, useTestResults } from '@/hooks/useTests'
import { getTestStatistics } from '@/lib/api/tests'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

export default function TestStatisticsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const testId = Number(id)

  const { data: testData } = useTest(testId)

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['test-statistics', testId],
    queryFn: () => getTestStatistics(testId),
  })

  const { data: resultsData } = useTestResults(testId)

  const test = testData?.data
  const stats = statsData?.data
  const results = resultsData?.data || []

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/tests')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{test?.name}</h1>
            <p className="text-muted-foreground mt-1">
              Test statistikasi va natijalar tahlili
            </p>
          </div>
          <Button onClick={() => navigate(`/teacher/tests/${testId}/results`)}>
            Batafsil natijalar
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami urinishlar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_attempts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.finished_attempts || 0} ta tugallangan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha ball</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avg_score?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.max_score?.toFixed(0) || 0}% maksimal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'tish foizi</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pass_rate?.toFixed(1) || 0}%
            </div>
            <Progress value={stats?.pass_rate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha vaqt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((stats?.avg_duration || 0) / 60)} daq
            </div>
            <p className="text-xs text-muted-foreground">
              {test?.duration} daqiqadan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Balllar taqsimoti
            </CardTitle>
            <CardDescription>
              Talabalar natijalari bo'yicha taqsimot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.score_distribution || {}).map(([range, count]: [string, any]) => {
                const total = stats?.finished_attempts || 1
                const percentage = (count / total) * 100

                return (
                  <div key={range} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{range}%</span>
                      <span className="text-muted-foreground">
                        {count} talaba ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Test Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Test ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Savollar soni</span>
                <Badge variant="outline">{stats?.total_questions || 0}</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Jami ball</span>
                <Badge variant="outline">{stats?.total_points || 0}</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">O'tish balli</span>
                <Badge variant="secondary">{test?.passing_score}%</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Maksimal urinishlar</span>
                <Badge>{test?.max_attempts}</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Davomiylik</span>
                <Badge>{test?.duration} daqiqa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>So'nggi natijalar</CardTitle>
          <CardDescription>
            Oxirgi 10 ta tugallangan urinish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.slice(0, 10).map((result: any) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                    {result.student?.first_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{result.student?.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(result.created_at).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {result.correct_answers?.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor((result.duration || 0) / 60)} daqiqa
                    </div>
                  </div>
                  <Badge
                    variant={
                      result.correct_answers >= (test?.passing_score || 70)
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {result.correct_answers >= (test?.passing_score || 70)
                      ? "O'tdi"
                      : "O'tmadi"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
