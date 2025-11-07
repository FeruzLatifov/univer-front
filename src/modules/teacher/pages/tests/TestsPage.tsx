import { useState } from 'react'
import { Plus, Filter, FileQuestion } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTests } from '@/hooks/useTests'
import { useMySubjects, useMyGroups } from '@/hooks/useAssignments'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TestCard } from './components/TestCard'
import { TestListSkeleton } from './components/TestListSkeleton'
import { EmptyState } from './components/EmptyState'
import type { TestStatusFilter } from '@/lib/api/teacher'

/**
 * Tests List Page for Teachers
 *
 * Features:
 * - Filter by status (all, published, available, upcoming, expired)
 * - Filter by subject and group
 * - Create new test
 * - View, edit, delete tests
 * - Real-time attempt stats
 * - Publish/unpublish tests
 */
export function TestsPage() {
  const navigate = useNavigate()

  // Filters
  const [statusFilter, setStatusFilter] = useState<TestStatusFilter>(null)
  const [subjectFilter, setSubjectFilter] = useState<number | undefined>()
  const [groupFilter, setGroupFilter] = useState<number | undefined>()

  // Fetch dropdown data
  const { data: subjectsData } = useMySubjects()
  const { data: groupsData } = useMyGroups()

  const subjects = subjectsData?.data || []
  const groups = groupsData?.data || []

  // Fetch tests with filters
  const { data, isLoading, error } = useTests({
    subject_id: subjectFilter,
    group_id: groupFilter,
    status: statusFilter,
  })

  const tests = data?.data?.data || []

  // Handle create new test
  const handleCreate = () => {
    navigate('/teacher/tests/create')
  }

  // Handle view test
  const handleView = (id: number) => {
    navigate(`/teacher/tests/${id}`)
  }

  // Handle edit test
  const handleEdit = (id: number) => {
    navigate(`/teacher/tests/${id}/edit`)
  }

  // Handle view questions
  const handleViewQuestions = (id: number) => {
    navigate(`/teacher/tests/${id}/questions`)
  }

  // Handle view results
  const handleViewResults = (id: number) => {
    navigate(`/teacher/tests/${id}/results`)
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <p className="text-destructive mb-4">
            Xatolik yuz berdi: {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Qayta yuklash
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <FileQuestion className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Testlar</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Talabalar uchun testlar va viktorinalarni boshqaring
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Yangi test
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex gap-4 flex-1">
            {/* Subject filter */}
            <Select
              value={subjectFilter?.toString() || ''}
              onValueChange={(value) => {
                setSubjectFilter(value ? Number(value) : undefined)
                setGroupFilter(undefined) // Reset group when subject changes
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Barcha fanlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Barcha fanlar</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Group filter */}
            <Select
              value={groupFilter?.toString() || ''}
              onValueChange={(value) => setGroupFilter(value ? Number(value) : undefined)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Barcha guruhlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Barcha guruhlar</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters */}
          {(subjectFilter || groupFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubjectFilter(undefined)
                setGroupFilter(undefined)
              }}
            >
              Tozalash
            </Button>
          )}
        </div>
      </Card>

      {/* Status Tabs */}
      <Tabs
        defaultValue="all"
        value={statusFilter || 'all'}
        onValueChange={(value) =>
          setStatusFilter(value === 'all' ? null : (value as TestStatusFilter))
        }
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">Barchasi</TabsTrigger>
          <TabsTrigger value="published">Nashr qilingan</TabsTrigger>
          <TabsTrigger value="available">Mavjud</TabsTrigger>
          <TabsTrigger value="upcoming">Kelayotgan</TabsTrigger>
          <TabsTrigger value="expired">Muddati o'tgan</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || 'all'} className="mt-6">
          {/* Loading state */}
          {isLoading && <TestListSkeleton />}

          {/* Empty state */}
          {!isLoading && tests.length === 0 && (
            <EmptyState
              icon={FileQuestion}
              title="Testlar topilmadi"
              description="Hozircha birorta test yo'q. Yangi test yarating."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Birinchi test yaratish
                </Button>
              }
            />
          )}

          {/* Tests list */}
          {!isLoading && tests.length > 0 && (
            <div className="space-y-4">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onView={handleView}
                  onEdit={handleEdit}
                  onViewQuestions={handleViewQuestions}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats footer */}
      {!isLoading && tests.length > 0 && (
        <Card className="p-6 mt-8">
          <div className="grid grid-cols-5 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{tests.length}</p>
              <p className="text-sm text-muted-foreground">Jami testlar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {tests.filter((t) => t.is_published).length}
              </p>
              <p className="text-sm text-muted-foreground">Nashr qilingan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {tests.filter((t) => t.is_available).length}
              </p>
              <p className="text-sm text-muted-foreground">Mavjud</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {tests.reduce((sum, t) => sum + t.attempt_stats.pending, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Baholanmagan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  tests.reduce((sum, t) => sum + t.attempt_stats.average_score, 0) /
                    (tests.length || 1)
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">O'rtacha ball</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
