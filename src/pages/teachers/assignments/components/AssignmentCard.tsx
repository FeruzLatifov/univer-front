import { Calendar, Users, FileText, Eye, Edit, Trash2, Send, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { useDeleteAssignment, usePublishAssignment, useUnpublishAssignment } from '@/hooks/useAssignments'
import type { Assignment } from '@/lib/api/teacher'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'

interface AssignmentCardProps {
  assignment: Assignment
  onView: (id: number) => void
  onEdit: (id: number) => void
}

export function AssignmentCard({ assignment, onView, onEdit }: AssignmentCardProps) {
  const deleteAssignment = useDeleteAssignment()
  const publishAssignment = usePublishAssignment()
  const unpublishAssignment = useUnpublishAssignment()

  // Status badge variant
  const getStatusBadge = () => {
    if (assignment.is_overdue) {
      return <Badge variant="destructive">Muddati o'tgan</Badge>
    }
    if (!assignment.is_published) {
      return <Badge variant="secondary">Qoralama</Badge>
    }
    if (assignment.days_until_deadline <= 2) {
      return <Badge variant="outline" className="border-orange-500 text-orange-700">Yaqinlashayotgan</Badge>
    }
    return <Badge variant="default" className="bg-green-600">Faol</Badge>
  }

  // Submission rate color
  const getProgressColor = () => {
    const rate = assignment.submission_stats.submission_rate
    if (rate >= 80) return 'bg-green-600'
    if (rate >= 50) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  // Handle delete
  const handleDelete = async () => {
    await deleteAssignment.mutateAsync(assignment.id)
  }

  // Handle publish/unpublish
  const handleTogglePublish = async () => {
    if (assignment.is_published) {
      await unpublishAssignment.mutateAsync(assignment.id)
    } else {
      await publishAssignment.mutateAsync(assignment.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              {getStatusBadge()}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                  {format(new Date(assignment.deadline), 'dd MMM yyyy, HH:mm', { locale: uz })}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{assignment.max_score}</div>
            <div className="text-xs text-muted-foreground">Max ball</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Submission Statistics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Topshirildi</span>
            <span className="font-semibold">
              {assignment.submission_stats.submitted} / {assignment.submission_stats.total}
              <span className="text-muted-foreground ml-1">
                ({assignment.submission_stats.submission_rate}%)
              </span>
            </span>
          </div>

          <Progress
            value={assignment.submission_stats.submission_rate}
            className="h-2"
            indicatorClassName={getProgressColor()}
          />

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className="font-semibold text-green-600">
                {assignment.submission_stats.graded}
              </div>
              <div className="text-xs text-muted-foreground">Baholandi</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">
                {assignment.submission_stats.pending}
              </div>
              <div className="text-xs text-muted-foreground">Kutilmoqda</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">
                {assignment.submission_stats.not_submitted}
              </div>
              <div className="text-xs text-muted-foreground">Topshirilmadi</div>
            </div>
          </div>
        </div>

        {/* Description preview */}
        {assignment.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {assignment.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(assignment.id)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ko'rish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(assignment.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Tahrirlash
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Publish/Unpublish button */}
          <Button
            variant={assignment.is_published ? 'outline' : 'default'}
            size="sm"
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

          {/* Delete with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Topshiriqni o'chirish</AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="font-semibold">{assignment.title}</span> topshirig'ini o'chirmoqchimisiz?
                  Bu amalni bekor qilib bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteAssignment.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteAssignment.isPending ? 'O\'chirilmoqda...' : 'O\'chirish'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
