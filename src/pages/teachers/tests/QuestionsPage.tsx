import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, GripVertical, Edit, Trash, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTest, useTestQuestions, useDeleteQuestion, useDuplicateQuestion } from '@/hooks/useTests'
import { QuestionForm } from './components/QuestionForm'
import { QUESTION_TYPE_NAMES } from '@/lib/api/teacher'
import type { Question } from '@/lib/api/teacher'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Questions Builder Page
 *
 * Features:
 * - View all questions for a test
 * - Add new questions (all types)
 * - Edit existing questions
 * - Delete questions
 * - Duplicate questions
 * - Reorder questions
 */
export function QuestionsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const testId = id ? Number(id) : undefined

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  // Fetch test and questions
  const { data: testData, isLoading: loadingTest } = useTest(testId)
  const { data: questionsData, isLoading: loadingQuestions } = useTestQuestions(testId)
  const deleteQuestion = useDeleteQuestion()
  const duplicateQuestion = useDuplicateQuestion()

  const test = testData?.data
  const questions = questionsData?.data || []

  // Handle add new question
  const handleAdd = () => {
    setEditingQuestion(null)
    setIsFormOpen(true)
  }

  // Handle edit question
  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setIsFormOpen(true)
  }

  // Handle delete question
  const handleDelete = (question: Question) => {
    if (window.confirm(`"${question.question_text.substring(0, 50)}..." savolini o'chirmoqchimisiz?`)) {
      deleteQuestion.mutate({
        testId: testId!,
        questionId: question.id,
      })
    }
  }

  // Handle duplicate question
  const handleDuplicate = (question: Question) => {
    duplicateQuestion.mutate({
      testId: testId!,
      questionId: question.id,
    })
  }

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingQuestion(null)
  }

  // Loading state
  if (loadingTest || loadingQuestions) {
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
          <p className="text-muted-foreground mt-1">
            Savollarni boshqaring
          </p>
        </div>
        <Button onClick={handleAdd} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Savol qo'shish
        </Button>
      </div>

      {/* Test Info */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{questions.length}</p>
            <p className="text-sm text-muted-foreground">Jami savollar</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {questions.reduce((sum, q) => sum + q.points, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Jami ball</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {questions.filter((q) => q.can_auto_grade).length}
            </p>
            <p className="text-sm text-muted-foreground">Avto baholanadi</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {questions.filter((q) => q.requires_manual_grading).length}
            </p>
            <p className="text-sm text-muted-foreground">Qo'lda baholanadi</p>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-xl font-semibold mb-2">Hozircha savollar yo'q</p>
          <p className="text-muted-foreground mb-6">
            Testga birinchi savolni qo'shing
          </p>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Birinchi savol qo'shish
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="flex gap-4">
                {/* Drag handle */}
                <div className="flex items-center">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Badge variant="outline" className="mt-1">
                        #{index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-lg mb-2">
                          {question.question_text}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {QUESTION_TYPE_NAMES[question.question_type]}
                          </Badge>
                          <Badge variant="outline">
                            {question.points} ball
                          </Badge>
                          {question.is_required && (
                            <Badge variant="destructive">Majburiy</Badge>
                          )}
                          {question.can_auto_grade ? (
                            <Badge variant="success">Avto baholanadi</Badge>
                          ) : (
                            <Badge variant="warning">Qo'lda baholanadi</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer options for MC */}
                  {question.is_multiple_choice && question.answers && question.answers.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <p className="text-sm font-medium mb-2">Javob variantlari:</p>
                      <div className="space-y-1">
                        {question.answers.map((answer, idx) => (
                          <div
                            key={answer.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-muted-foreground">{String.fromCharCode(65 + idx)}.</span>
                            <span className={answer.is_correct ? 'text-green-600 font-medium' : ''}>
                              {answer.answer_text}
                            </span>
                            {answer.is_correct && (
                              <Badge variant="success" className="text-xs">To'g'ri</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* True/False answer */}
                  {question.is_true_false && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <p className="text-sm">
                        <span className="font-medium">To'g'ri javob:</span>{' '}
                        <Badge variant="success">
                          {question.correct_answer_boolean ? "To'g'ri" : "Noto'g'ri"}
                        </Badge>
                      </p>
                    </div>
                  )}

                  {/* Short answer */}
                  {question.is_short_answer && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <p className="text-sm">
                        <span className="font-medium">To'g'ri javob:</span>{' '}
                        <code className="px-2 py-1 bg-muted rounded">
                          {question.correct_answer_text}
                        </code>
                        {question.case_sensitive && (
                          <Badge variant="outline" className="ml-2">
                            Katta-kichik harf farqlanadi
                          </Badge>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Essay */}
                  {question.is_essay && question.word_limit && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <p className="text-sm">
                        <span className="font-medium">So'z limiti:</span> {question.word_limit} ta so'z
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Tushuntirish:</span> {question.explanation}
                      </p>
                    </div>
                  )}

                  {/* Statistics */}
                  {question.statistics.total_answers > 0 && (
                    <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                      <div>
                        <strong>Javoblar:</strong> {question.statistics.total_answers}
                      </div>
                      <div>
                        <strong className="text-green-600">To'g'ri:</strong>{' '}
                        {question.statistics.correct_answers} ({question.statistics.correct_percentage}%)
                      </div>
                      <div>
                        <strong>O'rtacha ball:</strong> {question.statistics.average_points}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(question)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(question)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(question)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/teacher/tests/${testId}`)}
        >
          Test sahifasiga qaytish
        </Button>
        <div className="flex gap-4">
          {questions.length > 0 && !test.is_published && (
            <Button onClick={() => navigate(`/teacher/tests/${testId}/edit`)}>
              Test sozlamalarini tahrirlash
            </Button>
          )}
          {questions.length > 0 && (
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Yana savol qo'shish
            </Button>
          )}
        </div>
      </div>

      {/* Question Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? 'Savol ma\'lumotlarini yangilang'
                : 'Testga yangi savol qo\'shing'}
            </DialogDescription>
          </DialogHeader>
          <QuestionForm
            testId={testId!}
            question={editingQuestion}
            onSuccess={handleFormClose}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
