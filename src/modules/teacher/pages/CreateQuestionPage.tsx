import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react'
import { useAddQuestion } from '@/hooks/useTests'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  question_text: z.string().min(5, 'Savol kamida 5 ta belgidan iborat bo\'lishi kerak'),
  question_type: z.number(),
  points: z.number().min(1).max(100),
  answers: z.array(
    z.object({
      answer_text: z.string().min(1, 'Javob matnini kiriting'),
      is_correct: z.boolean(),
    })
  ).min(2, 'Kamida 2 ta javob bo\'lishi kerak'),
}).refine(
  (data) => data.answers.some((answer) => answer.is_correct),
  {
    message: 'Kamida 1 ta to\'g\'ri javob belgilang',
    path: ['answers'],
  }
)

type FormValues = z.infer<typeof formSchema>

export default function CreateQuestionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const testId = Number(id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_text: '',
      question_type: 10,
      points: 1,
      answers: [
        { answer_text: '', is_correct: false },
        { answer_text: '', is_correct: false },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'answers',
  })

  const createMutation = useAddQuestion()

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({ testId, data: values }, {
      onSuccess: () => {
        navigate(`/teacher/tests/${testId}/questions`)
      },
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/teacher/tests/${testId}/questions`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold">Yangi savol qo'shish</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Savol ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Type */}
              <FormField
                control={form.control}
                name="question_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Savol turi</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">Bitta tanlov (Single choice)</SelectItem>
                        <SelectItem value="20">Ko'p tanlov (Multiple choice)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Points */}
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ball</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
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
                    <FormLabel>Savol matni</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Savolni yozing..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Answers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Javoblar</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ answer_text: '', is_correct: false })}
                  disabled={fields.length >= 6}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Javob qo'shish
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <FormField
                      control={form.control}
                      name={`answers.${index}.answer_text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Javob matnini kiriting..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`answers.${index}.is_correct`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            To'g'ri javob
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/teacher/tests/${testId}/questions`)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              <Check className="w-4 h-4 mr-2" />
              Saqlash
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
