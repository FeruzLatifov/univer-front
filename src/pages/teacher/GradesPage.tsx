import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  TrendingUp,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  Download,
  BarChart3
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getTeacherSubjects } from '@/lib/api/subjects'
import {
  getSubjectGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  GRADE_TYPES,
  LETTER_GRADES,
  getLetterGrade,
  type CreateGradePayload
} from '@/lib/api/grades'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function GradesPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [gradeTypeFilter, setGradeTypeFilter] = useState<string>('all')
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  // Get teacher's subjects
  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: () => getTeacherSubjects({ per_page: 100 }),
  })

  // Get grades for selected subject
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['subject-grades', selectedSubject, gradeTypeFilter],
    queryFn: () =>
      getSubjectGrades(selectedSubject!, {
        grade_type: gradeTypeFilter === 'all' ? undefined : gradeTypeFilter,
      }),
    enabled: !!selectedSubject,
  })

  const subjects = subjectsData?.data || []
  const students = gradesData?.data || []

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    averageGrade:
      students.length > 0
        ? students.reduce((sum, s) => sum + s.average_grade, 0) / students.length
        : 0,
    highestGrade: students.length > 0 ? Math.max(...students.map((s) => s.average_grade)) : 0,
    lowestGrade: students.length > 0 ? Math.min(...students.map((s) => s.average_grade)) : 0,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Baholar</h1>
          <p className="text-muted-foreground mt-1">
            Talabalar baholarini kiriting va kuzating
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Download className="w-4 h-4 mr-2" />
            Eksport
          </Button>
          <Button variant="outline" disabled>
            <BarChart3 className="w-4 h-4 mr-2" />
            Hisobot
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fan</label>
              <Select
                value={selectedSubject?.toString()}
                onValueChange={(value) => setSelectedSubject(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fanni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {t(subject, 'name')} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Baho turi</label>
              <Select value={gradeTypeFilter} onValueChange={setGradeTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha baholar</SelectItem>
                  {Object.entries(GRADE_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSubject ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fanni tanlang</h3>
                <p className="text-muted-foreground mt-1">
                  Baholarni ko'rish uchun avval fanni tanlang
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jami talabalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalStudents}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>O'rtacha baho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.averageGrade.toFixed(1)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Eng yuqori baho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.highestGrade.toFixed(1)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Eng past baho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.lowestGrade.toFixed(1)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grades Table */}
          <Card>
            <CardHeader>
              <CardTitle>Talabalar ro'yxati</CardTitle>
              <CardDescription>{students.length} ta talaba</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Talabalar topilmadi
                </p>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => {
                    const letterGrade = getLetterGrade(student.percentage)
                    const letterGradeInfo = LETTER_GRADES[letterGrade]

                    return (
                      <div
                        key={student.student_id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar>
                            <AvatarFallback>
                              {student.student_name.split(' ')[0][0]}
                              {student.student_name.split(' ')[1]?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{student.student_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.student_id_number}
                              {student.group_name && ` • ${student.group_name}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Grades breakdown */}
                          {student.grades.length > 0 && (
                            <div className="flex gap-1">
                              {student.grades.slice(0, 5).map((grade, idx) => {
                                const gradeTypeInfo =
                                  GRADE_TYPES[grade.grade_type as keyof typeof GRADE_TYPES]
                                return (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={cn('text-xs', gradeTypeInfo?.color)}
                                  >
                                    {grade.grade_value}/{grade.max_grade}
                                  </Badge>
                                )
                              })}
                              {student.grades.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{student.grades.length - 5}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Average grade */}
                          <div className="text-right min-w-[80px]">
                            <div className="text-2xl font-bold">
                              {student.average_grade.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.percentage.toFixed(0)}%
                            </div>
                          </div>

                          {/* Letter grade */}
                          <Badge className={cn('min-w-[60px] justify-center', letterGradeInfo.color)}>
                            {letterGrade}
                          </Badge>

                          {/* Actions */}
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student.student_id)
                              setIsAddGradeOpen(true)
                            }}
                          >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Baho qo'shish
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Grade Dialog */}
      <AddGradeDialog
        open={isAddGradeOpen}
        onOpenChange={setIsAddGradeOpen}
        subjectId={selectedSubject}
        studentId={selectedStudent}
      />
    </div>
  )
}

// Add Grade Dialog Component
function AddGradeDialog({
  open,
  onOpenChange,
  subjectId,
  studentId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectId: number | null
  studentId: number | null
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<Partial<CreateGradePayload>>({
    grade_type: 'quiz',
    date: new Date().toISOString().split('T')[0],
  })

  const createGradeMutation = useMutation({
    mutationFn: createGrade,
    onSuccess: () => {
      toast({
        title: "Baho qo'shildi",
        description: 'Baho muvaffaqiyatli saqlandi',
      })
      queryClient.invalidateQueries({ queryKey: ['subject-grades'] })
      onOpenChange(false)
      setFormData({
        grade_type: 'quiz',
        date: new Date().toISOString().split('T')[0],
      })
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Baho saqlanmadi',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectId || !studentId) return

    createGradeMutation.mutate({
      student_id: studentId,
      subject_id: subjectId,
      grade_type: formData.grade_type!,
      grade_value: Number(formData.grade_value),
      max_grade: Number(formData.max_grade),
      date: formData.date!,
      description: formData.description,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Baho qo'shish</DialogTitle>
          <DialogDescription>
            Talabaga yangi baho kiriting
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Baho turi</Label>
            <Select
              value={formData.grade_type}
              onValueChange={(value) => setFormData({ ...formData, grade_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GRADE_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Baho</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                required
                value={formData.grade_value || ''}
                onChange={(e) =>
                  setFormData({ ...formData, grade_value: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maksimal baho</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                required
                value={formData.max_grade || ''}
                onChange={(e) =>
                  setFormData({ ...formData, max_grade: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sana</Label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Izoh (ixtiyoriy)</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Baho haqida qo'shimcha ma'lumot..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={createGradeMutation.isPending}>
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
