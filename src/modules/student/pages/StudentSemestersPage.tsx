import { useQuery } from '@tanstack/react-query'
import { getStudentSemesters } from '@/lib/api/student'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, BookOpen, TrendingUp, Clock } from 'lucide-react'

export default function StudentSemestersPage() {
  const { data: semesters, isLoading } = useQuery({
    queryKey: ['student', 'semesters'],
    queryFn: () => getStudentSemesters(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const semesterList = semesters?.data || []

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Semestrlar</h1>
        <p className="text-gray-600">O'quv semestrlari va akademik kalendar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami semestrlar</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesterList.length}</div>
            <p className="text-xs text-muted-foreground">O'quv semestrlari</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joriy semestr</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {semesterList.find((s: any) => s.is_current)?.name || '-'}
            </div>
            <p className="text-xs text-muted-foreground">Hozirgi o'quv semestri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {semesterList.length > 0
                ? (
                    semesterList.reduce((acc: number, s: any) => acc + (s.gpa || 0), 0) /
                    semesterList.length
                  ).toFixed(2)
                : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Barcha semestrlar bo'yicha</p>
          </CardContent>
        </Card>
      </div>

      {/* Semesters List */}
      <div className="space-y-4">
        {semesterList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">Hozircha semestrlar ma'lumoti yo'q</p>
            </CardContent>
          </Card>
        ) : (
          semesterList.map((semester: any) => (
            <Card key={semester.id || semester.code} className={semester.is_current ? 'border-blue-500 border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {semester.name || `${semester.code}-semestr`}
                      {semester.is_current && (
                        <Badge variant="default">Joriy semestr</Badge>
                      )}
                      {semester.status === 'completed' && (
                        <Badge variant="secondary">Tugallangan</Badge>
                      )}
                      {semester.status === 'upcoming' && (
                        <Badge variant="outline">Kelayotgan</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {semester.start_date && semester.end_date ? (
                        <span>
                          {new Date(semester.start_date).toLocaleDateString('uz-UZ')} -{' '}
                          {new Date(semester.end_date).toLocaleDateString('uz-UZ')}
                        </span>
                      ) : (
                        <span>{semester.year || 'N/A'}</span>
                      )}
                    </CardDescription>
                  </div>
                  {semester.gpa && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{semester.gpa.toFixed(2)}</div>
                      <p className="text-sm text-gray-500">GPA</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {semester.subjects_count !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Fanlar</p>
                      <p className="text-lg font-semibold">{semester.subjects_count}</p>
                    </div>
                  )}
                  {semester.credits !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Kreditlar</p>
                      <p className="text-lg font-semibold">{semester.credits}</p>
                    </div>
                  )}
                  {semester.total_hours !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Jami soatlar</p>
                      <p className="text-lg font-semibold">{semester.total_hours}</p>
                    </div>
                  )}
                  {semester.average_grade !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">O'rtacha ball</p>
                      <p className="text-lg font-semibold">{semester.average_grade}</p>
                    </div>
                  )}
                </div>

                {/* Academic Calendar Section */}
                {semester.events && semester.events.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Muhim sanalar
                    </h4>
                    <div className="space-y-2">
                      {semester.events.map((event: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{event.name}</span>
                          <span className="font-medium">
                            {new Date(event.date).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Semester Description */}
                {semester.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">{semester.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Academic Year Info */}
      {semesterList.length > 0 && semesterList[0].academic_year && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Akademik yil ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Akademik yil</p>
                <p className="text-lg font-semibold">{semesterList[0].academic_year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jami semestrlar</p>
                <p className="text-lg font-semibold">{semesterList.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tugallangan</p>
                <p className="text-lg font-semibold">
                  {semesterList.filter((s: any) => s.status === 'completed').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joriy</p>
                <p className="text-lg font-semibold">
                  {semesterList.filter((s: any) => s.is_current).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
