import { useState } from 'react'
import { mockStudents } from '@/lib/mockData'
import {
  Search,
  Plus,
  Filter,
  GraduationCap,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getGradeColor } from '@/lib/utils'

export default function StudentsPageCompact() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStudents = mockStudents.filter(student => {
    if (!student || !student.name || !student.student_id) return false
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: 'Faol', className: 'bg-green-100 text-green-700' },
      academic_leave: { label: "Ta'tilda", className: 'bg-yellow-100 text-yellow-700' },
      expelled: { label: 'Chetlashtirilgan', className: 'bg-red-100 text-red-700' },
      graduated: { label: 'Bitiruvchi', className: 'bg-purple-100 text-purple-700' },
    }
    const statusData = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' }
    return <Badge className={`${statusData.className} text-[10px]`}>{statusData.label}</Badge>
  }

  return (
    <div className="p-3 space-y-3">
      {/* Ultra-Dense Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-2.5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold">Talabalar</h1>
              <p className="text-[11px] text-green-100">Jami: {mockStudents.length} • Faol: {mockStudents.filter(s => s && s.status === 'active').length}</p>
            </div>
          </div>
          <Button className="bg-white text-green-600 hover:bg-green-50 h-7 text-[11px] px-2">
            <Plus className="w-3 h-3 mr-1" />
            Yangi
          </Button>
        </div>
      </div>

      {/* Ultra-Dense Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="relative md:col-span-2">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <Input
            placeholder="Talaba ismi yoki ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Holat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="active">Faol</SelectItem>
            <SelectItem value="academic_leave">Ta'tilda</SelectItem>
            <SelectItem value="expelled">Chetlashtirilgan</SelectItem>
            <SelectItem value="graduated">Bitiruvchi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ultra-Dense Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-600">ID</th>
                <th className="text-left text-gray-600">Talaba</th>
                <th className="text-left text-gray-600">Guruh</th>
                <th className="text-left text-gray-600">Fakultet</th>
                <th className="text-left text-gray-600">Aloqa</th>
                <th className="text-center text-gray-600">GPA</th>
                <th className="text-center text-gray-600">Holat</th>
                <th className="text-right text-gray-600">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <code className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-mono">
                      {student.student_id}
                    </code>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {student.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-[10px] text-gray-500">Kurs: {student.course}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge className="bg-purple-50 text-purple-700 text-[10px]">
                      {student.group}
                    </Badge>
                  </td>
                  <td>
                    <p className="text-gray-900">{student.faculty}</p>
                  </td>
                  <td>
                    {student.email && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-600">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Phone className="w-3 h-3" />
                        {student.phone}
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <span className={`inline-flex items-center justify-center min-w-[2.5rem] h-5 rounded font-bold text-[11px] px-1.5 ${getGradeColor(student.gpa)}`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" className="h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Talabalar topilmadi</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

