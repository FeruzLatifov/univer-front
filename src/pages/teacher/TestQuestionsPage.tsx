import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Upload, Download, Trash2, Edit, GripVertical } from 'lucide-react'
import {
  getTest,
  getTestQuestions,
  deleteTestQuestion,
  reorderTestQuestions,
  importTestQuestions,
  exportTest,
} from '@/lib/api/tests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function TestQuestionsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const testId = Number(id)

  // Fetch test
  const { data: testData } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTest(testId),
  })

  // Fetch questions
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['test-questions', testId],
    queryFn: () => getTestQuestions(testId),
  })

  const deleteMutation = useMutation({
    mutationFn: (questionId: number) => deleteTestQuestion(testId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-questions', testId] })
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Savol o\'chirildi',
      })
      setDeleteDialogOpen(false)
    },
  })

  const importMutation = useMutation({
    mutationFn: (file: File) => importTestQuestions(testId, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['test-questions', testId] })
      toast({
        title: 'Muvaffaqiyatli',
        description: `${data.data.imported} ta savol import qilindi`,
      })
      setImportDialogOpen(false)
      setImportFile(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Import qilishda xatolik',
        variant: 'destructive',
      })
    },
  })

  const handleExport = async () => {
    try {
      await exportTest(testId)
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Test eksport qilindi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Eksport qilishda xatolik',
        variant: 'destructive',
      })
    }
  }

  const handleImport = () => {
    if (importFile) {
      importMutation.mutate(importFile)
    }
  }

  const test = testData?.data
  const questions = questionsData?.data || []

  const getQuestionTypeBadge = (type: number) => {
    switch (type) {
      case 10:
        return <Badge variant="default">Bitta tanlov</Badge>
      case 20:
        return <Badge variant="secondary">Ko'p tanlov</Badge>
      case 30:
        return <Badge variant="outline">Matn</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/tests')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Testlarga qaytish
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{test?.name}</h1>
            <p className="text-muted-foreground mt-1">
              Savollarni boshqarish va tahrirlash
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={questions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Eksport
            </Button>
            <Button onClick={() => navigate(`/teacher/tests/${testId}/questions/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Savol qo'shish
            </Button>
          </div>
        </div>
      </div>

      {/* Test Info */}
      {test && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Savollar soni</div>
                <div className="text-2xl font-bold">{questions.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Davomiylik</div>
                <div className="text-2xl font-bold">{test.duration} daq</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Jami ball</div>
                <div className="text-2xl font-bold">
                  {questions.reduce((sum: number, q: any) => sum + q.points, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">O'tish balli</div>
                <div className="text-2xl font-bold">{test.passing_score}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Savollar yo'q</h3>
                <p className="text-muted-foreground mt-1">
                  Testga savollar qo'shishni boshlang
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate(`/teacher/tests/${testId}/questions/create`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Savol qo'shish
                </Button>
                <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Excel dan import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question: any, index: number) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="cursor-move pt-1">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Savol {index + 1}</Badge>
                          {getQuestionTypeBadge(question.question_type)}
                          <Badge variant="secondary">{question.points} ball</Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {question.question_text}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/teacher/tests/${testId}/questions/${question.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedQuestionId(question.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Javoblar:
                  </div>
                  {question.answers?.map((answer: any, idx: number) => (
                    <div
                      key={answer.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        answer.is_correct
                          ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1">{answer.answer_text}</div>
                      {answer.is_correct && (
                        <Badge variant="default" className="bg-green-600">
                          To'g'ri
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Savolni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu savolni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedQuestionId && deleteMutation.mutate(selectedQuestionId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel dan import</DialogTitle>
            <DialogDescription>
              Excel fayldan savollarni import qiling
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Faqat .xlsx yoki .xls formatdagi fayllar qabul qilinadi
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setImportDialogOpen(false)
                  setImportFile(null)
                }}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile || importMutation.isPending}
              >
                {importMutation.isPending ? 'Yuklanmoqda...' : 'Import qilish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
