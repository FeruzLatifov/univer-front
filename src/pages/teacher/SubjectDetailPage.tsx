import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Users,
  UsersRound,
  FileText,
  Calendar,
  Award,
  TrendingUp,
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  PlusCircle
} from 'lucide-react'
import { getSubjectDetail } from '@/lib/api/subjects'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')

  const { data, isLoading, error } = useQuery({
    queryKey: ['subject-detail', id],
    queryFn: () => getSubjectDetail(Number(id)),
    enabled: !!id,
  })

  const subject = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !subject) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Fan ma'lumotlari topilmadi
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = subject.statistics

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/teacher/subjects')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Fanlar ro'yxatiga qaytish
      </Button>

      {/* Header Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl">
                    {t(subject, 'name')}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm">
                      {subject.code}
                    </Badge>
                    {subject.credit && (
                      <Badge variant="outline">
                        <Award className="w-3 h-3 mr-1" />
                        {subject.credit} kredit
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>

              {subject.department_name && (
                <div className="flex items-center gap-2 text-muted-foreground mt-4">
                  <GraduationCap className="w-4 h-4" />
                  <span>{t(subject, 'department_name')}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/teacher/subjects/${id}/attendance`)}
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Davomat
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/teacher/subjects/${id}/grades`)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Baholar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Talabalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{stats?.total_students || 0}</div>
                <p className="text-sm text-muted-foreground">Jami talabalar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Guruhlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <UsersRound className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{stats?.total_groups || 0}</div>
                <p className="text-sm text-muted-foreground">Jami guruhlar</p>
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
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {stats?.average_attendance?.toFixed(1) || 0}%
                </div>
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
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {stats?.average_grade?.toFixed(1) || 0}
                </div>
                <p className="text-sm text-muted-foreground">O'rtacha baho</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="students">
            Talabalar ({stats?.total_students || 0})
          </TabsTrigger>
          <TabsTrigger value="groups">
            Guruhlar ({stats?.total_groups || 0})
          </TabsTrigger>
          <TabsTrigger value="topics">
            Mavzular ({stats?.total_topics || 0})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fan haqida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kod</span>
                  <span className="font-semibold font-mono">{subject.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kredit</span>
                  <span className="font-semibold">{subject.credit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jami soat</span>
                  <span className="font-semibold">{subject.total_acload} soat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Semestr</span>
                  <span className="font-semibold">{subject.semester_id}-semestr</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O'quv materiallari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Jami materiallar</span>
                  </div>
                  <span className="font-semibold">{stats?.total_resources || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">O'tilgan mavzular</span>
                  </div>
                  <span className="font-semibold">
                    {stats?.completed_topics || 0} / {stats?.total_topics || 0}
                  </span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Material yuklash
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Talabalar ro'yxati</CardTitle>
              <CardDescription>
                Ushbu fanni o'qiyotgan barcha talabalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subject.students && subject.students.length > 0 ? (
                <div className="space-y-3">
                  {subject.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstname[0]}{student.lastname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {student.lastname} {student.firstname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.student_id_number}
                            {student.group_name && ` • ${student.group_name}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {student.attendance_percentage !== undefined && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              {student.attendance_percentage.toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Davomat</div>
                          </div>
                        )}
                        {student.average_grade !== undefined && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              {student.average_grade.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">O'rtacha</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Talabalar topilmadi
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Guruhlar ro'yxati</CardTitle>
            </CardHeader>
            <CardContent>
              {subject.groups && subject.groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.groups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{t(group, 'name')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {group.students_count} talaba
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Guruhlar topilmadi
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mavzular</CardTitle>
                <CardDescription>O'quv dasturi mavzulari</CardDescription>
              </div>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Mavzu qo'shish
              </Button>
            </CardHeader>
            <CardContent>
              {subject.topics && subject.topics.length > 0 ? (
                <div className="space-y-2">
                  {subject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          #{topic.position}
                        </Badge>
                        <div>
                          <div className="font-semibold">{t(topic, 'name')}</div>
                          {topic.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {topic.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {topic.hours} soat
                        </Badge>
                        <Badge variant={topic.active ? 'default' : 'outline'}>
                          {topic.active ? 'Faol' : 'Nofaol'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Mavzular topilmadi
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
