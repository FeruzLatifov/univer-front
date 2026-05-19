import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users, UserCheck, User as UserIcon } from 'lucide-react'
import { useTeacherGroupDetail, useTeacherGroupStudents } from '@/hooks/useTeacherGroups'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const groupId = id ? Number(id) : null

  const { data: detail, isLoading: detailLoading } = useTeacherGroupDetail(groupId)
  const { data: studentsData, isLoading: studentsLoading } = useTeacherGroupStudents(groupId)

  const group = detail?.group
  const stats = detail?.statistics
  const students = studentsData?.students ?? []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link to="/teacher/groups">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Guruhlarga qaytish
          </Link>
        </Button>
        {detailLoading ? (
          <Skeleton className="h-9 w-48" />
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">
            {group?.name ?? 'Guruh'}
          </h1>
        )}
        {group?.specialty && (
          <p className="text-muted-foreground mt-1">
            {group.specialty.name}
            {group.department && ` · ${group.department.name}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              {detailLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-bold">{stats?.total_students ?? 0}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Faol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              {detailLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-bold">{stats?.active_students ?? 0}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>O'g'il bolalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              {detailLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-bold">{stats?.male_students ?? 0}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Qiz bolalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950">
                <UserIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              {detailLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-bold">{stats?.female_students ?? 0}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Talabalar ro'yxati</CardTitle>
          <CardDescription>
            {studentsData?.total_count
              ? `Jami: ${studentsData.total_count} talaba`
              : 'Guruh tarkibi'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentsLoading && (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          )}

          {!studentsLoading && students.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Talabalar topilmadi
            </p>
          )}

          {!studentsLoading && students.length > 0 && (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    {student.image && <AvatarImage src={student.image} alt={student.full_name} />}
                    <AvatarFallback>
                      {(student.first_name?.[0] ?? '') + (student.second_name?.[0] ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{student.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {student.student_id_number}
                      {student.phone && ` · ${student.phone}`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {student.student_status && (
                      <Badge
                        variant={student.student_status === 'STUDIED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {student.student_status}
                      </Badge>
                    )}
                    {student.education_form && (
                      <span className="text-xs text-muted-foreground">
                        {student.education_form.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
