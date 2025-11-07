import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Edit,
  Trash2,
  Send,
  XCircle,
  Download,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useAssignment,
  useSubmissions,
  useAssignmentStatistics,
  useAssignmentActivities,
  useDeleteAssignment,
  usePublishAssignment,
  useUnpublishAssignment,
} from '@/hooks/useAssignments'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { SubmissionsList } from './components/SubmissionsList'

export function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const assignmentId = Number(id)

  const [activeTab, setActiveTab] = useState('submissions')

  // Queries
  const { data: assignmentData, isLoading, error } = useAssignment(assignmentId)
  const { data: submissionsData, isLoading: submissionsLoading } = useSubmissions(assignmentId)
  const { data: statisticsData, isLoading: statsLoading } = useAssignmentStatistics(assignmentId)
  const { data: activitiesData, isLoading: activitiesLoading } = useAssignmentActivities(assignmentId)

  // Mutations
  const deleteAssignment = useDeleteAssignment()
  const publishAssignment = usePublishAssignment()
  const unpublishAssignment = useUnpublishAssignment()

  const assignment = assignmentData?.data

  // Handle delete
  const handleDelete = async () => {
    await deleteAssignment.mutateAsync(assignmentId)
    navigate('/teacher/assignments')
  }

  // Handle publish/unpublish
  const handleTogglePublish = async () => {
    if (assignment?.is_published) {
      await unpublishAssignment.mutateAsync(assignmentId)
    } else {
      await publishAssignment.mutateAsync(assignmentId)
    }
  }

  // Handle file download
  const handleDownloadFile = (file: { path: string; name: string }) => {
    // Create a link to download the file from storage
    const fileUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/storage/${file.path}`
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = file.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !assignment) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <p className="text-destructive mb-4">
            Topshiriq topilmadi yoki xatolik yuz berdi
          </p>
          <Button onClick={() => navigate('/teacher/assignments')}>
            Orqaga qaytish
          </Button>
        </Card>
      </div>
    )
  }

  const totalStudents = assignment.submission_stats.total_students
  const pendingSubmissions = assignment.submission_stats.pending_grading
  const assignmentStats = statisticsData?.data
  const computedPassRate =
    assignmentStats && assignmentStats.total_students > 0
      ? (
          (assignmentStats.passed / assignmentStats.total_students) *
          100
        ).toFixed(1)
      : '0'

  // Status badge
  const getStatusBadge = () => {
    if (assignment.is_overdue) {
      return <Badge variant="destructive">Muddati o'tgan</Badge>
    }
    if (!assignment.is_published) {
      return <Badge variant="secondary">Qoralama</Badge>
    }
    if (assignment.days_until_deadline <= 2) {
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-700">
          Yaqinlashayotgan
        </Badge>
      )
    }
    return <Badge className="bg-green-600">Faol</Badge>
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/teacher/assignments')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              {getStatusBadge()}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{assignment.subject.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{assignment.group.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Muddat: {format(new Date(assignment.deadline), 'dd MMM yyyy, HH:mm', { locale: uz })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/teacher/assignments/${assignmentId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Tahrirlash
          </Button>

          <Button
            variant={assignment.is_published ? 'outline' : 'default'}
            onClick={handleTogglePublish}
            disabled={publishAssignment.isPending || unpublishAssignment.isPending}
          >
            {assignment.is_published ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Nashrdan olish
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Nashr qilish
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                O'chirish
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Topshiriqni o'chirish</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu topshiriqni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteAssignment.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  O'chirish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{assignment.max_score}</p>
              <p className="text-sm text-muted-foreground mt-1">Maksimal ball</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {assignment.submission_stats.submitted}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Topshirildi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {pendingSubmissions}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Kutilmoqda</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {assignment.submission_stats.submission_rate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Topshirish foizi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {assignment.description && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tavsif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {assignment.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Files */}
      {assignment.files && assignment.files.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fayllar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assignment.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadFile(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="submissions">
            Javoblar ({totalStudents})
          </TabsTrigger>
          <TabsTrigger value="statistics">Statistika</TabsTrigger>
          <TabsTrigger value="activities">Faollik</TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="mt-6">
          {submissionsLoading ? (
            <Card className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </Card>
          ) : (
            <SubmissionsList submissions={submissionsData?.data.submissions || []} />
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="mt-6">
          {statsLoading ? (
            <Card className="p-8">
              <Skeleton className="h-64 w-full" />
            </Card>
          ) : statisticsData ? (
            <div className="space-y-6">
              {/* Overall Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Umumiy statistika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {statisticsData.data.average_score}%
                      </p>
                      <p className="text-sm text-muted-foreground">O'rtacha ball</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {statisticsData.data.median_score}%
                      </p>
                      <p className="text-sm text-muted-foreground">Mediana</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{computedPassRate}%</p>
                      <p className="text-sm text-muted-foreground">O'tish foizi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Baholar taqsimoti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(statisticsData.data.grade_distribution || {}).map(
                      ([grade, count]) => (
                        <div key={grade}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Baho: {grade}</span>
                            <span className="text-muted-foreground">
                              {count} ta talaba
                            </span>
                          </div>
                          <Progress
                            value={totalStudents > 0 ? ((count as number) / totalStudents) * 100 : 0}
                            className="h-2"
                          />
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="mt-6">
          {activitiesLoading ? (
            <Card className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>So'nggi faollik (oxirgi 7 kun)</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesData && activitiesData.data.length > 0 ? (
                  <div className="space-y-4">
                    {activitiesData.data.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="p-2 bg-muted rounded-full">
                          {activity.activity_type === 'submitted' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {activity.activity_type === 'viewed' && (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                          {activity.activity_type === 'graded' && (
                            <FileText className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.student.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.activity_type === 'submitted' && 'Topshirdi'}
                            {activity.activity_type === 'viewed' && 'Ko\'rdi'}
                            {activity.activity_type === 'graded' && 'Baholandi'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(activity.created_at), 'dd MMM yyyy, HH:mm', {
                              locale: uz,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Hozircha faollik yo'q
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
