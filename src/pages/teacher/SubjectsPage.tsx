import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Users,
  UsersRound,
  Search,
  Filter,
  Award,
  Calendar,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { getTeacherSubjects } from '@/lib/api/subjects'
import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function SubjectsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher-subjects', page, search],
    queryFn: () => getTeacherSubjects({ page, per_page: 12, search }),
  })

  const subjects = data?.data || []
  const meta = data?.meta

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fanlarim</h1>
          <p className="text-muted-foreground mt-1">
            O'qitayotgan fanlar ro'yxati va ularning statistikasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            {meta?.total || 0} ta fan
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Fanlarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrlar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.
            </p>
          </CardContent>
        </Card>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fanlar topilmadi</h3>
                <p className="text-muted-foreground mt-1">
                  Hozircha sizga biriktirilgan fanlar yo'q
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-primary"
              onClick={() => navigate(`/teacher/subjects/${subject.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {t(subject, 'name')}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        {subject.code}
                      </Badge>
                      {subject.credit && (
                        <Badge variant="outline">
                          <Award className="w-3 h-3 mr-1" />
                          {subject.credit} kredit
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Department */}
                  {subject.department_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>{t(subject, 'department_name')}</span>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {subject.students_count || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Talaba
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                        <UsersRound className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {subject.groups_count || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Guruh
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Hours */}
                  {subject.total_acload && (
                    <div className="flex items-center justify-between pt-3 border-t text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Jami soat
                      </span>
                      <span className="font-semibold">{subject.total_acload} soat</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Oldingi
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            disabled={page === meta.last_page}
            onClick={() => setPage(page + 1)}
          >
            Keyingi
          </Button>
        </div>
      )}
    </div>
  )
}
