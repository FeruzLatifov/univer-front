import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, BarChart3, List, Trash2, Eye, EyeOff } from 'lucide-react'
import { useTest, useDeleteTest, usePublishTest, useUnpublishTest } from '@/hooks/useTests'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function TestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const testId = Number(id)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: testData, isLoading } = useTest(testId)
  const deleteMutation = useDeleteTest()
  const publishMutation = usePublishTest()
  const unpublishMutation = useUnpublishTest()

  const test = testData?.data

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 10:
        return <Badge variant="secondary">Qoralama</Badge>
      case 20:
        return <Badge variant="default">Nashr qilingan</Badge>
      case 30:
        return <Badge variant="outline">Arxivlangan</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Test topilmadi</h3>
              <Button onClick={() => navigate('/teacher/tests')} className="mt-4">
                Testlarga qaytish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/tests')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Testlarga qaytish
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{test.name}</h1>
              {getStatusBadge(test.status)}
            </div>
            <p className="text-muted-foreground">
              {test.description || 'Tavsif yo\'q'}
            </p>
          </div>
          <div className="flex gap-2">
            {test.status === 10 ? (
              <Button
                variant="default"
                onClick={() => publishMutation.mutate(testId)}
                disabled={publishMutation.isPending}
              >
                <Eye className="w-4 h-4 mr-2" />
                Nashr qilish
              </Button>
            ) : test.status === 20 ? (
              <Button
                variant="outline"
                onClick={() => unpublishMutation.mutate(testId)}
                disabled={unpublishMutation.isPending}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Nashrdan olish
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => navigate(`/teacher/tests/${testId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Tahrirlash
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              O'chirish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.subject?.name || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Davomiylik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.duration} daqiqa</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              O'tish balli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.passing_score}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test sozlamalari</CardTitle>
            <CardDescription>Asosiy parametrlar va sozlamalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Maksimal urinishlar</span>
                <Badge variant="outline">{test.max_attempts}</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Savollarni aralashtiris</span>
                <Badge variant={test.shuffle_questions ? 'default' : 'secondary'}>
                  {test.shuffle_questions ? 'Ha' : 'Yo\'q'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Javoblarni aralashtiris</span>
                <Badge variant={test.shuffle_answers ? 'default' : 'secondary'}>
                  {test.shuffle_answers ? 'Ha' : 'Yo\'q'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Natijalarni ko'rsatish</span>
                <Badge variant={test.show_results ? 'default' : 'secondary'}>
                  {test.show_results ? 'Ha' : 'Yo\'q'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qo'shimcha ma'lumotlar</CardTitle>
            <CardDescription>Yaratilgan va o'zgartirilgan vaqtlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Yaratilgan</span>
                <span className="text-sm font-medium">
                  {new Date(test.created_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Oxirgi o'zgarish</span>
                <span className="text-sm font-medium">
                  {new Date(test.updated_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">O'qituvchi</span>
                <span className="text-sm font-medium">
                  {test.teacher?.full_name || 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Tezkor harakatlar</CardTitle>
          <CardDescription>Test bilan bog'liq amallar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate(`/teacher/tests/${testId}/questions`)}
            >
              <List className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Savollarni boshqarish</div>
                <div className="text-xs text-muted-foreground">
                  Savollarni ko'rish va tahrirlash
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate(`/teacher/tests/${testId}/statistics`)}
            >
              <BarChart3 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Statistika</div>
                <div className="text-xs text-muted-foreground">
                  Natijalar va tahlillar
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate(`/teacher/tests/${testId}/results`)}
            >
              <BarChart3 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Batafsil natijalar</div>
                <div className="text-xs text-muted-foreground">
                  Barcha talabalar natijalari
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Testni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu testni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.
              Barcha savollar va natijalar ham o'chiriladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(testId, {
                onSuccess: () => {
                  navigate('/teacher/tests')
                },
              })}
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
