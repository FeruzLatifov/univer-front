import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileWarning,
  TrendingUp,
  Users,
  Download,
  Filter,
  Save
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { teacherSubjectService, teacherAttendanceService } from '@/services'
import {
  ATTENDANCE_STATUSES,
  type AttendanceStatus,
  type StudentAttendance,
} from '@/lib/api/attendance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function AttendancePage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [attendanceData, setAttendanceData] = useState<
    Record<number, AttendanceStatus>
  >({})
  const [hasChanges, setHasChanges] = useState(false)

  // Get teacher's subjects
  const { data: subjectsData } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: () => teacherSubjectService.getSubjects({ per_page: 100 }),
  })

  // Get attendance for selected subject
  const { data: attendanceList, isLoading } = useQuery({
    queryKey: ['teacher', 'attendance', selectedSubject, selectedDate],
    queryFn: () =>
      teacherAttendanceService.getSubjectAttendance(selectedSubject!, {
        date_from: selectedDate,
        date_to: selectedDate,
      }),
    enabled: !!selectedSubject,
  })

  // Bulk mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: (payload: {
      attendance: { student_id: number; status: AttendanceStatus; reason?: string }[]
    }) =>
      teacherAttendanceService.bulkMarkAttendance(selectedSubject!, {
        lesson_date: selectedDate,
        attendance: payload.attendance,
      }),
    onSuccess: () => {
      toast({
        title: 'Davomat saqlandi',
        description: 'Davomat muvaffaqiyatli belgilandi',
      })
      setHasChanges(false)
      queryClient.invalidateQueries({ queryKey: ['teacher', 'attendance'] })
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Davomat saqlanmadi',
        variant: 'destructive',
      })
    },
  })

  const subjects = subjectsData?.data || []
  const students: StudentAttendance[] = attendanceList?.data || []

  // Calculate statistics
  const stats = {
    total: students.length,
    present: Object.values(attendanceData).filter((s) => s === 'present').length,
    absent: Object.values(attendanceData).filter((s) => s === 'absent').length,
    late: Object.values(attendanceData).filter((s) => s === 'late').length,
    excused: Object.values(attendanceData).filter((s) => s === 'excused').length,
  }

  stats.present += students.filter(
    (s) =>
      !attendanceData[s.student_id] &&
      s.records.some(
        (r) => r.lesson_date === selectedDate && r.status === 'present'
      )
  ).length

  const percentage =
    stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0

  // Handle status change
  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }))
    setHasChanges(true)
  }

  // Quick mark all as present
  const markAllPresent = () => {
    const newData: Record<number, AttendanceStatus> = {}
    students.forEach((s) => {
      newData[s.student_id] = 'present'
    })
    setAttendanceData(newData)
    setHasChanges(true)
  }

  // Save attendance
  const handleSave = () => {
    const attendance = Object.entries(attendanceData).map(([studentId, status]) => ({
      student_id: Number(studentId),
      status,
    }))

    markAttendanceMutation.mutate({ attendance })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Davomat</h1>
          <p className="text-muted-foreground mt-1">
            Talabalar davomatini belgilang va kuzating
          </p>
        </div>
        <Button variant="outline" disabled>
          <Download className="w-4 h-4 mr-2" />
          Hisobot yuklab olish
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium">Sana</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={markAllPresent}
                disabled={!selectedSubject}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Hammasini keldi deb belgilash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSubject ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fanni tanlang</h3>
                <p className="text-muted-foreground mt-1">
                  Davomat belgilash uchun avval fanni tanlang
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jami</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-2 ring-green-500/20">
              <CardHeader className="pb-3">
                <CardDescription>Keldi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {stats.present}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-2 ring-red-500/20">
              <CardHeader className="pb-3">
                <CardDescription>Kelmadi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div className="text-2xl font-bold text-red-600">
                    {stats.absent}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-2 ring-yellow-500/20">
              <CardHeader className="pb-3">
                <CardDescription>Kechikdi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.late}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-2 ring-primary/20">
              <CardHeader className="pb-3">
                <CardDescription>Davomat %</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {percentage}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Talabalar ro'yxati</CardTitle>
                <CardDescription>
                  {students.length} ta talaba
                </CardDescription>
              </div>
              {hasChanges && (
                <Button
                  onClick={handleSave}
                  disabled={markAttendanceMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Saqlash
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Talabalar topilmadi
                </p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => {
                    // Get existing attendance or from state
                    const existingRecord = student.records.find(
                      (r) => r.lesson_date === selectedDate
                    )
                    const currentStatus =
                      attendanceData[student.student_id] ||
                      existingRecord?.status ||
                      null

                    return (
                      <div
                        key={student.student_id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarFallback>
                              {student.student_name.split(' ')[0][0]}
                              {student.student_name.split(' ')[1]?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {student.student_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.student_id_number}
                              {student.group_name && ` • ${student.group_name}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Overall attendance percentage */}
                          <Badge variant="outline" className="gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {student.attendance_percentage.toFixed(0)}%
                          </Badge>

                          {/* Status buttons */}
                          <div className="flex gap-1">
                            {(
                              Object.keys(ATTENDANCE_STATUSES) as AttendanceStatus[]
                            ).map((status) => {
                              const statusInfo = ATTENDANCE_STATUSES[status]
                              const isActive = currentStatus === status
                              return (
                                <Button
                                  key={status}
                                  size="sm"
                                  variant={isActive ? 'default' : 'outline'}
                                  className={cn(
                                    'min-w-[80px]',
                                    isActive && statusInfo.color
                                  )}
                                  onClick={() =>
                                    handleStatusChange(student.student_id, status)
                                  }
                                >
                                  <span className="mr-1">{statusInfo.icon}</span>
                                  {statusInfo.label}
                                </Button>
                              )
                            })}
                          </div>
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
    </div>
  )
}
