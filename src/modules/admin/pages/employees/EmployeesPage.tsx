import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Search,
  Filter,
  Plus,
  UserCircle,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import { employeesApi } from '@/lib/api/employees'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { EmployeeFilters } from '@/lib/types/employee'

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: 'all',
    search: '',
    is_teacher: undefined,
  })
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesApi.getEmployees(filters),
  })

  const { data: stats } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: () => employeesApi.getStats(),
  })

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as any })
  }

  const handleTypeChange = (value: string) => {
    if (value === 'all') {
      setFilters({ ...filters, is_teacher: undefined })
    } else {
      setFilters({ ...filters, is_teacher: value === 'teachers' })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Faol</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Faol emas</Badge>
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-700">Ta'tilda</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const statCards = [
    {
      title: 'Jami Xodimlar',
      value: stats?.total_count || 0,
      color: 'from-blue-500 to-blue-600',
      icon: Users,
    },
    {
      title: "O'qituvchilar",
      value: stats?.teachers_count || 0,
      color: 'from-green-500 to-green-600',
      icon: GraduationCap,
    },
    {
      title: 'Ilmiy Darajali',
      value: stats?.with_degree_count || 0,
      color: 'from-purple-500 to-purple-600',
      icon: Award,
    },
    {
      title: 'Xorijliklar',
      value: stats?.foreign_count || 0,
      color: 'from-orange-500 to-orange-600',
      icon: Globe,
    },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Xodimlar</h1>
              <p className="text-sm text-blue-100">Universitet xodimlari</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 h-9" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Yangi
          </Button>
        </div>
      </div>

      {/* Compact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Compact Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Qidirish..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Select
          value={filters.is_teacher === undefined ? 'all' : filters.is_teacher ? 'teachers' : 'staff'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="h-9">
            <Briefcase className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Turi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="teachers">O'qituvchilar</SelectItem>
            <SelectItem value="staff">Xodimlar</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Holat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="active">Faol</SelectItem>
            <SelectItem value="inactive">Faol emas</SelectItem>
            <SelectItem value="on-leave">Ta'tilda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Compact Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Xodim</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Lavozim</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Bo'lim</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Aloqa</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Daraja</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Holat</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {employees?.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        {employee.photo ? (
                          <img
                            src={employee.photo}
                            alt={employee.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{employee.full_name}</p>
                        <p className="text-xs text-gray-500">{employee.employee_id_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {employee.is_teacher && (
                        <GraduationCap className="w-3 h-3 text-blue-600" />
                      )}
                      <span className="text-sm">{employee.position}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {employee.department_name && (
                      <p className="text-sm font-medium text-gray-900">{employee.department_name}</p>
                    )}
                    {employee.faculty_name && (
                      <p className="text-xs text-gray-500">{employee.faculty_name}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {employee.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {employee.academic_degree && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                        {employee.academic_degree}
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">{getStatusBadge(employee.status)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {!isLoading && employees?.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-600">
                    Xodimlar topilmadi
                  </td>
                </tr>
              </tbody>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

