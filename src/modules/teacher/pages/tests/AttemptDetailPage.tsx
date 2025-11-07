import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAttemptDetail, useGradeAttempt } from '@/hooks/useTests'
import { QUESTION_TYPE_NAMES, ATTEMPT_STATUS_NAMES } from '@/lib/api/teacher'
import type { StudentAnswer } from '@/lib/api/teacher'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/utils'
import { useUserStore } from '@/stores/auth'

const getQuestionTypeLabel = (
  type: StudentAnswer['question']['question_type']
): string => {
  const key =
    typeof type === 'number'
      ? 'multiple_choice'
      : type
  return QUESTION_TYPE_NAMES[key as keyof typeof QUESTION_TYPE_NAMES] || 'Noma\'lum'
}

/**
 * Attempt Detail Page
 *
 * Features:
 * - View all answers from a student attempt
 * - See auto-graded results
 * - Manually grade essay questions
 * - Provide feedback per question
 * - Overall feedback
 */
export function AttemptDetailPage() {
  const navigate = useNavigate()
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>()
  const testId = id ? Number(id) : undefined
  const attemptIdNum = attemptId ? Number(attemptId) : undefined
  const { user } = useUserStore()

  // Fetch attempt details
  const { data: attemptData, isLoading } = useAttemptDetail(testId, attemptIdNum)
  const gradeAttempt = useGradeAttempt()

  const attempt = attemptData?.data

  // Grading state (for manual grading)
  const [gradingData, setGradingData] = useState<{
    [answerId: number]: { points: number; feedback: string }
  }>({})
  const [overallFeedback, setOverallFeedback] = useState('')

  // Initialize grading data
  const initializeGradingData = () => {
    if (!attempt) return

    const data: typeof gradingData = {}
    attempt.answers.forEach((answer) => {
      if (answer.manually_graded || answer.question.question_type === 'essay') {
        data[answer.id] = {
          points: answer.points_earned || 0,
          feedback: answer.feedback || '',
        }
      }
    })
    setGradingData(data)
    setOverallFeedback(attempt.feedback || '')
  }

  // Handle grading data change
  const handlePointsChange = (answerId: number, points: number) => {
    setGradingData((prev) => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        points,
      },
    }))
  }

  const handleFeedbackChange = (answerId: number, feedback: string) => {
    setGradingData((prev) => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        feedback,
      },
    }))
  }

  // Submit grading
  const handleSubmitGrading = async () => {
    if (!attempt || !testId || !attemptIdNum) return

    const currentUserId = user?.id ?? 1

    const answers = Object.entries(gradingData).map(([answerId, data]) => ({
      answer_id: Number(answerId),
      points_earned: data.points,
      feedback: data.feedback || undefined,
    }))

    try {
      await gradeAttempt.mutateAsync({
        testId,
        attemptId: attemptIdNum,
        data: {
          graded_by: currentUserId,
          answers,
          overall_feedback: overallFeedback || undefined,
        },
      })

      navigate(`/teacher/tests/${testId}/results`)
    } catch (error) {
      console.error('Failed to grade attempt:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <p className="text-destructive">Urinish topilmadi</p>
          <Button onClick={() => navigate(`/teacher/tests/${testId}/results`)} className="mt-4">
            Orqaga
          </Button>
        </Card>
      </div>
    )
  }

  // Check if needs manual grading
  const needsGrading = attempt.requires_manual_grading && attempt.status === 'submitted'

  // Initialize grading data if needed
  if (needsGrading && Object.keys(gradingData).length === 0) {
    initializeGradingData()
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/teacher/tests/${testId}/results`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{attempt.test.title}</h1>
          <p className="text-muted-foreground mt-1">
            {attempt.student.full_name} - Urinish #{attempt.attempt_number}
          </p>
        </div>
        <Badge variant={attempt.status === 'graded' ? 'default' : 'secondary'}>
          {ATTEMPT_STATUS_NAMES[attempt.status]}
        </Badge>
      </div>

      {/* Attempt Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Umumiy ma'lumot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ball</p>
              <p className="text-2xl font-bold">
                {attempt.total_score !== null && attempt.total_score !== undefined
                  ? attempt.total_score.toFixed(1)
                  : '-'}{' '}
                /{' '}
                {attempt.max_score}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Foiz</p>
              <p className="text-2xl font-bold">
                {attempt.percentage !== null && attempt.percentage !== undefined
                  ? `${attempt.percentage.toFixed(1)}%`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Baho</p>
              <div className="flex items-center gap-2 mt-1">
                {attempt.letter_grade && (
                  <>
                    <Badge variant="outline" className="text-lg">
                      {attempt.letter_grade}
                    </Badge>
                    <Badge variant="secondary" className="text-lg">
                      {attempt.numeric_grade}
                    </Badge>
                  </>
                )}
                {!attempt.letter_grade && <p className="text-muted-foreground">-</p>}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Davomiyligi</p>
              <p className="text-lg font-semibold">{attempt.duration_formatted}</p>
            </div>
          </div>

          {attempt.submitted_at && (
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              <strong>Yuborilgan:</strong> {formatDateTime(attempt.submitted_at)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading Alert */}
      {needsGrading && (
        <Card className="mb-6 border-orange-500 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">Baholash kerak</h3>
                <p className="text-sm text-orange-800 mt-1">
                  Ushbu urinishda qo'lda baholanadigan savollar mavjud. Quyida har bir javobga ball
                  va izoh bering.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answers */}
      <div className="space-y-6">
        {attempt.answers.map((answer, index) => (
          <Card key={answer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">Savol #{index + 1}</Badge>
                    <Badge variant="secondary">
                      {getQuestionTypeLabel(answer.question.question_type)}
                    </Badge>
                    <Badge variant="outline">{answer.points_possible} ball</Badge>
                  </div>
                  <h3 className="font-medium text-lg">{answer.question.question_text}</h3>
                </div>

                {/* Correctness indicator */}
                {answer.is_correct !== null && (
                  <div className="flex items-center gap-2">
                    {answer.is_correct ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student's Answer */}
              <div>
                <Label className="text-sm font-medium">Talaba javobi:</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  {answer.display_value || (
                    <span className="text-muted-foreground italic">Javob berilmagan</span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Olingan ball</p>
                  <p className="text-xl font-semibold">
                    {answer.points_earned !== null && answer.points_earned !== undefined
                      ? answer.points_earned.toFixed(1)
                      : '-'}{' '}
                    /{' '}
                    {answer.points_possible}
                  </p>
                </div>
                {answer.percentage !== null && answer.percentage !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Foiz</p>
                    <p className="text-xl font-semibold">{answer.percentage.toFixed(1)}%</p>
                  </div>
                )}
                {answer.is_correct !== null && (
                  <Badge variant={answer.is_correct ? 'default' : 'destructive'}>
                    {answer.is_correct ? "To'g'ri" : "Noto'g'ri"}
                  </Badge>
                )}
              </div>

              {/* Manual Grading Section */}
              {needsGrading && answer.question.question_type === 'essay' && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`points-${answer.id}`}>
                        Ball (max: {answer.points_possible})
                      </Label>
                      <Input
                        id={`points-${answer.id}`}
                        type="number"
                        step="0.1"
                        min="0"
                        max={answer.points_possible}
                        value={gradingData[answer.id]?.points || 0}
                        onChange={(e) =>
                          handlePointsChange(answer.id, Number(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`feedback-${answer.id}`}>Izoh (ixtiyoriy)</Label>
                    <Textarea
                      id={`feedback-${answer.id}`}
                      placeholder="Talaba uchun izoh..."
                      rows={3}
                      value={gradingData[answer.id]?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(answer.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Existing Feedback */}
              {answer.feedback && !needsGrading && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm font-medium">O'qituvchi izohi:</Label>
                  <p className="mt-2 text-sm">{answer.feedback}</p>
                </div>
              )}

              {/* Explanation */}
              {answer.question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Tushuntirish:</p>
                  <p className="text-sm text-blue-800">{answer.question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Feedback */}
      {needsGrading && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Umumiy izoh</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Butun test bo'yicha umumiy izoh (ixtiyoriy)..."
              rows={4}
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {/* Existing Overall Feedback */}
      {attempt.feedback && !needsGrading && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Umumiy izoh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{attempt.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/tests/${testId}/results`)}
        >
          Orqaga
        </Button>

        {needsGrading && (
          <Button
            onClick={handleSubmitGrading}
            disabled={gradeAttempt.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Baholashni saqlash
          </Button>
        )}
      </div>
    </div>
  )
}

// Helper function moved to @/lib/utils
