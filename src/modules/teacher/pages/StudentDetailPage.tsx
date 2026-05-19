import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Home,
  Calendar,
  User as UserIcon,
  BookOpen,
  Save,
  History,
} from 'lucide-react'
import {
  useTeacherStudent,
  useTeacherStudentHistory,
  useUpdateTeacherStudent,
} from '@/hooks/useTeacherStudent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UpdateStudentPayload } from '@/services/teacher/StudentService'

const EDITABLE_FIELDS: Array<{ key: keyof UpdateStudentPayload; label: string; type?: string }> = [
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'parent_phone', label: 'Ota-ona telefoni' },
  { key: 'person_phone', label: "Mas'ul shaxs telefoni" },
  { key: 'home_address', label: 'Uy manzili' },
  { key: 'current_address', label: 'Joriy manzil' },
  { key: '_country', label: 'Davlat kodi' },
  { key: '_province', label: 'Viloyat kodi' },
  { key: '_district', label: 'Tuman kodi' },
  { key: '_current_province', label: 'Joriy viloyat' },
  { key: '_current_district', label: 'Joriy tuman' },
  { key: '_current_terrain', label: 'Joriy hudud' },
  { key: '_student_living_status', label: 'Yashash statusi (kod)' },
  { key: 'roommate_count', label: 'Hamxonalar soni', type: 'number' },
  { key: 'geo_location', label: 'Geolokatsiya' },
]

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const studentId = id ? Number(id) : null

  const { data, isLoading, error } = useTeacherStudent(studentId)
  const { data: historyData } = useTeacherStudentHistory(studentId)
  const mutation = useUpdateTeacherStudent()

  const student = data?.student
  const meta = data?.meta

  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!student) return
    const initial: Record<string, string> = {}
    EDITABLE_FIELDS.forEach(({ key }) => {
      const value = (student as unknown as Record<string, unknown>)[key]
      initial[key] = value == null ? '' : String(value)
    })
    setForm(initial)
  }, [student])

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!studentId) return

    const payload: UpdateStudentPayload = {}
    EDITABLE_FIELDS.forEach(({ key, type }) => {
      const value = form[key]
      if (value === undefined || value === '') {
        payload[key] = null
      } else if (type === 'number') {
        payload[key] = Number(value) as never
      } else {
        ;(payload as Record<string, unknown>)[key] = value
      }
    })

    mutation.mutate({ id: studentId, payload })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link to="/teacher/groups">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Guruhlarga qaytish
          </Link>
        </Button>
        {isLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">{student?.full_name ?? 'Talaba'}</h1>
        )}
        {student && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">{student.student_id_number}</Badge>
            {meta?.group && <Badge variant="secondary">{meta.group.name}</Badge>}
            {meta?.specialty && <span className="text-sm text-muted-foreground">{meta.specialty.name}</span>}
          </div>
        )}
      </div>

      {error && (
        <Card className="border-error-200 bg-error-50 dark:bg-error-950">
          <CardContent className="pt-6">
            <p className="text-error-700 dark:text-error-300">
              Talaba ma'lumotlarini yuklashda xatolik
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      )}

      {!isLoading && student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  {student.image && <AvatarImage src={student.image} alt={student.full_name} />}
                  <AvatarFallback className="text-2xl">
                    {student.first_name[0]}
                    {student.second_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{student.full_name}</h2>
                <p className="text-sm text-muted-foreground">{student.student_id_number}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{student.email}</span>
                  </div>
                )}
                {student.parent_phone && (
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Ota-ona: {student.parent_phone}</span>
                  </div>
                )}
                {student.home_address && (
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{student.home_address}</span>
                  </div>
                )}
                {student.current_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{student.current_address}</span>
                  </div>
                )}
                {student.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{student.birth_date}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {meta && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Akademik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {meta.education_year && (
                    <div><span className="text-muted-foreground">O'quv yili: </span>{meta.education_year}</div>
                  )}
                  {meta.education_type && (
                    <div><span className="text-muted-foreground">Ta'lim turi: </span>{meta.education_type.name}</div>
                  )}
                  {meta.education_form && (
                    <div><span className="text-muted-foreground">Ta'lim shakli: </span>{meta.education_form.name}</div>
                  )}
                  {meta.payment_form && (
                    <div><span className="text-muted-foreground">To'lov shakli: </span>{meta.payment_form.name}</div>
                  )}
                  {meta.student_status && (
                    <div><span className="text-muted-foreground">Status: </span>
                      <Badge variant="outline">{meta.student_status}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Tahrirlash</TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-1" /> Tarix
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Kontakt va manzil ma'lumotlari</CardTitle>
                    <CardDescription>
                      Faqat tutor o'zgartira oladigan maydonlar. Ism, pasport va tug'ilgan sana
                      tahrirlash uchun adminga murojaat qiling.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EDITABLE_FIELDS.map(({ key, label, type }) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key}>{label}</Label>
                            <Input
                              id={key}
                              type={type ?? 'text'}
                              value={form[key] ?? ''}
                              onChange={(e) => setField(key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={mutation.isPending}>
                          <Save className="w-4 h-4 mr-2" />
                          {mutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>O'qish tarixi</CardTitle>
                    <CardDescription>
                      Talabaning guruh / mutaxassislik / o'quv yili tarixi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!historyData && <Skeleton className="h-32" />}
                    {historyData && historyData.history.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Tarix yo'q</p>
                    )}
                    {historyData && historyData.history.length > 0 && (
                      <div className="space-y-3">
                        {historyData.history.map((row) => (
                          <div
                            key={row.id}
                            className="flex items-start justify-between p-4 rounded-lg border"
                          >
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {row.group?.name ?? 'Guruh nomalum'}
                                {row.education_year && (
                                  <Badge variant="outline" className="text-xs">
                                    {row.education_year}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-0.5">
                                {row.specialty && <div>Mutaxassislik: {row.specialty.name}</div>}
                                {row.department && <div>Kafedra: {row.department.name}</div>}
                                {row.education_form && (
                                  <div>Shakl: {row.education_form.name}</div>
                                )}
                              </div>
                            </div>
                            <Badge variant={row.active ? 'default' : 'secondary'}>
                              {row.active ? 'Faol' : 'Tarix'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
