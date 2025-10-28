import { useState } from 'react'
import { Eye, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Submission, SubmissionStatusFilter } from '@/lib/api/teacher'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { GradingDialog } from './GradingDialog'

interface SubmissionsListProps {
  submissions: Submission[]
  assignmentId: number
}

export function SubmissionsList({ submissions, assignmentId }: SubmissionsListProps) {
  const [statusFilter, setStatusFilter] = useState<SubmissionStatusFilter | 'all'>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null)
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false)

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    if (statusFilter === 'all') return true
    return submission.status === statusFilter
  })

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Baholandi
          </Badge>
        )
      case 'submitted':
        return (
          <Badge variant="default">
            <FileText className="mr-1 h-3 w-3" />
            Topshirildi
          </Badge>
        )
      case 'viewed':
        return (
          <Badge variant="outline">
            <Eye className="mr-1 h-3 w-3" />
            Ko'rildi
          </Badge>
        )
      case 'returned':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Qaytarildi
          </Badge>
        )
      case 'not_submitted':
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            Topshirilmadi
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Kutilmoqda
          </Badge>
        )
    }
  }

  // Grade badge color
  const getGradeBadgeColor = (percentage: number | null) => {
    if (percentage === null) return 'secondary'
    if (percentage >= 86) return 'default'
    if (percentage >= 71) return 'default'
    if (percentage >= 56) return 'outline'
    return 'destructive'
  }

  // Handle grade click
  const handleGrade = (submissionId: number) => {
    setSelectedSubmission(submissionId)
    setGradingDialogOpen(true)
  }

  return (
    <>
      <Card>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Javoblar ({filteredSubmissions.length})
            </h3>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as SubmissionStatusFilter | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="submitted">Topshirildi</SelectItem>
                <SelectItem value="graded">Baholandi</SelectItem>
                <SelectItem value="returned">Qaytarildi</SelectItem>
                <SelectItem value="not_submitted">Topshirilmadi</SelectItem>
                <SelectItem value="pending">Kutilmoqda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Javoblar topilmadi</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Talaba</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Topshirgan vaqti</TableHead>
                <TableHead>Urinish</TableHead>
                <TableHead>Ball</TableHead>
                <TableHead>Baho</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.student.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.student.student_id_number}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {submission.submitted_at ? (
                      <div>
                        <p className="text-sm">
                          {format(new Date(submission.submitted_at), 'dd MMM yyyy', {
                            locale: uz,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(submission.submitted_at), 'HH:mm', { locale: uz })}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.attempt_number}</Badge>
                  </TableCell>
                  <TableCell>
                    {submission.score !== null && submission.score !== undefined ? (
                      <span className="font-semibold">
                        {submission.score} / {submission.max_score}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.percentage !== null ? (
                      <div className="flex items-center gap-2">
                        <Badge variant={getGradeBadgeColor(submission.percentage)}>
                          {submission.letter_grade}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {submission.percentage}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {submission.status === 'submitted' || submission.status === 'viewed' ? (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleGrade(submission.id)}
                        >
                          Baholash
                        </Button>
                      ) : submission.status === 'graded' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGrade(submission.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ko'rish
                        </Button>
                      ) : submission.status === 'returned' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGrade(submission.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ko'rish
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          Topshirilmadi
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Grading Dialog */}
      {selectedSubmission && (
        <GradingDialog
          submissionId={selectedSubmission}
          open={gradingDialogOpen}
          onOpenChange={setGradingDialogOpen}
        />
      )}
    </>
  )
}
