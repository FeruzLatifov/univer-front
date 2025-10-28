import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2,
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
} from 'lucide-react'
import { structureApi } from '@/lib/api/structure'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Faculty } from '@/lib/types/structure'
import { useTranslation } from '@/hooks/useTranslation'

export default function FacultiesPageNew() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    short_name: '',
    dean_name: '',
    dean_phone: '',
    dean_email: '',
    location: '',
  })

  const queryClient = useQueryClient()

  const { data: faculties, isLoading } = useQuery({
    queryKey: ['faculties', search],
    queryFn: () => structureApi.getFaculties({ search }),
  })

  // Handle faculty selection
  const handleSelectFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty)
    setFormData({
      name: faculty.name || '',
      code: faculty.code || '',
      short_name: faculty.short_name || '',
      dean_name: faculty.dean_name || '',
      dean_phone: faculty.dean_phone || '',
      dean_email: faculty.dean_email || '',
      location: faculty.location || '',
    })
  }

  // Handle new faculty
  const handleNewFaculty = () => {
    setSelectedFaculty(null)
    setFormData({
      name: '',
      code: '',
      short_name: '',
      dean_name: '',
      dean_phone: '',
      dean_email: '',
      location: '',
    })
  }

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (selectedFaculty) {
        return structureApi.updateFaculty(selectedFaculty.id, data)
      } else {
        return structureApi.createFaculty(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] })
      toast.success(selectedFaculty ? 'Fakultet yangilandi!' : 'Fakultet qo\'shildi!')
      handleNewFaculty()
    },
    onError: () => {
      toast.error('Xatolik yuz berdi!')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => structureApi.deleteFaculty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] })
      toast.success('Fakultet o\'chirildi!')
      handleNewFaculty()
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
    if (selectedFaculty && confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      deleteMutation.mutate(selectedFaculty.id)
    }
  }

  return (
    <div className="p-3 space-y-3">
      {/* Ultra-Dense Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-2.5 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold">Fakultetlar</h1>
            <p className="text-[11px] text-purple-100">OTM fakultetlari boshqaruvi</p>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: List (2 columns) */}
        <div className="lg:col-span-2 space-y-2">
          {/* Ultra-Dense Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <Input
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          {/* Ultra-Dense Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-dense">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-gray-600">Kod</th>
                    <th className="text-left text-gray-600">Nomi</th>
                    <th className="text-left text-gray-600">Dekan</th>
                    <th className="text-center text-gray-600">Talaba</th>
                    <th className="text-center text-gray-600">O'qituvchi</th>
                    <th className="text-center text-gray-600">Kafedra</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : faculties && faculties.length > 0 ? (
                    faculties.map((faculty) => (
                      <tr
                        key={faculty.id}
                        onClick={() => handleSelectFaculty(faculty)}
                        className={`cursor-pointer ${selectedFaculty?.id === faculty.id ? 'bg-purple-50' : ''}`}
                      >
                        <td>
                          <code className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px] font-mono">
                            {faculty.code}
                          </code>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium text-gray-900">{t(faculty, 'name')}</p>
                            {faculty.short_name && (
                              <p className="text-[11px] text-gray-500">({faculty.short_name})</p>
                            )}
                          </div>
                        </td>
                        <td>
                          {faculty.dean_name && (
                            <div>
                              <p className="text-gray-900">{faculty.dean_name}</p>
                              {faculty.dean_phone && (
                                <p className="text-[11px] text-gray-500">{faculty.dean_phone}</p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-5 bg-blue-50 text-blue-700 rounded font-medium text-[11px] px-1.5">
                            {faculty.students_count}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-5 bg-green-50 text-green-700 rounded font-medium text-[11px] px-1.5">
                            {faculty.teachers_count}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-5 bg-purple-50 text-purple-700 rounded font-medium text-[11px] px-1.5">
                            {faculty.departments_count}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-600">
                        Fakultetlar topilmadi
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
          <Card className="sticky top-3">
            <form onSubmit={handleSubmit}>
              <div className="p-2.5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    {selectedFaculty ? 'Tahrirlash' : 'Yangi fakultet'}
                  </h2>
                  {selectedFaculty && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleNewFaculty}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                    Nomi <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Fakultet nomi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                      Kod <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="FAC-IT"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      disabled={!!selectedFaculty}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                      Qisqa
                    </label>
                    <Input
                      placeholder="IT"
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                    Dekan F.I.O
                  </label>
                  <Input
                    placeholder="Prof. Alimov Jasur"
                    value={formData.dean_name}
                    onChange={(e) => setFormData({ ...formData, dean_name: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      placeholder="+998 71..."
                      value={formData.dean_phone}
                      onChange={(e) => setFormData({ ...formData, dean_phone: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                      Xona
                    </label>
                    <Input
                      placeholder="301"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-700 mb-0.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="dean@tuit.uz"
                    value={formData.dean_email}
                    onChange={(e) => setFormData({ ...formData, dean_email: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="p-2.5 border-t border-gray-200 flex items-center justify-end gap-1.5">
                {selectedFaculty && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNewFaculty}
                      className="h-7 text-[11px] px-2"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Bekor
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="h-7 text-[11px] px-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      O'chirish
                    </Button>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 h-7 text-[11px] px-2"
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

