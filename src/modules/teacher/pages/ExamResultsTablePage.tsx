import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Check } from 'lucide-react'
import { useExamRoster, useSubmitExamRoster } from '@/hooks/useExamRoster'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const LETTER_GRADES = ['A', 'B', 'C', 'D', 'F'] as const

type RowState = {
  studentId: number
  score: string
  grade: string
  attended: boolean
  notes: string
  dirty: boolean
}

function computeLetterGrade(score: number, max: number): string {
  if (!max) return ''
  const pct = (score / max) * 100
  if (pct >= 86) return 'A'
  if (pct >= 71) return 'B'
  if (pct >= 56) return 'C'
  if (pct >= 41) return 'D'
  return 'F'
}

export default function ExamResultsTablePage() {
  const { id } = useParams<{ id: string }>()
  const examId = id ? Number(id) : null

  const { data, isLoading, error } = useExamRoster(examId)
  const mutation = useSubmitExamRoster()

  const [rows, setRows] = useState<Record<number, RowState>>({})

  const exam = data?.exam
  const roster = useMemo(() => data?.roster ?? [], [data])

  useEffect(() => {
    if (roster.length === 0) return

    const init: Record<number, RowState> = {}
    roster.forEach((r) => {
      init[r.student_id] = {
        studentId: r.student_id,
        score: r.result ? String(r.result.score) : '',
        grade: r.result?.grade ?? '',
        attended: r.result ? r.result.attended : true,
        notes: r.result?.comment ?? '',
        dirty: false,
      }
    })
    setRows(init)
  }, [roster])

  const updateRow = (studentId: number, patch: Partial<RowState>) => {
    setRows((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], ...patch, dirty: true },
    }))
  }

  const handleScoreChange = (studentId: number, value: string) => {
    const score = Number(value)
    const max = exam?.max_score ?? 100
    const autoGrade = value === '' ? '' : computeLetterGrade(score, max)

    updateRow(studentId, {
      score: value,
      grade: autoGrade || rows[studentId]?.grade || '',
    })
  }

  const dirtyCount = Object.values(rows).filter((r) => r.dirty).length

  const handleSave = () => {
    if (!examId) return
    const dirtyRows = Object.values(rows)
      .filter((r) => r.dirty && r.score !== '')
      .map((r) => ({
        student_id: r.studentId,
        score: Number(r.score),
        grade: r.grade || undefined,
        attended: r.attended,
        notes: r.notes || null,
      }))

    if (dirtyRows.length === 0) return

    mutation.mutate({ examId, rows: dirtyRows })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link to="/teacher/exams">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Imtihonlar
          </Link>
        </Button>
        {isLoading ? (
          <Skeleton className="h-9 w-96" />
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">{exam?.title ?? 'Imtihon'}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              {exam?.subject && <Badge variant="outline">{exam.subject.name}</Badge>}
              {exam?.group && <Badge variant="secondary">{exam.group.name}</Badge>}
              {exam?.exam_type && <Badge>{exam.exam_type}</Badge>}
              {exam && (
                <span className="text-muted-foreground">
                  Max ball: {exam.max_score} · O'tish: {exam.passing_score}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <Card className="border-error-200 bg-error-50 dark:bg-error-950">
          <CardContent className="pt-6">
            <p className="text-error-700 dark:text-error-300">
              Imtihon ma'lumotlarini yuklashda xatolik
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <CardTitle>Talabalar natijalari</CardTitle>
                <CardDescription>
                  Jami {data.total_students} ta talaba · Kiritilgan: {data.entered}
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
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Talaba</TableHead>
                  <TableHead className="w-20 text-center">Keldi</TableHead>
                  <TableHead className="w-32">Ball</TableHead>
                  <TableHead className="w-32">Baho</TableHead>
                  <TableHead>Izoh</TableHead>
                  <TableHead className="w-16 text-right">Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((r, i) => {
                  const row = rows[r.student_id]
                  if (!row) return null

                  return (
                    <TableRow key={r.student_id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.student_id_number}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={row.attended}
                          onCheckedChange={(checked) =>
                            updateRow(r.student_id, { attended: checked === true })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={exam?.max_score ?? 100}
                          step="0.5"
                          value={row.score}
                          disabled={!row.attended}
                          onChange={(e) => handleScoreChange(r.student_id, e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {LETTER_GRADES.map((g) => (
                            <button
                              key={g}
                              type="button"
                              disabled={!row.attended}
                              onClick={() => updateRow(r.student_id, { grade: g })}
                              className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                                row.grade === g
                                  ? g === 'F'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                              } disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.notes}
                          disabled={!row.attended}
                          onChange={(e) => updateRow(r.student_id, { notes: e.target.value })}
                          placeholder="Ixtiyoriy"
                          className="text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {row.dirty ? (
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-600">
                            ●
                          </Badge>
                        ) : r.result ? (
                          <Check className="w-4 h-4 text-green-600 ml-auto" />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
