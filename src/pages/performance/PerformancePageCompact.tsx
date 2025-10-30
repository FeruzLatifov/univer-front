import { useState } from 'react'
import { mockPerformanceRecords } from '@/lib/mockData'
import {
  ClipboardCheck,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getGradeColor } from '@/lib/utils'

export default function PerformancePageCompact() {
  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('all')

  const filteredRecords = mockPerformanceRecords.filter((record) => {
    const matchesSearch =
      record.student_name.toLowerCase().includes(search.toLowerCase()) ||
      record.subject_name.toLowerCase().includes(search.toLowerCase())
    const matchesSemester =
      semesterFilter === 'all' || record.semester.toString() === semesterFilter
    return matchesSearch && matchesSemester
  })

  const avgScore = (filteredRecords.reduce((sum, r) => sum + r.total_score, 0) / filteredRecords.length).toFixed(1)

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Akademik Baholash</h1>
              <p className="text-sm text-purple-100">O'rtacha: {avgScore} ball</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <p className="text-xs text-gray-600">Jami yozuvlar</p>
          <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">A'lo</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredRecords.filter(r => r.grade === 'A').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Yaxshi</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredRecords.filter(r => r.grade === 'B').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Qoniqarli</p>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredRecords.filter(r => r.grade === 'C').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Talaba yoki fan nomi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Semestr" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha semestrlar</SelectItem>
            <SelectItem value="1">1-semestr</SelectItem>
            <SelectItem value="2">2-semestr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Compact Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Talaba</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Fan</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Sem</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Oraliq</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Joriy</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Yakuniy</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Jami</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Baho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900 text-sm">{record.student_name}</p>
                    <p className="text-xs text-gray-500">{record.student_id}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm text-gray-900">{record.subject_name}</p>
                    <p className="text-xs text-gray-500">{record.credit} kredit</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-medium">{record.semester}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-medium">{record.midterm_score}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-medium">{record.current_score}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-medium">{record.final_exam_score}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-sm font-bold">{record.total_score}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={`${getGradeColor(parseFloat(record.grade))} text-xs font-bold`}>
                      {record.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">Ma'lumot topilmadi</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

