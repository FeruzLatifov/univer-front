import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  BarChart3,
  Play,
  Pause,
} from 'lucide-react'
import { getTeacherTests, deleteTest, publishTest, unpublishTest, exportTest, downloadImportTemplate } from '@/lib/api/tests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export default function TeacherTestsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher-tests', page, search, statusFilter],
    queryFn: () => getTeacherTests({
      page,
      per_page: 12,
      search,
      status: statusFilter || undefined,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-tests'] })
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Test o\'chirildi',
      })
      setDeleteDialogOpen(false)
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Test o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      })
    },
  })

  const publishMutation = useMutation({
    mutationFn: ({ id, publish }: { id: number; publish: boolean }) =>
      publish ? publishTest(id) : unpublishTest(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-tests'] })
      toast({
        title: 'Muvaffaqiyatli',
        description: variables.publish ? 'Test nashr etildi' : 'Test qoralama holatiga o\'tkazildi',
      })
    },
  })

  const handleExport = async (id: number) => {
    try {
      await exportTest(id)
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Test eksport qilindi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Eksport qilishda xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await downloadImportTemplate()
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Shablon yuklandi',
      })
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Shablon yuklashda xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  const tests = data?.data || []
  const meta = data?.meta

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 10:
        return <Badge variant="secondary">Qoralama</Badge>
      case 20:
        return <Badge variant="default">Nashr etilgan</Badge>
      default:
        return <Badge variant="outline">Noma'lum</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testlar</h1>
          <p className="text-muted-foreground mt-1">
            Testlar yaratish, tahrirlash va natijalarni ko'rish
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Shablon yuklash
          </Button>
          <Button onClick={() => navigate('/teacher/tests/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Yangi test
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Testlarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Hammasi</SelectItem>
                <SelectItem value="draft">Qoralama</SelectItem>
                <SelectItem value="active">Nashr etilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Grid */}
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
      ) : tests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <FileQuestion className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Testlar topilmadi</h3>
                <p className="text-muted-foreground mt-1">
                  Hozircha sizning testlaringiz yo'q
                </p>
              </div>
              <Button onClick={() => navigate('/teacher/tests/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Birinchi testni yarating
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test: any) => (
            <Card
              key={test.id}
              className="hover:shadow-lg transition-all group relative"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {test.name}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2 flex-wrap">
                      {getStatusBadge(test.status)}
                      <Badge variant="outline">
                        {test.questions_count} savol
                      </Badge>
                      <Badge variant="outline">
                        {test.duration} daqiqa
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Description */}
                  {test.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {test.attempts_count || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Urinish</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {test.avg_score?.toFixed(0) || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">O'rtacha</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {test.passing_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">O'tish</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/teacher/tests/${test.id}`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ko'rish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/teacher/tests/${test.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/teacher/tests/${test.id}/statistics`)}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport(test.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTestId(test.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Publish/Unpublish */}
                  <Button
                    size="sm"
                    variant={test.status === 20 ? 'secondary' : 'default'}
                    className="w-full"
                    onClick={() =>
                      publishMutation.mutate({
                        id: test.id,
                        publish: test.status !== 20,
                      })
                    }
                    disabled={publishMutation.isPending}
                  >
                    {test.status === 20 ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Qoralama qilish
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Nashr etish
                      </>
                    )}
                  </Button>
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
            {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map((p) => (
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

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Testni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu testni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedTestId && deleteMutation.mutate(selectedTestId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
