import { Clock, Users, CheckCircle, AlertCircle, Eye, Edit, MoreVertical, Copy, Trash, FileQuestion, BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteTest, useDuplicateTest, usePublishTest, useUnpublishTest } from '@/hooks/useTests'
import type { Test } from '@/lib/api/teacher'
import { formatDate, formatDateTime } from '@/lib/utils'

interface TestCardProps {
  test: Test
  onView: (id: number) => void
  onEdit: (id: number) => void
  onViewQuestions: (id: number) => void
  onViewResults: (id: number) => void
}

export function TestCard({ test, onView, onEdit, onViewQuestions, onViewResults }: TestCardProps) {
  const deleteTest = useDeleteTest()
  const duplicateTest = useDuplicateTest()
  const publishTest = usePublishTest()
  const unpublishTest = useUnpublishTest()

  const handleDelete = () => {
    if (window.confirm(`"${test.title}" testini o'chirmoqchimisiz?`)) {
      deleteTest.mutate(test.id)
    }
  }

  const handleDuplicate = () => {
    duplicateTest.mutate(test.id)
  }

  const handleTogglePublish = () => {
    if (test.is_published) {
      unpublishTest.mutate(test.id)
    } else {
      publishTest.mutate(test.id)
    }
  }

  // Status badge
  const getStatusBadge = () => {
    if (!test.is_published) {
      return <Badge variant="secondary">Qoralama</Badge>
    }
    if (test.is_expired) {
      return <Badge variant="destructive">Muddati o'tgan</Badge>
    }
    if (!test.is_available) {
      return <Badge variant="outline">Kelayotgan</Badge>
    }
    return <Badge variant="success">Mavjud</Badge>
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className="text-xl font-semibold hover:text-primary cursor-pointer"
                  onClick={() => onView(test.id)}
                >
                  {test.title}
                </h3>
                {getStatusBadge()}
              </div>

              {test.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {test.description}
                </p>
              )}
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(test.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ko'rish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(test.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Tahrirlash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewQuestions(test.id)}>
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Savollar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewResults(test.id)}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Natijalar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleTogglePublish}>
                  {test.is_published ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Nashrdan olish
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Nashr qilish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Nusxalash
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  O'chirish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <strong>Fan:</strong> {test.subject.name}
            </div>
            {test.group && (
              <div className="flex items-center gap-1">
                <strong>Guruh:</strong> {test.group.name}
              </div>
            )}
            {test.topic && (
              <div className="flex items-center gap-1">
                <strong>Mavzu:</strong> {test.topic.name}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{test.question_count}</strong> ta savol
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {test.duration ? test.duration_formatted : 'Cheklanmagan'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{test.attempt_limit}</strong> ta urinish
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Urinishlar:</span>{' '}
              <strong className="text-foreground">{test.attempt_stats.total_attempts}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Baholangan:</span>{' '}
              <strong className="text-green-600">{test.attempt_stats.completed}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Kutilmoqda:</span>{' '}
              <strong className="text-orange-600">{test.attempt_stats.pending_grading}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">O'rtacha:</span>{' '}
              <strong className="text-blue-600">
                {test.attempt_stats.average_score.toFixed(1)}%
              </strong>
            </div>
            {test.attempt_stats.pass_rate !== null && (
              <div>
                <span className="text-muted-foreground">O'tganlar:</span>{' '}
                <strong className="text-purple-600">
                  {test.attempt_stats.pass_rate.toFixed(1)}%
                </strong>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="flex gap-6 text-xs text-muted-foreground mt-4 pt-4 border-t">
            {test.start_date && (
              <div>
                <strong>Boshlanish:</strong> {formatDate(test.start_date)}
              </div>
            )}
            {test.end_date && (
              <div>
                <strong>Tugash:</strong> {formatDate(test.end_date)}
                {test.days_until_end !== null && test.days_until_end > 0 && (
                  <span className="ml-2 text-orange-600">
                    ({test.days_until_end} kun qoldi)
                  </span>
                )}
              </div>
            )}
            {test.passing_score && (
              <div>
                <strong>O'tish balli:</strong> {test.passing_score}%
              </div>
            )}
            <div>
              <strong>Max ball:</strong> {test.max_score}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={() => onView(test.id)} variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Ko'rish
          </Button>
          <Button onClick={() => onViewQuestions(test.id)} variant="outline" size="sm">
            <FileQuestion className="mr-2 h-4 w-4" />
            Savollar
          </Button>
          <Button onClick={() => onViewResults(test.id)} variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Natijalar
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Format date helper moved to @/lib/utils
