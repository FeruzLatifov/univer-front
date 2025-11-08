import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Upload, Download, Trash2, Link as LinkIcon, File, Video } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { teacherSubjectService, teacherResourceService } from '@/services'
import type { CreateResourcePayload, Resource } from '@/services/teacher/ResourceService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function ResourcesPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    file: null as File | null,
  })

  const { data: subjectsData } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: () => teacherSubjectService.getSubjects({ per_page: 100 }),
  })

  const { data: resourcesData, isLoading } = useQuery<Resource[]>({
    queryKey: ['teacher', 'resources', selectedSubject],
    queryFn: () => teacherResourceService.getSubjectResources(selectedSubject!),
    enabled: !!selectedSubject,
  })

  const uploadMutation = useMutation({
    mutationFn: (data: CreateResourcePayload) => teacherResourceService.uploadResource(data),
    onSuccess: () => {
      toast({ title: 'Material yuklandi', description: 'Material muvaffaqiyatli yuklandi' })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'resources'] })
      setIsUploadOpen(false)
      setFormData({ title: '', description: '', url: '', file: null })
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Material yuklanmadi', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => teacherResourceService.deleteResource(id),
    onSuccess: () => {
      toast({ title: 'O\'chirildi', description: 'Material o\'chirildi' })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'resources'] })
    },
  })

  const subjects = subjectsData?.data || []
  const resources = resourcesData || []

  const handleUpload = () => {
    if (!selectedSubject) return

    uploadMutation.mutate({
      subject_id: selectedSubject,
      title: formData.title,
      description: formData.description,
      resource_type: uploadType,
      file: formData.file || undefined,
      url: formData.url || undefined,
    })
  }

  const handleDownload = async (resourceId: number) => {
    try {
      await teacherResourceService.downloadResource(resourceId)
    } catch {
      toast({ title: 'Xatolik', description: 'Fayl yuklab olinmadi', variant: 'destructive' })
    }
  }

  const getResourceIcon = (type: string) => {
    if (type === 'url' || type === 'link') return <LinkIcon className="w-5 h-5" />
    if (type === 'video') return <Video className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">O'quv materiallari</h1>
          <p className="text-muted-foreground mt-1">Fayllar va manbalarni boshqaring</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Fan</label>
              <Select
                value={selectedSubject?.toString()}
                onValueChange={(value) => setSelectedSubject(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fanni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {t(subject, 'name')} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setIsUploadOpen(true)}
                disabled={!selectedSubject}
              >
                <Upload className="w-4 h-4 mr-2" />
                Material yuklash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSubject ? (
        <Card>
          <CardContent className="py-12 text-center">
            <File className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Fanni tanlang</h3>
            <p className="text-muted-foreground mt-1">Materiallarni ko'rish uchun fanni tanlang</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Materiallar yo'q</h3>
            <p className="text-muted-foreground mt-1">Bu fan uchun hali materiallar yuklanmagan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {getResourceIcon(resource.resource_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{resource.title}</CardTitle>
                      {resource.description && (
                        <CardDescription className="text-sm mt-1 line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{resource.resource_type}</Badge>
                    {resource.file_size && (
                      <span className="text-muted-foreground">
                        {formatFileSize(resource.file_size)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {resource.file_path && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownload(resource.id)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Yuklash
                      </Button>
                    )}
                    {resource.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Ochish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(resource.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Material yuklash</DialogTitle>
            <DialogDescription>Yangi material yoki havola qo'shing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={uploadType === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadType('file')}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Fayl
              </Button>
              <Button
                variant={uploadType === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadType('url')}
                className="flex-1"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Havola
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Nomi</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Material nomi..."
              />
            </div>

            {uploadType === 'file' ? (
              <div className="space-y-2">
                <Label>Fayl</Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files?.[0] || null })
                  }
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Tavsif (ixtiyoriy)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Material haqida..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                !formData.title ||
                (uploadType === 'file' ? !formData.file : !formData.url) ||
                uploadMutation.isPending
              }
            >
              Yuklash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
