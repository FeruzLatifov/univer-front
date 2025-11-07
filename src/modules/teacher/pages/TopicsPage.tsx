import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Edit, Trash2, GripVertical, Clock, Calendar } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { teacherSubjectService, teacherTopicService } from '@/services'
import type { CreateTopicPayload, Topic } from '@/lib/api/topics'
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
import { cn } from '@/lib/utils'

export default function TopicsPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<CreateTopicPayload>>({})

  const { data: subjectsData } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: () => teacherSubjectService.getSubjects({ per_page: 100 }),
  })

  const { data: topicsData, isLoading } = useQuery<Topic[]>({
    queryKey: ['teacher', 'topics', selectedSubject],
    queryFn: () => teacherTopicService.getSubjectTopics(selectedSubject!),
    enabled: !!selectedSubject,
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateTopicPayload) => teacherTopicService.createTopic(selectedSubject!, payload),
    onSuccess: () => {
      toast({ title: 'Mavzu qo\'shildi' })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'topics'] })
      closeDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: number; payload: Partial<CreateTopicPayload> }) =>
      teacherTopicService.updateTopic(selectedSubject!, topicId, payload),
    onSuccess: () => {
      toast({ title: 'Mavzu yangilandi' })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'topics'] })
      closeDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (topicId: number) => teacherTopicService.deleteTopic(selectedSubject!, topicId),
    onSuccess: () => {
      toast({ title: 'Mavzu o\'chirildi' })
      queryClient.invalidateQueries({ queryKey: ['teacher', 'topics'] })
    },
  })

  const subjects = subjectsData?.data || []
  const topics = topicsData ?? []

  const totalHours = topics.reduce((sum, t) => sum + t.hours, 0)

  const openDialog = (topicId?: number) => {
    if (topicId) {
      const topic = topics.find((t) => t.id === topicId)
      if (topic) {
        setEditingTopic(topicId)
        setFormData({
          name: topic.name,
          description: topic.description,
          hours: topic.hours,
          week: topic.week,
        })
      }
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTopic(null)
    setFormData({})
  }

  const handleSubmit = () => {
    if (!selectedSubject || !formData.name) return

    if (editingTopic) {
      updateMutation.mutate({ topicId: editingTopic, payload: formData })
    } else {
      createMutation.mutate({
        subject_id: selectedSubject,
        name: formData.name,
        description: formData.description,
        hours: formData.hours || 0,
        week: formData.week || 1,
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mavzular va Syllabus</h1>
        <p className="text-muted-foreground mt-1">O'quv dasturi mavzularini boshqaring</p>
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
              <Button onClick={() => openDialog()} disabled={!selectedSubject}>
                <Plus className="w-4 h-4 mr-2" />
                Mavzu qo'shish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSubject ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Fanni tanlang</h3>
            <p className="text-muted-foreground mt-1">Mavzularni ko'rish uchun fanni tanlang</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jami mavzular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{topics.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jami soatlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="text-3xl font-bold">{totalHours}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Haftalik o'rtacha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {topics.length > 0 ? (totalHours / topics.length).toFixed(1) : 0} soat
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mavzular ro'yxati</CardTitle>
              <CardDescription>{topics.length} ta mavzu</CardDescription>
            </CardHeader>
            <CardContent>
              {topics.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Mavzular yo'q</p>
              ) : (
                <div className="space-y-2">
                  {topics
                    .sort((a, b) => a.position - b.position)
                    .map((topic) => (
                      <div
                        key={topic.id}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-lg border',
                          'hover:bg-accent transition-colors',
                          !topic.active && 'opacity-50'
                        )}
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <Badge variant="outline" className="font-mono">
                          #{topic.position}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold">{t(topic, 'name')}</div>
                          {topic.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {topic.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            {topic.week}-hafta
                          </Badge>
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {topic.hours} soat
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => openDialog(topic.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(topic.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTopic ? 'Mavzuni tahrirlash' : 'Yangi mavzu'}</DialogTitle>
            <DialogDescription>Mavzu ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mavzu nomi</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mavzu nomi..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Soatlar</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.hours || ''}
                  onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hafta</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.week || ''}
                  onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tavsif (ixtiyoriy)</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mavzu haqida..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Bekor qilish
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name}>
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
