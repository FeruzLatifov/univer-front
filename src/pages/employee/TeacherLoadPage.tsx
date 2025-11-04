import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardList,
  Download,
  Eye,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react'
import { api } from '@/lib/api/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TeacherLoad {
  id: number
  _employee: number
  _education_year: number
  total_load: number
  created_at: string
  updated_at: string
  education_year_name: string
  education_year_code: string
}

interface TeacherLoadDetail {
  teacher_load: TeacherLoad & { [key: string]: any }
  autumn_subjects: SubjectMeta[]
  spring_subjects: SubjectMeta[]
  scientific_work: ScientificWork[]
  methodical_work: MethodicalWork[]
}

interface SubjectMeta {
  id: number
  _subject: number
  _training_type: number
  subject_name: string
  training_type_name: string
  lecture_hours?: number
  practice_hours?: number
  lab_hours?: number
  [key: string]: any
}

interface ScientificWork {
  id: number
  name: string
  hours: number
  [key: string]: any
}

interface MethodicalWork {
  id: number
  name: string
  hours: number
  [key: string]: any
}

export default function TeacherLoadPage() {
  const [selectedLoadId, setSelectedLoadId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Fetch teacher loads list
  const { data: loadsResponse, isLoading } = useQuery({
    queryKey: ['teacher-loads'],
    queryFn: async () => {
      const response = await api.get('/employee/teacher-load')
      return response.data
    },
  })

  // Fetch selected load details
  const { data: detailResponse, isLoading: isDetailLoading } = useQuery({
    queryKey: ['teacher-load-detail', selectedLoadId],
    queryFn: async () => {
      if (!selectedLoadId) return null
      const response = await api.get(`/employee/teacher-load/${selectedLoadId}`)
      return response.data
    },
    enabled: !!selectedLoadId && isDetailOpen,
  })

  const teacherLoads: TeacherLoad[] = loadsResponse?.data?.teacher_loads || []
  const loadDetail: TeacherLoadDetail | null = detailResponse?.data || null

  const handleViewDetails = (loadId: number) => {
    setSelectedLoadId(loadId)
    setIsDetailOpen(true)
  }

  const handleDownloadPDF = async (loadId: number) => {
    try {
      const response = await api.get(`/employee/teacher-load/${loadId}/download`, {
        responseType: 'blob',
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `teacher-load-${loadId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error: any) {
      console.error('Failed to download PDF:', error)
      alert(error.response?.data?.message || 'PDF yuklab olishda xatolik')
    }
  }

  const calculateTotalHours = (subjects: SubjectMeta[]) => {
    return subjects.reduce((total, subject) => {
      const lecture = subject.lecture_hours || 0
      const practice = subject.practice_hours || 0
      const lab = subject.lab_hours || 0
      return total + lecture + practice + lab
    }, 0)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Shaxsiy ish reja</h1>
              <p className="text-blue-100">O'qituvchi yuklama va ish rejasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Loads List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">O'quv yillari bo'yicha yuklama</h2>
            {teacherLoads.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Yuklama topilmadi</h3>
                <p className="text-gray-600">Sizga hali yuklama biriktirilmagan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        O'quv yili
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Jami yuklama
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Yaratilgan
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherLoads.map((load) => (
                    <TableRow key={load.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{load.education_year_name}</p>
                          <p className="text-sm text-gray-600">Kod: {load.education_year_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {load.total_load} soat
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {new Date(load.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDetails(load.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadPDF(load.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Yuklama tafsilotlari
            </DialogTitle>
            <DialogDescription>
              {loadDetail?.teacher_load?.education_year_name || 'O\'quv yili'}
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : loadDetail ? (
            <Tabs defaultValue="autumn" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="autumn">
                  Kuz semestri ({loadDetail.autumn_subjects.length})
                </TabsTrigger>
                <TabsTrigger value="spring">
                  Bahor semestri ({loadDetail.spring_subjects.length})
                </TabsTrigger>
                <TabsTrigger value="scientific">
                  Ilmiy ish ({loadDetail.scientific_work.length})
                </TabsTrigger>
                <TabsTrigger value="methodical">
                  Uslubiy ish ({loadDetail.methodical_work.length})
                </TabsTrigger>
              </TabsList>

              {/* Autumn Semester */}
              <TabsContent value="autumn" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Jami: {calculateTotalHours(loadDetail.autumn_subjects)} soat
                      </span>
                    </div>
                  </div>
                </div>

                {loadDetail.autumn_subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Kuz semestri uchun fanlar topilmadi</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fan nomi</TableHead>
                        <TableHead>Ta'lim turi</TableHead>
                        <TableHead className="text-center">Ma'ruza</TableHead>
                        <TableHead className="text-center">Amaliy</TableHead>
                        <TableHead className="text-center">Laboratoriya</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadDetail.autumn_subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.subject_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{subject.training_type_name}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.lecture_hours || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.practice_hours || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.lab_hours || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Spring Semester */}
              <TabsContent value="spring" className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Jami: {calculateTotalHours(loadDetail.spring_subjects)} soat
                      </span>
                    </div>
                  </div>
                </div>

                {loadDetail.spring_subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Bahor semestri uchun fanlar topilmadi</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fan nomi</TableHead>
                        <TableHead>Ta'lim turi</TableHead>
                        <TableHead className="text-center">Ma'ruza</TableHead>
                        <TableHead className="text-center">Amaliy</TableHead>
                        <TableHead className="text-center">Laboratoriya</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadDetail.spring_subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.subject_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{subject.training_type_name}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.lecture_hours || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.practice_hours || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            {subject.lab_hours || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Scientific Work */}
              <TabsContent value="scientific" className="space-y-4">
                {loadDetail.scientific_work.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Ilmiy ishlar topilmadi</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ish nomi</TableHead>
                        <TableHead className="text-right">Soatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadDetail.scientific_work.map((work) => (
                        <TableRow key={work.id}>
                          <TableCell className="font-medium">{work.name}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-purple-100 text-purple-700">
                              {work.hours} soat
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Methodical Work */}
              <TabsContent value="methodical" className="space-y-4">
                {loadDetail.methodical_work.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Uslubiy ishlar topilmadi</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ish nomi</TableHead>
                        <TableHead className="text-right">Soatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadDetail.methodical_work.map((work) => (
                        <TableRow key={work.id}>
                          <TableCell className="font-medium">{work.name}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-orange-100 text-orange-700">
                              {work.hours} soat
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}


