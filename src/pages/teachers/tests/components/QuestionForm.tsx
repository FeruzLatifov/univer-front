import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useAddQuestion, useUpdateQuestion, useAddAnswerOption, useUpdateAnswerOption, useDeleteAnswerOption } from '@/hooks/useTests'
import { QUESTION_TYPES } from '@/lib/api/teacher'
import type { Question, QuestionType, AnswerOption } from '@/lib/api/teacher'

// Validation schema
const questionSchema = z.object({
  question_text: z.string().min(5, 'Savol matni kamida 5 ta belgidan iborat bo\'lishi kerak'),
  question_type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay']),
  points: z.number().min(0.1, 'Ball kamida 0.1 bo\'lishi kerak'),
  position: z.number().default(0),
  is_required: z.boolean().default(false),
  explanation: z.string().optional(),
  // Multiple choice
  allow_multiple: z.boolean().default(false),
  // True/False
  correct_answer_boolean: z.boolean().optional(),
  // Short answer
  correct_answer_text: z.string().optional(),
  case_sensitive: z.boolean().default(false),
  // Essay
  word_limit: z.number().optional(),
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface QuestionFormProps {
  testId: number
  question?: Question | null
  onSuccess: () => void
  onCancel: () => void
}

interface AnswerOptionForm {
  id?: number
  answer_text: string
  is_correct: boolean
  position: number
}

export function QuestionForm({ testId, question, onSuccess, onCancel }: QuestionFormProps) {
  const isEditMode = !!question
  const addQuestion = useAddQuestion()
  const updateQuestion = useUpdateQuestion()
  const addAnswerOption = useAddAnswerOption()
  const updateAnswerOption = useUpdateAnswerOption()
  const deleteAnswerOption = useDeleteAnswerOption()

  // Answer options for multiple choice
  const [answerOptions, setAnswerOptions] = useState<AnswerOptionForm[]>([])

  // Form setup
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      position: 0,
      is_required: false,
      allow_multiple: false,
      case_sensitive: false,
    },
  })

  const questionType = form.watch('question_type')

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && question) {
      form.reset({
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        position: question.position,
        is_required: question.is_required,
        explanation: question.explanation || '',
        allow_multiple: question.allow_multiple || false,
        correct_answer_boolean: question.correct_answer_boolean,
        correct_answer_text: question.correct_answer_text || '',
        case_sensitive: question.case_sensitive || false,
        word_limit: question.word_limit || undefined,
      })

      // Load answer options for MC
      if (question.is_multiple_choice && question.answers) {
        setAnswerOptions(
          question.answers.map((ans, idx) => ({
            id: ans.id,
            answer_text: ans.answer_text,
            is_correct: ans.is_correct,
            position: idx,
          }))
        )
      }
    }
  }, [isEditMode, question, form])

  // Handle form submission
  const onSubmit = async (values: QuestionFormValues) => {
    try {
      // Validation based on question type
      if (values.question_type === 'multiple_choice' && answerOptions.length < 2) {
        alert('Ko\'p variantli savol uchun kamida 2 ta javob kerak')
        return
      }

      if (values.question_type === 'multiple_choice' && !answerOptions.some((a) => a.is_correct)) {
        alert('Kamida bitta to\'g\'ri javob belgilang')
        return
      }

      if (values.question_type === 'true_false' && values.correct_answer_boolean === undefined) {
        alert('To\'g\'ri javobni tanlang')
        return
      }

      if (values.question_type === 'short_answer' && !values.correct_answer_text) {
        alert('To\'g\'ri javobni kiriting')
        return
      }

      // Prepare data
      const questionData: any = {
        ...values,
      }

      // Add correct answers for MC
      if (values.question_type === 'multiple_choice') {
        questionData.correct_answers = answerOptions
          .filter((a) => a.is_correct)
          .map((a) => a.id || 0)
      }

      if (isEditMode) {
        // Update question
        await updateQuestion.mutateAsync({
          testId,
          questionId: question.id,
          data: questionData,
        })

        // Update answer options for MC
        if (values.question_type === 'multiple_choice') {
          // Delete removed options
          const existingIds = question.answers?.map((a) => a.id) || []
          const currentIds = answerOptions.filter((a) => a.id).map((a) => a.id!)
          const deletedIds = existingIds.filter((id) => !currentIds.includes(id))

          for (const id of deletedIds) {
            await deleteAnswerOption.mutateAsync({
              testId,
              questionId: question.id,
              answerId: id,
            })
          }

          // Update/Create options
          for (const option of answerOptions) {
            if (option.id) {
              // Update existing
              await updateAnswerOption.mutateAsync({
                testId,
                questionId: question.id,
                answerId: option.id,
                data: {
                  answer_text: option.answer_text,
                  is_correct: option.is_correct,
                  position: option.position,
                },
              })
            } else {
              // Create new
              await addAnswerOption.mutateAsync({
                testId,
                questionId: question.id,
                data: {
                  answer_text: option.answer_text,
                  is_correct: option.is_correct,
                  position: option.position,
                },
              })
            }
          }
        }
      } else {
        // Create question
        const response = await addQuestion.mutateAsync({
          testId,
          data: questionData,
        })

        // Add answer options for MC
        if (values.question_type === 'multiple_choice' && response.data) {
          for (const option of answerOptions) {
            await addAnswerOption.mutateAsync({
              testId,
              questionId: response.data.id,
              data: {
                answer_text: option.answer_text,
                is_correct: option.is_correct,
                position: option.position,
              },
            })
          }
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save question:', error)
    }
  }

  // Answer options management
  const addAnswerOptionForm = () => {
    setAnswerOptions([
      ...answerOptions,
      {
        answer_text: '',
        is_correct: false,
        position: answerOptions.length,
      },
    ])
  }

  const removeAnswerOption = (index: number) => {
    setAnswerOptions(answerOptions.filter((_, i) => i !== index))
  }

  const updateAnswerOptionText = (index: number, text: string) => {
    const updated = [...answerOptions]
    updated[index].answer_text = text
    setAnswerOptions(updated)
  }

  const toggleCorrectAnswer = (index: number) => {
    const updated = [...answerOptions]
    const allowMultiple = form.watch('allow_multiple')

    if (allowMultiple) {
      // Multiple selection
      updated[index].is_correct = !updated[index].is_correct
    } else {
      // Single selection - uncheck others
      updated.forEach((opt, i) => {
        opt.is_correct = i === index
      })
    }
    setAnswerOptions(updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Type */}
        <FormField
          control={form.control}
          name="question_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savol turi *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isEditMode} // Can't change type in edit mode
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={QUESTION_TYPES.MULTIPLE_CHOICE}>
                    Ko'p variantli
                  </SelectItem>
                  <SelectItem value={QUESTION_TYPES.TRUE_FALSE}>
                    To'g'ri/Noto'g'ri
                  </SelectItem>
                  <SelectItem value={QUESTION_TYPES.SHORT_ANSWER}>
                    Qisqa javob
                  </SelectItem>
                  <SelectItem value={QUESTION_TYPES.ESSAY}>Insho</SelectItem>
                </SelectContent>
              </Select>
              {isEditMode && (
                <FormDescription>
                  Savol turi tahrirlashda o'zgartirib bo'lmaydi
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Question Text */}
        <FormField
          control={form.control}
          name="question_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savol matni *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Savolni kiriting..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Points */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ball *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Majburiy savol</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Type-specific fields */}

        {/* Multiple Choice */}
        {questionType === 'multiple_choice' && (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Javob variantlari</h3>
              <FormField
                control={form.control}
                name="allow_multiple"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-0">Ko'p javobli</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              {answerOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center">
                    {form.watch('allow_multiple') ? (
                      <Checkbox
                        checked={option.is_correct}
                        onCheckedChange={() => toggleCorrectAnswer(index)}
                      />
                    ) : (
                      <RadioGroupItem
                        value={index.toString()}
                        checked={option.is_correct}
                        onClick={() => toggleCorrectAnswer(index)}
                      />
                    )}
                  </div>
                  <Input
                    placeholder={`Javob ${String.fromCharCode(65 + index)}`}
                    value={option.answer_text}
                    onChange={(e) => updateAnswerOptionText(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAnswerOption(index)}
                    disabled={answerOptions.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addAnswerOptionForm}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Javob qo'shish
            </Button>
          </div>
        )}

        {/* True/False */}
        {questionType === 'true_false' && (
          <FormField
            control={form.control}
            name="correct_answer_boolean"
            render={({ field }) => (
              <FormItem className="p-4 border rounded-lg">
                <FormLabel>To'g'ri javob *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={field.value === true ? 'true' : field.value === false ? 'false' : ''}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <label htmlFor="true">To'g'ri</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <label htmlFor="false">Noto'g'ri</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Short Answer */}
        {questionType === 'short_answer' && (
          <div className="space-y-4 p-4 border rounded-lg">
            <FormField
              control={form.control}
              name="correct_answer_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'g'ri javob *</FormLabel>
                  <FormControl>
                    <Input placeholder="To'g'ri javobni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_sensitive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Katta-kichik harf farqlanadi</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Essay */}
        {questionType === 'essay' && (
          <FormField
            control={form.control}
            name="word_limit"
            render={({ field }) => (
              <FormItem className="p-4 border rounded-lg">
                <FormLabel>So'z limiti</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ixtiyoriy"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Bo'sh qoldiring limitni o'rnatmaslik uchun
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Explanation */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tushuntirish (ixtiyoriy)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Javobdan keyin ko'rsatiladigan tushuntirish..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Test yakunlangandan keyin talabaga ko'rsatiladi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={addQuestion.isPending || updateQuestion.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
