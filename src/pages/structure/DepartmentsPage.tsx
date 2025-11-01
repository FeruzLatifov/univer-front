import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  GraduationCap,
  Users,
  BookOpen,
  User,
  Phone,
  MapPin,
  Plus,
  Search,
  Filter,
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
import type { StructureFilters } from '@/lib/types/structure'

export default function DepartmentsPage() {
  const [filters, setFilters] = useState<StructureFilters>({
    status: 'all',
    search: '',
  })

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments', filters],
    queryFn: () => structureApi.getDepartments(filters),
  })

  const { data: faculties } = useQuery({
    queryKey: ['faculties'],
    queryFn: () => structureApi.getFaculties({ status: 'active' }),
  })

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as 'active' | 'inactive' | 'all' })
  }

  const handleFacultyChange = (value: string) => {
    setFilters({ ...filters, faculty_id: value === 'all' ? undefined : value })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kafedralar</h1>
              <p className="text-blue-100">Akademik kafedralar va bo'limlar</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="w-4 h-4 mr-2" />
            Yangi Kafedra
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Kafedra nomi bo'yicha qidirish..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.faculty_id || 'all'} onValueChange={handleFacultyChange}>
            <SelectTrigger>
              <Building2 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Fakultet" />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((department) => (
            <Card
              key={department.id}
              className="p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer"
            >
              {/* Department Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-600">{department.code}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {department.name}
                  </h3>
                  {department.short_name && (
                    <p className="text-sm text-gray-600 mt-1">({department.short_name})</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    department.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {department.status === 'active' ? 'Faol' : 'Faol emas'}
                </span>
              </div>

              {/* Faculty Badge */}
              {department.faculty_name && (
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                    <Building2 className="w-3 h-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">
                      {department.faculty_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Head Info */}
              {department.head_name && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {department.head_name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">Mudir</p>
                  {department.head_phone && (
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{department.head_phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{department.teachers_count || 0}</p>
                  <p className="text-xs text-gray-600">O'qituvchilar</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{department.subjects_count || 0}</p>
                  <p className="text-xs text-gray-600">Fanlar</p>
                </div>
              </div>

              {/* Location */}
              {department.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{department.location}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!isLoading && departments?.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kafedralar topilmadi</h3>
          <p className="text-gray-600">
            Qidiruv sozlamalarini o'zgartiring yoki yangi kafedra qo'shing
          </p>
        </div>
      )}
    </div>
  )
}

