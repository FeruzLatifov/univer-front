import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Search, Filter, CheckCircle, XCircle } from 'lucide-react'
import { useTest, useTestResults } from '@/hooks/useTests'
import { teacherTestService } from '@/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export default function TestResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const testId = Number(id)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const perPage = 20

  const { data: testData } = useTest(testId)

  const { data: resultsData, isLoading } = useTestResults(testId, {
    page,
    student_id: undefined,
    status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
    passed: undefined,
  })

  const handleExport = async () => {
    try {
      await teacherTestService.exportTestResults(testId)
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Natijalar eksport qilindi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Eksport qilishda xatolik',
        variant: 'destructive',
      })
    }
  }

  const test = testData?.data
  const results = resultsData?.data?.data || []
  const pagination = resultsData?.data?.meta

  const getStatusBadge = (result: any) => {
    if (result.status === 'completed') {
      const passed = result.correct_answers >= (test?.passing_score || 70)
      return (
        <Badge variant={passed ? 'default' : 'destructive'}>
          {passed ? "O'tdi" : "O'tmadi"}
        </Badge>
      )
    }
    return <Badge variant="secondary">Jarayonda</Badge>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/teacher/tests/${testId}/statistics`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Statistikaga qaytish
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{test?.name}</h1>
            <p className="text-muted-foreground mt-1">
              Barcha talabalar natijalari
            </p>
          </div>
          <Button onClick={handleExport} disabled={results.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Eksport
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filterlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Talaba ismi yoki email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha natijalar</SelectItem>
                <SelectItem value="completed">Tugallangan</SelectItem>
                <SelectItem value="in_progress">Jarayonda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Natijalar topilmadi</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Filterlarni o\'zgartiring'
                    : 'Hali hech kim test topshirmagan'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Talaba</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ball</TableHead>
                  <TableHead>Vaqt</TableHead>
                  <TableHead>Urinish</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result: any, index: number) => (
                  <TableRow key={result.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {(page - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                          {result.student?.first_name?.charAt(0)}
                        </div>
                        <span className="font-medium">{result.student?.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.student?.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {result.correct_answers?.toFixed(1)}%
                        </span>
                        {result.status === 'completed' && (
                          result.correct_answers >= (test?.passing_score || 70) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.duration
                        ? `${Math.floor(result.duration / 60)} daq ${result.duration % 60} sek`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.attempt_number} / {test?.max_attempts}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(result.created_at).toLocaleDateString('uz-UZ', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(result)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/teacher/tests/${testId}/results/${result.id}`)
                        }
                      >
                        Ko'rish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pagination.from}-{pagination.to} / {pagination.total} ta natija
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Oldingi
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.last_page}
              onClick={() => setPage(page + 1)}
            >
              Keyingi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
