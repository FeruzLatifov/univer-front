import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Save, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { teacherSubjectService } from '@/services/teacher/SubjectService'
import { useCalendarPlan, useUpdateCalendarPlan } from '@/hooks/useCalendarPlan'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Row = {
  topic_id: number
  planned_date: string
  actual_date: string
  hours: string
  notes: string
  dirty: boolean
}

export default function CalendarPlanPage() {
  const [subjectId, setSubjectId] = useState<number | null>(null)
  const [rows, setRows] = useState<Record<number, Row>>({})

  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: () => teacherSubjectService.getSubjects({ per_page: 100 }),
  })
  const subjects = subjectsData?.data ?? []

  const { data: plan, isLoading } = useCalendarPlan(subjectId)
  const mutation = useUpdateCalendarPlan()

  const items = useMemo(() => plan?.items ?? [], [plan])

  useEffect(() => {
    const init: Record<number, Row> = {}
    items.forEach((i) => {
      init[i.topic_id] = {
        topic_id: i.topic_id,
        planned_date: i.planned_date ?? '',
        actual_date: i.actual_date ?? '',
        hours: String(i.hours ?? 2),
        notes: i.notes ?? '',
        dirty: false,
      }
    })
    setRows(init)
  }, [items])

  const updateRow = (topicId: number, patch: Partial<Row>) => {
    setRows((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], ...patch, dirty: true },
    }))
  }

  const dirtyCount = Object.values(rows).filter((r) => r.dirty).length

  const handleSave = () => {
    if (!subjectId) return
    const payload = Object.values(rows)
      .filter((r) => r.dirty)
      .map((r) => ({
        topic_id: r.topic_id,
        planned_date: r.planned_date || null,
        actual_date: r.actual_date || null,
        hours: Number(r.hours) || null,
        notes: r.notes || null,
      }))

    if (payload.length === 0) return

    mutation.mutate({ subjectId, input: { items: payload } })
  }

  const progress = plan && plan.total_topics > 0
    ? Math.round((plan.completed_topics / plan.total_topics) * 100)
    : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taqvimiy reja</h1>
        <p className="text-muted-foreground mt-1">
          Fan mavzularini sanalarga bog'lang va o'tilgan darslarni belgilang
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Select
            value={subjectId?.toString() ?? ''}
            onValueChange={(value) => setSubjectId(Number(value))}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Fanni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!subjectId && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Boshlash uchun fanni tanlang</p>
          </CardContent>
        </Card>
      )}

      {subjectId && isLoading && <Skeleton className="h-96" />}

      {subjectId && !isLoading && plan && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Mavzular</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div className="text-2xl font-bold">{plan.total_topics}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rejalashtirilgan</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-600" />
                <div className="text-2xl font-bold">{plan.planned_topics}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>O'tilgan</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="text-2xl font-bold">{plan.completed_topics}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Soatlar</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div className="text-2xl font-bold">{plan.total_hours}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>O'tilganlik</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle>Mavzular ro'yxati</CardTitle>
                  <CardDescription>
                    Sanani kiriting yoki o'tilgan darsni belgilang
                    {dirtyCount > 0 && ` · O'zgartirildi: ${dirtyCount}`}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={dirtyCount === 0 || mutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {mutation.isPending ? 'Saqlanmoqda...' : `Saqlash (${dirtyCount})`}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Mavzu</TableHead>
                    <TableHead className="w-20">Soat</TableHead>
                    <TableHead className="w-40">Rejalashtirilgan</TableHead>
                    <TableHead className="w-40">O'tilgan sana</TableHead>
                    <TableHead>Izoh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, i) => {
                    const row = rows[item.topic_id]
                    if (!row) return null

                    return (
                      <TableRow key={item.topic_id}>
                        <TableCell className="text-muted-foreground">
                          {item.order_number ?? i + 1}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={200}
                            value={row.hours}
                            onChange={(e) =>
                              updateRow(item.topic_id, { hours: e.target.value })
                            }
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={row.planned_date}
                            onChange={(e) =>
                              updateRow(item.topic_id, { planned_date: e.target.value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={row.actual_date}
                            onChange={(e) =>
                              updateRow(item.topic_id, { actual_date: e.target.value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.notes}
                            placeholder="Ixtiyoriy"
                            onChange={(e) =>
                              updateRow(item.topic_id, { notes: e.target.value })
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Bu fan uchun mavzular yo'q. Avval Topics sahifasidan qo'shing.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
