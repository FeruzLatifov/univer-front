import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FileText, Calendar, Clock, Users, TrendingUp, Plus, Eye } from 'lucide-react'
import { teacherExamService } from '@/services'
import { EXAM_TYPES } from '@/lib/api/exams'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function ExamsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['teacher', 'exams'],
    queryFn: () => teacherExamService.getExams(),
  })

  const exams = data?.data || []
  const filteredExams =
    filter === 'all' ? exams : exams.filter((e) => e.exam_type === filter)

  const upcomingExams = exams.filter((e) => new Date(e.exam_date) > new Date())
  const pastExams = exams.filter((e) => new Date(e.exam_date) <= new Date())

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imtihonlar</h1>
          <p className="text-muted-foreground mt-1">Imtihonlarni boshqaring va natijalarni kiriting</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Imtihon yaratish
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami imtihonlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div className="text-3xl font-bold">{exams.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yaqinlashayotgan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">{upcomingExams.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'tgan imtihonlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{pastExams.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Barchasi
            </Button>
            {Object.entries(EXAM_TYPES).map(([key, value]) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                onClick={() => setFilter(key)}
              >
                {value.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : filteredExams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Imtihonlar yo'q</h3>
            <p className="text-muted-foreground mt-1">Hozircha imtihonlar yaratilmagan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const examTypeInfo = EXAM_TYPES[exam.exam_type as keyof typeof EXAM_TYPES]
            const isUpcoming = new Date(exam.exam_date) > new Date()
            const formattedDate = new Date(exam.exam_date).toLocaleDateString('uz-UZ', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })

            return (
              <Card
                key={exam.id}
                className={cn(
                  'hover:shadow-lg transition-all cursor-pointer',
                  isUpcoming && 'ring-2 ring-primary/20'
                )}
                onClick={() => navigate(`/teacher/exams/${exam.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className={examTypeInfo?.color}>{examTypeInfo?.label}</Badge>
                      <CardTitle className="mt-2 text-lg">
                        {exam.subject_name || 'Fan'}
                      </CardTitle>
                      {exam.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {exam.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration} daqiqa</span>
                  </div>
                  {exam.room && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{exam.room}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Maksimal ball</span>
                      <span className="font-semibold">{exam.max_score}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Natijalarni ko'rish
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
