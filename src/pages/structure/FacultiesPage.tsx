import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Building2,
  Users,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Search,
  Filter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { StructureFilters } from '@/lib/types/structure'

export default function FacultiesPage() {
  const [filters, setFilters] = useState<StructureFilters>({
    status: 'all',
    search: '',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: faculties, isLoading } = useQuery({
    queryKey: ['faculties', filters],
    queryFn: () => structureApi.getFaculties(filters),
  })

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as 'active' | 'inactive' | 'all' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Fakultetlar</h1>
              <p className="text-purple-100">OTM fakultetlari va bo'limlari</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Fakultet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi Fakultet Qo'shish</DialogTitle>
                <DialogDescription>
                  Yangi fakultet ma'lumotlarini kiriting
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Fakultet nomi
                  </label>
                  <Input id="name" placeholder="Axborot texnologiyalari fakulteti" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Fakultet kodi
                  </label>
                  <Input id="code" placeholder="FAC-IT" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="dean" className="text-sm font-medium">
                    Dekan
                  </label>
                  <Input id="dean" placeholder="Prof. Alimov Jasur" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Fakultet muvaffaqiyatli qo\'shildi!')
                    setIsDialogOpen(false)
                  }}
                >
                  Saqlash
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Fakultet nomi bo'yicha qidirish..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="active">Faol</SelectItem>
              <SelectItem value="inactive">Faol emas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties?.map((faculty) => (
            <Card
              key={faculty.id}
              className="p-6 hover:shadow-lg transition-all hover:border-purple-300 cursor-pointer"
            >
              {/* Faculty Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-purple-600">{faculty.code}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{faculty.name}</h3>
                  {faculty.short_name && (
                    <p className="text-sm text-gray-600 mt-1">({faculty.short_name})</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    faculty.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {faculty.status === 'active' ? 'Faol' : 'Faol emas'}
                </span>
              </div>

              {/* Dean Info */}
              {faculty.dean_name && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">{faculty.dean_name}</span>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">Dekan</p>
                  {faculty.dean_phone && (
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{faculty.dean_phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{faculty.students_count || 0}</p>
                  <p className="text-xs text-gray-600">Talabalar</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{faculty.teachers_count || 0}</p>
                  <p className="text-xs text-gray-600">O'qituvchilar</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{faculty.departments_count || 0}</p>
                  <p className="text-xs text-gray-600">Kafedralar</p>
                </div>
              </div>

              {/* Location */}
              {faculty.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{faculty.location}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!isLoading && faculties?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fakultetlar topilmadi</h3>
          <p className="text-gray-600">Qidiruv sozlamalarini o'zgartiring yoki yangi fakultet qo'shing</p>
        </div>
      )}
    </div>
  )
}

