import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  GraduationCap,
  Users,
  BookOpen,
  User,
  Phone,
  MapPin,
  Plus,
  Search,
  X,
  Save,
  Trash2,
  Building2,
} from 'lucide-react'
import { structureApi } from '@/lib/api/structure'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Department } from '@/lib/types/structure'
import { useTranslation } from '@/hooks/useTranslation'

export default function DepartmentsPageNew() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<string>('')
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    short_name: '',
    faculty_id: '',
    head_name: '',
    head_phone: '',
    head_email: '',
    location: '',
  })

  const queryClient = useQueryClient()

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments', search, facultyFilter],
    queryFn: () =>
      structureApi.getDepartments({
        search,
        faculty_id: facultyFilter || undefined,
      }),
  })

  const { data: faculties } = useQuery({
    queryKey: ['faculties'],
    queryFn: () => structureApi.getFaculties({ status: 'active' }),
  })

  // Handle department selection
  const handleSelectDept = (dept: Department) => {
    setSelectedDept(dept)
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      short_name: dept.short_name || '',
      faculty_id: dept.faculty_id || '',
      head_name: dept.head_name || '',
      head_phone: dept.head_phone || '',
      head_email: dept.head_email || '',
      location: dept.location || '',
    })
  }

  // Handle new department
  const handleNewDept = () => {
    setSelectedDept(null)
    setFormData({
      name: '',
      code: '',
      short_name: '',
      faculty_id: '',
      head_name: '',
      head_phone: '',
      head_email: '',
      location: '',
    })
  }

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (selectedDept) {
        return structureApi.updateDepartment(selectedDept.id, data)
      } else {
        return structureApi.createDepartment(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success(selectedDept ? 'Kafedra yangilandi!' : 'Kafedra qo\'shildi!')
      handleNewDept()
    },
    onError: () => {
      toast.error('Xatolik yuz berdi!')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => structureApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Kafedra o\'chirildi!')
      handleNewDept()
    },
    onError: () => {
      toast.error('O\'chirishda xatolik!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const handleDelete = () => {
    if (selectedDept && confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      deleteMutation.mutate(selectedDept.id)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Kafedralar</h1>
            <p className="text-sm text-blue-100">Akademik kafedralar boshqaruvi</p>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List (2 columns) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Compact Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            <Select value={facultyFilter || 'all'} onValueChange={(val) => setFacultyFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="h-9">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Barcha fakultetlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha fakultetlar</SelectItem>
                {faculties?.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compact Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Kod</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Nomi</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Fakultet</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Mudiri</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">O'qituvchi</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Fanlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <tr
                        key={dept.id}
                        onClick={() => handleSelectDept(dept)}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedDept?.id === dept.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-3 py-2">
                          <code className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                            {dept.code}
                          </code>
                        </td>
                        <td className="px-3 py-2">
                          <div>
                            <p className="font-medium text-gray-900">{t(dept, 'name')}</p>
                            {dept.short_name && (
                              <p className="text-xs text-gray-500">({dept.short_name})</p>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {dept.faculty_name && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">
                              <Building2 className="w-3 h-3" />
                              {t(dept, 'faculty_name')}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {dept.head_name && (
                            <div>
                              <p className="text-sm text-gray-900">{dept.head_name}</p>
                              {dept.head_phone && (
                                <p className="text-xs text-gray-500">{dept.head_phone}</p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-6 bg-green-50 text-green-700 rounded font-medium text-xs">
                            {dept.teachers_count}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-6 bg-blue-50 text-blue-700 rounded font-medium text-xs">
                            {dept.subjects_count}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-gray-600">
                        Kafedralar topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Form Sidebar (1 column) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">
                    {selectedDept ? 'Tahrirlash' : 'Yangi kafedra'}
                  </h2>
                  {selectedDept && (
                    <Button type="button" size="sm" variant="ghost" onClick={handleNewDept} className="h-7 w-7 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Fakultet <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.faculty_id || 'placeholder'}
                    onValueChange={(value) => {
                      if (value !== 'placeholder') {
                        setFormData({ ...formData, faculty_id: value })
                      }
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Fakultetni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder" disabled>
                        Tanlang
                      </SelectItem>
                      {faculties?.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Nomi <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Kafedra nomi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Kod <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="DEP-SE"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      disabled={!!selectedDept}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Qisqa
                    </label>
                    <Input
                      placeholder="SE"
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Mudiri
                  </label>
                  <Input
                    placeholder="Prof. Abdullayev K."
                    value={formData.head_name}
                    onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      placeholder="+998 71..."
                      value={formData.head_phone}
                      onChange={(e) => setFormData({ ...formData, head_phone: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Xona
                    </label>
                    <Input
                      placeholder="301"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="k.a@tuit.uz"
                    value={formData.head_email}
                    onChange={(e) => setFormData({ ...formData, head_email: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 border-t border-gray-200 flex items-center justify-end gap-2">
                {selectedDept && (
                  <>
                    <Button type="button" variant="outline" onClick={handleNewDept} size="sm" className="h-8">
                      <X className="w-3 h-3 mr-1" />
                      Bekor
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      size="sm"
                      className="h-8"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      O'chirish
                    </Button>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 h-8"
                  size="sm"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {saveMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

