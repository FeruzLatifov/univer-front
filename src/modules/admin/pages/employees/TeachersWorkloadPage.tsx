import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  Filter,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react'
import { employeesApi } from '@/lib/api/employees'
import { Card } from '@/components/ui/card'
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
import { Progress } from '@/components/ui/progress'
import type { TeacherWorkload, WorkloadFilters } from '@/lib/types/employee'

export default function TeachersWorkloadPage() {
  const [filters, setFilters] = useState<WorkloadFilters>({
    academic_year: '2024-2025',
    status: 'all',
  })

  const { data: workloads, isLoading } = useQuery<TeacherWorkload[]>({
    queryKey: ['workloads', filters],
    queryFn: () => employeesApi.getWorkloads(filters),
  })

  const handleAcademicYearChange = (value: string) => {
    setFilters({ ...filters, academic_year: value })
  }

  const handleStatusChange = (value: WorkloadFilters['status']) => {
    setFilters({ ...filters, status: value })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Rejalashtirilgan
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Tasdiqlangan
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-purple-100 text-purple-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Bajarilgan
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const calculateWorkloadPercentage = (total: number, standard: number = 900) => {
    return Math.min((total / standard) * 100, 100)
  }

  const getWorkloadColor = (total: number, standard: number = 900) => {
    const percentage = (total / standard) * 100
    if (percentage < 80) return 'text-yellow-600 bg-yellow-50'
    if (percentage > 110) return 'text-red-600 bg-red-50'
    return 'text-green-600 bg-green-50'
  }

  const academicYears = ['2023-2024', '2024-2025', '2025-2026']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">O'qituvchilar Yuklama</h1>
              <p className="text-purple-100">Pedagogik yuklama boshqaruvi va monitoring</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white/20 text-white hover:bg-white/30">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.academic_year} onValueChange={handleAcademicYearChange}>
            <SelectTrigger>
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue placeholder="O'quv yili" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year} o'quv yili
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => handleStatusChange(value as WorkloadFilters['status'])}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="planned">Rejalashtirilgan</SelectItem>
              <SelectItem value="approved">Tasdiqlangan</SelectItem>
              <SelectItem value="completed">Bajarilgan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>O'qituvchi</TableHead>
                <TableHead>Jami soatlar</TableHead>
                <TableHead>Ma'ruzalar</TableHead>
                <TableHead>Amaliy</TableHead>
                <TableHead>Laboratoriya</TableHead>
                <TableHead>Yuklama</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workloads?.map((workload) => {
                const standard = 900
                const percentage = calculateWorkloadPercentage(workload.total_hours, standard)
                const colorClass = getWorkloadColor(workload.total_hours, standard)

                return (
                  <TableRow key={workload.teacher_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{workload.teacher_id}</p>
                        <p className="text-sm text-gray-600">{workload.academic_year}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${colorClass}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-bold">{workload.total_hours}</span>
                        <span className="text-xs">/ {standard}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{workload.lecture_hours}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{workload.practice_hours}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{workload.lab_hours}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{percentage.toFixed(0)}%</span>
                          {percentage < 80 && (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                          {percentage > 110 && (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(workload.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {!isLoading && workloads?.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Yuklama ma'lumotlari topilmadi</h3>
              <p className="text-gray-600">Tanlangan o'quv yil uchun ma'lumotlar mavjud emas</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

