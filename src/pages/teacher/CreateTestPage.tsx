import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { createTest } from '@/lib/api/tests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  subject_id: z.number().min(1, 'Fanni tanlang'),
  name: z.string().min(3, 'Test nomi kamida 3 ta belgidan iborat bo\'lishi kerak'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Davomiylik kamida 1 daqiqa').max(180, 'Davomiylik maksimum 180 daqiqa'),
  max_attempts: z.number().min(1, 'Kamida 1 ta urinish').max(10, 'Maksimum 10 ta urinish'),
  passing_score: z.number().min(0, 'Minimum 0%').max(100, 'Maksimum 100%'),
  shuffle_questions: z.boolean().default(false),
  shuffle_answers: z.boolean().default(false),
  show_results: z.boolean().default(true),
  status: z.number().default(10), // 10: draft, 20: published
})

type FormValues = z.infer<typeof formSchema>

export default function CreateTestPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [saveAsDraft, setSaveAsDraft] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject_id: 0,
      name: '',
      description: '',
      duration: 60,
      max_attempts: 3,
      passing_score: 70,
      shuffle_questions: false,
      shuffle_answers: false,
      show_results: true,
      status: 10,
    },
  })

  const createMutation = useMutation({
    mutationFn: createTest,
    onSuccess: (data) => {
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Test yaratildi',
      })
      navigate(`/teacher/tests/${data.data.id}/questions`)
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Test yaratishda xatolik yuz berdi',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      status: saveAsDraft ? 10 : 20,
    }
    createMutation.mutate(payload)
  }

  // Mock subjects - real implementation should fetch from API
  const subjects = [
    { id: 1, name: 'Matematika' },
    { id: 2, name: 'Fizika' },
    { id: 3, name: 'Informatika' },
  ]

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/tests')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold">Yangi test yaratish</h1>
        <p className="text-muted-foreground mt-1">
          Test haqida asosiy ma'lumotlarni kiriting
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Asosiy ma'lumotlar</CardTitle>
              <CardDescription>
                Test nomi, tavsifi va fanni kiriting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fan *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Fanni tanlang" />
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

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test nomi *</FormLabel>
                    <FormControl>
                      <Input placeholder="Misol: 1-Modul nazorat ishi" {...field} />
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
                        placeholder="Test haqida qo'shimcha ma'lumot..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Testning maqsadi va mavzularini yozing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sozlamalar</CardTitle>
              <CardDescription>
                Test davomiyligi, urinishlar soni va o'tish balli
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Davomiylik (daqiqa) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={180}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Attempts */}
                <FormField
                  control={form.control}
                  name="max_attempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urinishlar soni *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Passing Score */}
                <FormField
                  control={form.control}
                  name="passing_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O'tish balli (%) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle>Qo'shimcha parametrlar</CardTitle>
              <CardDescription>
                Testning tartibini va natijalarni ko'rsatish sozlamalari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Shuffle Questions */}
              <FormField
                control={form.control}
                name="shuffle_questions"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Savollarni aralashtiris
                      </FormLabel>
                      <FormDescription>
                        Har bir talaba uchun savollar tartibini tasodifiy o'zgartirish
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

              {/* Shuffle Answers */}
              <FormField
                control={form.control}
                name="shuffle_answers"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Javoblarni aralashtiris
                      </FormLabel>
                      <FormDescription>
                        Har bir savol uchun javoblar tartibini tasodifiy o'zgartirish
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

              {/* Show Results */}
              <FormField
                control={form.control}
                name="show_results"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Natijalarni ko'rsatish
                      </FormLabel>
                      <FormDescription>
                        Test tugagandan so'ng talabaga natijani ko'rsatish
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/tests')}
            >
              Bekor qilish
            </Button>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={createMutation.isPending}
                onClick={() => setSaveAsDraft(true)}
              >
                <Save className="w-4 h-4 mr-2" />
                Qoralama sifatida saqlash
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                onClick={() => setSaveAsDraft(false)}
              >
                Saqlash va davom etish
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
