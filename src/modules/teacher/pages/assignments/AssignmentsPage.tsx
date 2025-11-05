import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAssignments, useMySubjects, useMyGroups } from '@/hooks/useAssignments'
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
import { AssignmentCard } from './components/AssignmentCard'
import { AssignmentListSkeleton } from './components/AssignmentListSkeleton'
import { EmptyState } from './components/EmptyState'
import type { AssignmentStatusFilter } from '@/lib/api/teacher'

/**
 * Assignments List Page for Teachers
 *
 * Features:
 * - Filter by status (upcoming, active, overdue, past)
 * - Filter by subject and group
 * - Create new assignment
 * - View, edit, delete assignments
 * - Real-time submission stats
 */
export function AssignmentsPage() {
  const navigate = useNavigate()

  // Filters
  const [statusFilter, setStatusFilter] = useState<AssignmentStatusFilter>(null)
  const [subjectFilter, setSubjectFilter] = useState<number | undefined>()
  const [groupFilter, setGroupFilter] = useState<number | undefined>()

  // Fetch dropdown data
  const { data: subjectsData } = useMySubjects()
  const { data: groupsData } = useMyGroups()

  const subjects = subjectsData?.data || []
  const groups = groupsData?.data || []

  // Fetch assignments with filters
  const { data, isLoading, error } = useAssignments({
    subject_id: subjectFilter,
    group_id: groupFilter,
    status: statusFilter,
  })

  const assignments = data?.data || []

  // Handle create new assignment
  const handleCreate = () => {
    navigate('/teacher/assignments/create')
  }

  // Handle view assignment
  const handleView = (id: number) => {
    navigate(`/teacher/assignments/${id}`)
  }

  // Handle edit assignment
  const handleEdit = (id: number) => {
    navigate(`/teacher/assignments/${id}/edit`)
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
          <h1 className="text-3xl font-bold">Topshiriqlar</h1>
          <p className="text-muted-foreground mt-1">
            Talabalar uchun topshiriqlarni boshqaring
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Yangi topshiriq
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
          setStatusFilter(value === 'all' ? null : (value as AssignmentStatusFilter))
        }
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">Barchasi</TabsTrigger>
          <TabsTrigger value="upcoming">Yaqinlashayotgan</TabsTrigger>
          <TabsTrigger value="active">Faol</TabsTrigger>
          <TabsTrigger value="overdue">Muddati o'tgan</TabsTrigger>
          <TabsTrigger value="past">O'tmish</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || 'all'} className="mt-6">
          {/* Loading state */}
          {isLoading && <AssignmentListSkeleton />}

          {/* Empty state */}
          {!isLoading && assignments.length === 0 && (
            <EmptyState
              title="Topshiriqlar topilmadi"
              description="Hozircha birorta topshiriq yo'q. Yangi topshiriq yarating."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Birinchi topshiriq yaratish
                </Button>
              }
            />
          )}

          {/* Assignments list */}
          {!isLoading && assignments.length > 0 && (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onView={handleView}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats footer */}
      {!isLoading && assignments.length > 0 && (
        <Card className="p-6 mt-8">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{assignments.length}</p>
              <p className="text-sm text-muted-foreground">Jami topshiriqlar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {assignments.filter((a) => a.is_published).length}
              </p>
              <p className="text-sm text-muted-foreground">Nashr qilingan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {assignments.filter((a) => a.is_overdue).length}
              </p>
              <p className="text-sm text-muted-foreground">Muddati o'tgan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  assignments.reduce((sum, a) => sum + a.submission_stats.submission_rate, 0) /
                    (assignments.length || 1)
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">O'rtacha submission rate</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
