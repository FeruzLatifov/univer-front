import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Upload, X } from 'lucide-react'
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
import { useAssignment, useCreateAssignment, useUpdateAssignment, useMySubjects, useMyGroups } from '@/hooks/useAssignments'
import type { CreateAssignmentRequest } from '@/lib/api/teacher'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'

// Validation schema
const assignmentSchema = z.object({
  subject_id: z.number(),
  group_id: z.number(),
  title: z.string().min(3, "Sarlavha kamida 3 ta belgidan iborat bo'lishi kerak"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  deadline: z.string().min(1, 'Muddat kiritilishi shart'),
  max_score: z.number().min(1, 'Maksimal ball kamida 1 bo\'lishi kerak'),
  marking_category: z.string().optional(),
  allow_late: z.boolean().optional(),
  attempt_count: z.number().min(1, 'Urinishlar soni kamida 1 bo\'lishi kerak').optional(),
  publish_now: z.boolean().optional(),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

export function CreateAssignmentPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const assignmentId = id ? Number(id) : undefined
  const isEditMode = !!assignmentId

  const createAssignment = useCreateAssignment()
  const updateAssignment = useUpdateAssignment()
  const [files, setFiles] = useState<File[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>()

  // Fetch existing assignment if in edit mode
  const { data: assignmentData, isLoading: loadingAssignment } = useAssignment(assignmentId)
  const existingAssignment = assignmentData?.data

  // Fetch dropdown data
  const { data: subjectsData } = useMySubjects()
  const { data: groupsData } = useMyGroups(selectedSubjectId)

  const subjects = subjectsData?.data || []
  const groups = groupsData?.data || []

  // Form setup
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      max_score: 100,
      attempt_count: 1,
      allow_late: false,
      publish_now: true,
    },
  })

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && existingAssignment) {
      setSelectedSubjectId(existingAssignment.subject.id)
      form.reset({
        subject_id: existingAssignment.subject.id,
        group_id: existingAssignment.group.id,
        title: existingAssignment.title,
        description: existingAssignment.description || '',
        instructions: existingAssignment.instructions || '',
        deadline: existingAssignment.deadline,
        max_score: existingAssignment.max_score,
        marking_category: existingAssignment.marking_category || undefined,
        allow_late: existingAssignment.allow_late,
        attempt_count: existingAssignment.attempt_count || 1,
        publish_now: existingAssignment.is_published,
      })
    }
  }, [isEditMode, existingAssignment, form])

  // Handle form submission
  const onSubmit = async (values: AssignmentFormValues) => {
    try {
      if (isEditMode && assignmentId) {
        // Update existing assignment
        await updateAssignment.mutateAsync({
          id: assignmentId,
          data: values,
        })
      } else {
        // Create new assignment
        const requestData: CreateAssignmentRequest = {
          ...values,
          files: files.length > 0 ? files : undefined,
        }
        await createAssignment.mutateAsync(requestData)
      }
      navigate('/teacher/assignments')
    } catch (error) {
      // Error handled by mutation
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} assignment:`, error)
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Loading state in edit mode
  if (isEditMode && loadingAssignment) {
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
          onClick={() => navigate('/teacher/assignments')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Topshiriqni tahrirlash' : 'Yangi topshiriq yaratish'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode
              ? 'Topshiriq ma\'lumotlarini yangilang'
              : 'Talabalar uchun yangi topshiriq qo\'shing'}
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
                Topshiriq haqida asosiy ma'lumotlarni kiriting
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
                          // Reset group when subject changes
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
                      <FormLabel>Guruh *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={!selectedSubjectId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedSubjectId ? "Guruh tanlang" : "Avval fan tanlang"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Input placeholder="Topshiriq sarlavhasi" {...field} />
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
                        placeholder="Topshiriq haqida batafsil ma'lumot..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Talabalar uchun topshiriq tavsifi va ko'rsatmalari
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
                        placeholder="Talabalarga qo'shimcha ko'rsatmalar..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ixtiyoriy bo'lsa-da, tushunarli ko'rsatma berish tavsiya etiladi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deadline and Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muddat *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maksimal ball *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
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

          {/* Files */}
          <Card>
            <CardHeader>
              <CardTitle>Fayllar</CardTitle>
              <CardDescription>
                Topshiriq uchun zarur materiallarni yuklang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File input */}
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Fayl yuklash
                </Button>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX, PPT, PPTX, ZIP (Maks. 50MB)
                </p>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <Upload className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Qo'shimcha sozlamalar</CardTitle>
              <CardDescription>
                Akademik kontekst va boshqa parametrlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="marking_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baholash kategoriyasi</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value || undefined)}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategoriya tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="current">Joriy nazorat</SelectItem>
                          <SelectItem value="midterm">Oraliq nazorat</SelectItem>
                          <SelectItem value="final">Yakuniy nazorat</SelectItem>
                          <SelectItem value="independent">Mustaqil ish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attempt_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urinishlar soni</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Talaba necha marta topshirishi mumkin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allow_late"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <FormLabel>Kech topshirishga ruxsat</FormLabel>
                        <FormDescription>Muddati o'tganidan keyin ham topshirishga imkon berish</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publish_now"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <FormLabel>Darhol nashr qilish</FormLabel>
                        <FormDescription>Saqlangandan so'ng talabalar uchun ochiq bo'lsin</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? true}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/assignments')}
              disabled={createAssignment.isPending || updateAssignment.isPending}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={createAssignment.isPending || updateAssignment.isPending}
            >
              {isEditMode
                ? updateAssignment.isPending
                  ? 'Saqlanmoqda...'
                  : 'Saqlash'
                : createAssignment.isPending
                ? 'Yaratilmoqda...'
                : 'Yaratish'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
