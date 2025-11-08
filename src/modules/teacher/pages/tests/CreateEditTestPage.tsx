import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useTest, useCreateTest, useUpdateTest } from '@/hooks/useTests'
import { useMySubjects, useMyGroups } from '@/hooks/useAssignments'
import type { CreateTestRequest } from '@/lib/api/teacher'
import { useUserStore } from '@/stores/auth'

// Validation schema
const testSchema = z.object({
  subject_id: z.number(),
  group_id: z.number().optional(),
  subject_topic_id: z.number().optional(),
  title: z.string().min(3, 'Sarlavha kamida 3 ta belgidan iborat bo\'lishi kerak'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  duration: z.number().min(1, 'Davomiylik kamida 1 daqiqa bo\'lishi kerak').optional(),
  passing_score: z.number().min(0).max(100, 'O\'tish balli 0 dan 100 gacha bo\'lishi kerak').optional(),
  randomize_questions: z.boolean().default(false),
  randomize_answers: z.boolean().default(false),
  show_correct_answers: z.boolean().default(true),
  attempt_limit: z.number().min(1, 'Urinishlar soni kamida 1 bo\'lishi kerak').default(1),
  allow_review: z.boolean().default(true),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  position: z.number().default(0),
})

type TestFormValues = z.infer<typeof testSchema>

export function CreateEditTestPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const testId = id ? Number(id) : undefined
  const isEditMode = !!testId
  const { user } = useUserStore()

  const createTest = useCreateTest()
  const updateTest = useUpdateTest()
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>()

  // Fetch existing test if in edit mode
  const { data: testData, isLoading: loadingTest } = useTest(testId)
  const existingTest = testData?.data

  // Fetch dropdown data
  const { data: subjectsData } = useMySubjects()
  const { data: groupsData } = useMyGroups(selectedSubjectId)

  const subjects = subjectsData?.data || []
  const groups = groupsData?.data || []

  // Form setup
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      duration: 60, // Default 60 minutes
      passing_score: 56, // Default 56%
      randomize_questions: false,
      randomize_answers: false,
      show_correct_answers: true,
      attempt_limit: 1,
      allow_review: true,
      position: 0,
    },
  })

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && existingTest) {
      setSelectedSubjectId(existingTest.subject.id)
      form.reset({
        subject_id: existingTest.subject.id,
        group_id: existingTest.group?.id,
        subject_topic_id: existingTest.topic?.id,
        title: existingTest.title,
        description: existingTest.description || '',
        instructions: existingTest.instructions || '',
        duration: existingTest.duration || undefined,
        passing_score: existingTest.passing_score || undefined,
        randomize_questions: existingTest.randomize_questions,
        randomize_answers: existingTest.randomize_answers,
        show_correct_answers: existingTest.show_correct_answers,
        attempt_limit: existingTest.attempt_limit,
        allow_review: existingTest.allow_review,
        start_date: existingTest.start_date || undefined,
        end_date: existingTest.end_date || undefined,
        position: existingTest.position,
      })
    }
  }, [isEditMode, existingTest, form])

  // Handle form submission
  const onSubmit = async (values: TestFormValues) => {
    try {
      const payload: CreateTestRequest = {
        ...values,
        employee_id: user?.id,
      }

      if (isEditMode && testId) {
        await updateTest.mutateAsync({
          id: testId,
          data: payload,
        })
        navigate(`/teacher/tests/${testId}`)
      } else {
        const response = await createTest.mutateAsync(payload)
        navigate(`/teacher/tests/${response.data.id}/questions`)
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} test:`, error)
    }
  }

  // Loading state in edit mode
  if (isEditMode && loadingTest) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/teacher/tests')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Testni tahrirlash' : 'Yangi test yaratish'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode
              ? 'Test ma\'lumotlarini yangilang'
              : 'Talabalar uchun yangi test qo\'shing'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asosiy ma'lumotlar</CardTitle>
              <CardDescription>
                Test haqida asosiy ma'lumotlarni kiriting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject and Group */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fan *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const numValue = Number(value)
                          field.onChange(numValue)
                          setSelectedSubjectId(numValue)
                          form.resetField('group_id')
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fan tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guruh</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={!selectedSubjectId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedSubjectId ? "Guruh tanlang (ixtiyoriy)" : "Avval fan tanlang"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Barcha guruhlar</SelectItem>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ixtiyoriy. Tanlanmasa barcha guruhlarga ochiq bo'ladi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sarlavha *</FormLabel>
                    <FormControl>
                      <Input placeholder="Test sarlavhasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tavsif</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Test haqida qisqacha ma'lumot..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Test haqida qisqacha ma'lumot (ixtiyoriy)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instructions */}
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ko'rsatmalar</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Testni boshlashdan oldin o'qish uchun ko'rsatmalar..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Talabalar uchun ko'rsatmalar (ixtiyoriy)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Test Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Test sozlamalari</CardTitle>
              <CardDescription>
                Test parametrlarini belgilang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Duration and Passing Score */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Davomiylik (daqiqa)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="60"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Bo'sh qoldiring cheklanmagan uchun
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passing_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O'tish balli (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="56"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        0 dan 100 gacha
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attempt_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urinishlar soni</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Har bir talaba uchun
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boshlanish vaqti</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Bo'sh qoldiring darhol boshlanishi uchun
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tugash vaqti</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Bo'sh qoldiring cheklanmagan uchun
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Boolean Settings */}
              <div className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="randomize_questions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Savollarni aralashtiribir
                        </FormLabel>
                        <FormDescription>
                          Har bir talaba uchun savol tartibi tasodifiy bo'ladi
                        </FormDescription>
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

                <FormField
                  control={form.control}
                  name="randomize_answers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Javoblarni aralashtiribir
                        </FormLabel>
                        <FormDescription>
                          Ko'p variantli savollarda javoblar tartibi aralashtiriladi
                        </FormDescription>
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

                <FormField
                  control={form.control}
                  name="show_correct_answers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          To'g'ri javoblarni ko'rsatish
                        </FormLabel>
                        <FormDescription>
                          Test yakunlangach to'g'ri javoblar ko'rsatilsin
                        </FormDescription>
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

                <FormField
                  control={form.control}
                  name="allow_review"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Testni ko'rib chiqishga ruxsat
                        </FormLabel>
                        <FormDescription>
                          Yuborilgandan keyin talaba javoblarini ko'ra olsin
                        </FormDescription>
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/tests')}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={createTest.isPending || updateTest.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Saqlash' : 'Yaratish va savollar qo\'shish'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
