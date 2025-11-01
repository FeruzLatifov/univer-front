import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Download, FileText, Calendar, User, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useSubmissionDetail, useGradeSubmission, useDownloadSubmissionFile } from '@/hooks/useAssignments'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'

// Validation schema
const gradingSchema = z.object({
  score: z.number().min(0, 'Ball 0 dan kam bo\'lishi mumkin emas'),
  feedback: z.string().optional(),
  return_for_revision: z.boolean().default(false),
})

type GradingFormValues = z.infer<typeof gradingSchema>

interface GradingDialogProps {
  submissionId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GradingDialog({ submissionId, open, onOpenChange }: GradingDialogProps) {
  const { data: submissionData, isLoading } = useSubmissionDetail(submissionId)
  const gradeSubmission = useGradeSubmission()
  const downloadFile = useDownloadSubmissionFile()

  const submission = submissionData?.data

  // Form setup
  const form = useForm<GradingFormValues>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      score: 0,
      feedback: '',
      return_for_revision: false,
    },
  })

  // Update form when submission loads
  useEffect(() => {
    if (submission) {
      form.reset({
        score: submission.score || 0,
        feedback: submission.feedback || '',
        return_for_revision: false,
      })
    }
  }, [submission, form])

  // Calculate max score based on submission
  const maxScore = submission?.max_score || 100

  // Validate score against max score
  useEffect(() => {
    if (submission) {
      const schema = gradingSchema.extend({
        score: z.number()
          .min(0, 'Ball 0 dan kam bo\'lishi mumkin emas')
          .max(submission.max_score, `Ball ${submission.max_score} dan oshmasligi kerak`),
      })
      form.clearErrors()
    }
  }, [submission, form])

  // Handle form submission
  const onSubmit = async (values: GradingFormValues) => {
    try {
      await gradeSubmission.mutateAsync({
        submissionId,
        data: {
          score: values.score,
          feedback: values.feedback,
          return_for_revision: values.return_for_revision,
        },
      })
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
      console.error('Failed to grade submission:', error)
    }
  }

  // Handle file download
  const handleDownload = async (fileIndex?: number) => {
    try {
      await downloadFile.mutateAsync({ submissionId, fileIndex })
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  // Calculate percentage and letter grade
  const calculatePercentage = (score: number) => {
    return Math.round((score / maxScore) * 100)
  }

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 86) return 'A'
    if (percentage >= 71) return 'B'
    if (percentage >= 56) return 'C'
    if (percentage >= 41) return 'D'
    if (percentage >= 31) return 'E'
    return 'F'
  }

  // Watch score field for live preview
  const watchedScore = form.watch('score')
  const currentPercentage = watchedScore ? calculatePercentage(watchedScore) : 0
  const currentLetterGrade = getLetterGrade(currentPercentage)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Javobni baholash</DialogTitle>
          <DialogDescription>
            Talaba javobini ko'rib chiqing va ball bering
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : submission ? (
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Talaba</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.student.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {submission.student.student_id_number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Topshirgan vaqti</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.submitted_at
                      ? format(new Date(submission.submitted_at), 'dd MMM yyyy, HH:mm', {
                          locale: uz,
                        })
                      : 'Topshirilmagan'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <Badge
                  variant={
                    submission.status === 'graded'
                      ? 'default'
                      : submission.status === 'returned'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {submission.status === 'graded' && 'Baholandi'}
                  {submission.status === 'submitted' && 'Topshirildi'}
                  {submission.status === 'returned' && 'Qaytarildi'}
                  {submission.status === 'viewed' && 'Ko\'rildi'}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Urinish</p>
                <Badge variant="outline">{submission.attempt_number}</Badge>
              </div>
            </div>

            {/* Submission Text */}
            {submission.submission_text && (
              <div>
                <h4 className="font-semibold mb-2">Javob matni</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm whitespace-pre-wrap">
                    {submission.submission_text}
                  </p>
                </div>
              </div>
            )}

            {/* Files */}
            {submission.all_files && submission.all_files.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Yuborilgan fayllar</h4>
                <div className="space-y-2">
                  {submission.all_files.map((file, index) => (
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
                          {file.legacy && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Legacy
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file.legacy ? undefined : index)}
                        disabled={downloadFile.isPending}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Yuklash
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous feedback (if graded) */}
            {submission.status === 'graded' && submission.feedback && (
              <div>
                <h4 className="font-semibold mb-2">Oldingi feedback</h4>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm whitespace-pre-wrap">{submission.feedback}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Grading Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Score */}
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ball *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            min="0"
                            max={maxScore}
                            step="0.5"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-muted-foreground">
                            / {maxScore}
                          </span>
                          {watchedScore > 0 && (
                            <div className="flex items-center gap-2 ml-auto">
                              <Badge variant="outline">{currentPercentage}%</Badge>
                              <Badge>{currentLetterGrade}</Badge>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Talabaning olgan balli (maksimal: {maxScore})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Feedback */}
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Izoh</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Talaba uchun izoh va tavsiyalar..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Talabaga ko'rsatma va tavsiyalar bering
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Return for revision */}
                <FormField
                  control={form.control}
                  name="return_for_revision"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Qayta ishlash uchun qaytarish</FormLabel>
                        <FormDescription>
                          Talaba javobini qayta ko'rib chiqishi va yangilashi kerak
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Warning for low score */}
                {watchedScore > 0 && currentPercentage < 56 && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        Past ball
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Bu ball o'tish balliga yetmaydi (56%). Talabaga qayta urinish imkoniyatini
                        bering.
                      </p>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={gradeSubmission.isPending}
                  >
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={gradeSubmission.isPending}>
                    {gradeSubmission.isPending
                      ? 'Saqlanmoqda...'
                      : form.watch('return_for_revision')
                      ? 'Qaytarish'
                      : 'Baholash'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Javob topilmadi</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
