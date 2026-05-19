import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ChevronRight, Search, GraduationCap } from 'lucide-react'
import { useTeacherGroups } from '@/hooks/useTeacherGroups'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function GroupsPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useTeacherGroups()

  const groups = data?.groups ?? []
  const educationYear = data?.education_year

  const filtered = search
    ? groups.filter((g) =>
        [g.name, g.code, g.department?.name, g.specialty?.name]
          .filter(Boolean)
          .some((s) => s!.toLowerCase().includes(search.toLowerCase()))
      )
    : groups

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guruhlar</h1>
          <p className="text-muted-foreground mt-1">
            {educationYear ? `${educationYear} o'quv yili` : 'Joriy o\'quv yili'}
            {' · '}
            Sizga tegishli guruhlar ro'yxati
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Guruh nomi, kodi, kafedra yoki mutaxassislik bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {error && (
        <Card className="border-error-200 bg-error-50 dark:bg-error-950">
          <CardContent className="pt-6">
            <p className="text-error-700 dark:text-error-300">
              Guruhlarni yuklashda xatolik yuz berdi
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>
              {search
                ? "Qidiruv bo'yicha guruh topilmadi"
                : 'Sizga biriktirilgan guruhlar yo\'q'}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((group) => (
            <Link
              key={group.id}
              to={`/teacher/groups/${group.id}`}
              className="group block"
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors truncate">
                        {group.name}
                      </CardTitle>
                      {group.code && (
                        <CardDescription className="text-xs mt-1">
                          {group.code}
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.specialty && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Mutaxassislik: </span>
                      <span className="font-medium">{group.specialty.name}</span>
                    </div>
                  )}
                  {group.department && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Kafedra: </span>
                      <span className="font-medium">{group.department.name}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      {group.students_count} talaba
                    </Badge>
                    {group.active_students_count !== group.students_count && (
                      <Badge variant="secondary" className="text-xs">
                        {group.active_students_count} faol
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
