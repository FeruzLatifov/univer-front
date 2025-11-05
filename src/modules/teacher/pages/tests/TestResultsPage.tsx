import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Filter, Eye, Award, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTest, useTestResults } from '@/hooks/useTests'
import { ATTEMPT_STATUS_NAMES } from '@/lib/api/teacher'
import type { AttemptStatus } from '@/lib/api/teacher'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDateTime } from '@/lib/utils'

/**
 * Test Results Page
 *
 * Features:
 * - View all attempts for a test
 * - Filter by status, student, pass/fail
 * - Statistics summary
 * - Navigate to attempt details for grading
 */
export function TestResultsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const testId = id ? Number(id) : undefined

  // Filters
  const [statusFilter, setStatusFilter] = useState<AttemptStatus | 'all'>('all')
  const [passedFilter, setPassedFilter] = useState<'all' | 'passed' | 'failed'>('all')

  // Fetch test and results
  const { data: testData, isLoading: loadingTest } = useTest(testId)
  const { data: resultsData, isLoading: loadingResults } = useTestResults(testId, {
    status: statusFilter === 'all' ? undefined : statusFilter,
    passed: passedFilter === 'all' ? undefined : passedFilter === 'passed',
  })

  const test = testData?.data
  const attempts = resultsData?.data || []
  const summary = resultsData?.summary

  // Handle view attempt
  const handleViewAttempt = (attemptId: number) => {
    navigate(`/teacher/tests/${testId}/attempts/${attemptId}`)
  }

  // Get status badge
  const getStatusBadge = (status: AttemptStatus) => {
    const variants: Record<AttemptStatus, 'default' | 'secondary' | 'destructive' | 'success'> = {
      started: 'secondary',
      in_progress: 'default',
      submitted: 'default',
      graded: 'success',
      abandoned: 'destructive',
    }
    return (
      <Badge variant={variants[status]}>
        {ATTEMPT_STATUS_NAMES[status]}
      </Badge>
    )
  }

  // Get grade badge color
  const getGradeBadgeColor = (percentage: number | null) => {
    if (percentage === null) return 'bg-gray-500'
    if (percentage >= 86) return 'bg-green-600'
    if (percentage >= 71) return 'bg-blue-600'
    if (percentage >= 56) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  // Loading state
  if (loadingTest || loadingResults) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <p className="text-destructive">Test topilmadi</p>
          <Button onClick={() => navigate('/teacher/tests')} className="mt-4">
            Orqaga
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/teacher/tests/${testId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground mt-1">Natijalar va baholash</p>
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-5 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">{summary.total_attempts}</p>
              <p className="text-sm text-muted-foreground">Jami urinishlar</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{summary.graded}</p>
              <p className="text-sm text-muted-foreground">Baholangan</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{summary.pending_grading}</p>
              <p className="text-sm text-muted-foreground">Kutilmoqda</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {summary.average_score.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">O'rtacha ball</p>
            </div>
            {summary.pass_rate !== null && (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {summary.pass_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">O'tish darajasi</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex gap-4 flex-1">
            {/* Status filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as AttemptStatus | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Barcha holatlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holatlar</SelectItem>
                <SelectItem value="submitted">Yuborilgan</SelectItem>
                <SelectItem value="graded">Baholangan</SelectItem>
                <SelectItem value="in_progress">Jarayonda</SelectItem>
                <SelectItem value="abandoned">Tark etilgan</SelectItem>
              </SelectContent>
            </Select>

            {/* Pass/Fail filter */}
            {test.passing_score && (
              <Select
                value={passedFilter}
                onValueChange={(value) => setPassedFilter(value as 'all' | 'passed' | 'failed')}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Barcha natijalar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha natijalar</SelectItem>
                  <SelectItem value="passed">O'tganlar</SelectItem>
                  <SelectItem value="failed">O'tmaganlar</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Clear filters */}
          {(statusFilter !== 'all' || passedFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all')
                setPassedFilter('all')
              }}
            >
              Tozalash
            </Button>
          )}
        </div>
      </Card>

      {/* Attempts List */}
      {attempts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-xl font-semibold mb-2">Urinishlar topilmadi</p>
          <p className="text-muted-foreground">
            Hozircha hech kim testni topshirmagan yoki filterga mos natija yo'q
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <Card key={attempt.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                {/* Student Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {attempt.student.full_name.charAt(0)}
                        </span>
                      </div>

                      {/* Student Details */}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {attempt.student.full_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {attempt.student.student_id}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(attempt.status)}
                      <Badge variant="outline">
                        Urinish #{attempt.attempt_number}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {/* Score */}
                    <div>
                      <p className="text-sm text-muted-foreground">Ball</p>
                      <p className="text-lg font-semibold">
                        {attempt.total_score !== null && attempt.max_score !== null ? (
                          <>
                            {attempt.total_score.toFixed(1)} / {attempt.max_score}
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </p>
                    </div>

                    {/* Percentage */}
                    <div>
                      <p className="text-sm text-muted-foreground">Foiz</p>
                      {attempt.percentage !== null ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${getGradeBadgeColor(attempt.percentage)}`}
                          />
                          <p className="text-lg font-semibold">
                            {attempt.percentage.toFixed(1)}%
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>

                    {/* Grade */}
                    <div>
                      <p className="text-sm text-muted-foreground">Baho</p>
                      {attempt.letter_grade ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{attempt.letter_grade}</Badge>
                          <Badge variant="secondary">{attempt.numeric_grade}</Badge>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>

                    {/* Pass/Fail */}
                    {test.passing_score && attempt.passed !== null && (
                      <div>
                        <p className="text-sm text-muted-foreground">Natija</p>
                        <Badge variant={attempt.passed ? 'success' : 'destructive'}>
                          {attempt.passed ? "O'tdi" : "O'tmadi"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Timing */}
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    {attempt.submitted_at && (
                      <div>
                        <strong>Yuborilgan:</strong>{' '}
                        {formatDateTime(attempt.submitted_at)}
                      </div>
                    )}
                    {attempt.duration_seconds !== null && (
                      <div>
                        <strong>Davomiyligi:</strong> {attempt.duration_formatted}
                      </div>
                    )}
                    {attempt.graded_at && (
                      <div>
                        <strong>Baholangan:</strong>{' '}
                        {formatDateTime(attempt.graded_at)}
                      </div>
                    )}
                  </div>

                  {/* Auto vs Manual Grading */}
                  {attempt.auto_graded_score !== null || attempt.manual_graded_score !== null ? (
                    <div className="mt-4 flex gap-6 text-sm">
                      {attempt.auto_graded_score !== null && (
                        <div>
                          <span className="text-muted-foreground">Avto:</span>{' '}
                          <strong className="text-blue-600">
                            {attempt.auto_graded_score.toFixed(1)}
                          </strong>
                        </div>
                      )}
                      {attempt.manual_graded_score !== null && (
                        <div>
                          <span className="text-muted-foreground">Qo'lda:</span>{' '}
                          <strong className="text-purple-600">
                            {attempt.manual_graded_score.toFixed(1)}
                          </strong>
                        </div>
                      )}
                      {attempt.requires_manual_grading && (
                        <Badge variant="warning">Baholash kerak</Badge>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleViewAttempt(attempt.id)}
                    variant={attempt.requires_manual_grading ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {attempt.requires_manual_grading ? 'Baholash' : "Ko'rish"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/tests/${testId}`)}
        >
          Test sahifasiga qaytish
        </Button>
      </div>
    </div>
  )
}

// Helper functions moved to @/lib/utils
