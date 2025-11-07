import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, MapPin, Users, CheckCircle2, Circle, TrendingUp } from 'lucide-react'
import { teacherScheduleService } from '@/services'
import {
  WEEK_DAYS,
  LESSON_PAIRS,
  TRAINING_TYPES,
  type ScheduleLesson,
  type WeeklySchedule
} from '@/lib/api/schedule'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SchedulePage() {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const today = new Date().getDay() || 7 // 0 (Sunday) -> 7

  const { data, isLoading, error } = useQuery<WeeklySchedule>({
    queryKey: ['teacher', 'schedule'],
    queryFn: () => teacherScheduleService.getSchedule(),
  })

  const schedule: WeeklySchedule = data ?? {}

  // Filter lessons by selected day
  const displaySchedule: WeeklySchedule =
    selectedDay !== null
      ? {
          [String(selectedDay)]: schedule[String(selectedDay)] ?? [],
        }
      : schedule

  // Calculate statistics
  const totalLessons = Object.values(schedule).flat().length
  const todayLessons = schedule[today]?.length || 0
  const conductedLessons = Object.values(schedule)
    .flat()
    .filter((l) => l.conducted).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dars jadvali</h1>
          <p className="text-muted-foreground mt-1">
            Haftalik dars jadvali va mashg'ulotlar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            {totalLessons} ta dars
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Bugungi darslar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{todayLessons}</div>
                <p className="text-sm text-muted-foreground">
                  {WEEK_DAYS.find((d) => d.id === today)?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Haftalik darslar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalLessons}</div>
                <p className="text-sm text-muted-foreground">Jami darslar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'tkazilgan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{conductedLessons}</div>
                <p className="text-sm text-muted-foreground">
                  {totalLessons > 0
                    ? `${((conductedLessons / totalLessons) * 100).toFixed(0)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedDay === null ? 'default' : 'outline'}
              onClick={() => setSelectedDay(null)}
            >
              Barchasi
            </Button>
            {WEEK_DAYS.map((day) => (
              <Button
                key={day.id}
                variant={selectedDay === day.id ? 'default' : 'outline'}
                onClick={() => setSelectedDay(day.id)}
                className={cn(
                  day.id === today && selectedDay === null && 'ring-2 ring-primary'
                )}
              >
                {day.name}
                {schedule[day.id]?.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {schedule[day.id].length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Jadval yuklanmadi. Iltimos, qaytadan urinib ko'ring.
            </p>
          </CardContent>
        </Card>
      ) : Object.keys(displaySchedule).length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Darslar topilmadi</h3>
                <p className="text-muted-foreground mt-1">
                  Hozircha dars jadvali mavjud emas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(displaySchedule)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([dayId, lessons]) => {
              const dayName = WEEK_DAYS.find((d) => d.id === Number(dayId))?.name
              const isToday = Number(dayId) === today

              return (
                <Card key={dayId} className={cn(isToday && 'ring-2 ring-primary')}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {dayName}
                          {isToday && (
                            <Badge variant="default">Bugun</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {lessons.length} ta dars
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lessons.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Bu kun darslar yo'q
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {lessons
                          .sort((a, b) => a.lesson_pair - b.lesson_pair)
                          .map((lesson) => (
                            <LessonCard key={lesson.id} lesson={lesson} />
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}

// Lesson Card Component
function LessonCard({ lesson }: { lesson: ScheduleLesson }) {
  const { t } = useTranslation()
  const lessonTime = LESSON_PAIRS.find((p) => p.pair === lesson.lesson_pair)
  const trainingTypeInfo = TRAINING_TYPES[lesson.training_type] || {
    label: lesson.training_type,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border transition-all',
        'hover:shadow-md hover:border-primary/50',
        lesson.conducted && 'bg-muted/50'
      )}
    >
      {/* Time */}
      <div className="flex flex-col items-center min-w-[80px] pt-1">
        <Badge variant="outline" className="font-mono text-sm mb-1">
          {lesson.lesson_pair}-juft
        </Badge>
        <div className="text-sm text-muted-foreground text-center">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lessonTime?.start}
          </div>
          <div className="text-xs">{lessonTime?.end}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-full w-px bg-border" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-lg leading-tight">
              {t(lesson, 'subject_name')}
            </h4>
            <p className="text-sm text-muted-foreground font-mono">
              {lesson.subject_code}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lesson.conducted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={trainingTypeInfo.color}>
            {trainingTypeInfo.label}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Users className="w-3 h-3" />
            {t(lesson, 'group_name')}
            {lesson.students_count && ` (${lesson.students_count})`}
          </Badge>
          {lesson.room_name && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="w-3 h-3" />
              {lesson.room_name}
              {lesson.building_name && ` - ${lesson.building_name}`}
            </Badge>
          )}
          {lesson.attendance_marked && (
            <Badge variant="secondary">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Davomat belgilangan
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
