import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRightLeft,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Users,
} from 'lucide-react'
import { decreesApi } from '@/lib/api/decrees'
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
import type { TransferFilters } from '@/lib/types/decree'
import { formatDate } from '@/lib/utils'

export default function TransfersPage() {
  const [filters, setFilters] = useState<TransferFilters>({
    status: 'all',
    search: '',
  })

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['transfers', filters],
    queryFn: () => decreesApi.getTransfers(filters),
  })

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as any })
  }

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, transfer_type: value === 'all' ? undefined : value })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Kutilmoqda
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Tasdiqlangan
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Rad etilgan
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

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      group: { label: 'Guruhga', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      course: { label: 'Kursga', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      faculty: { label: 'Fakultetga', color: 'bg-green-50 text-green-700 border-green-200' },
      specialty: { label: "Yo'nalishga", color: 'bg-orange-50 text-orange-700 border-orange-200' },
      'education-form': { label: "Ta'lim shakliga", color: 'bg-pink-50 text-pink-700 border-pink-200' },
    }
    const typeData = types[type] || { label: type, color: 'bg-gray-50 text-gray-700 border-gray-200' }
    return (
      <Badge variant="outline" className={typeData.color}>
        {typeData.label}
      </Badge>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ko'chirishlar</h1>
              <p className="text-sm text-blue-100">Talabalarni ko'chirish</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 h-9" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Yangi
          </Button>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Talaba ismi..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Select value={filters.transfer_type || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-9">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Turi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha turlar</SelectItem>
            <SelectItem value="group">Guruhga</SelectItem>
            <SelectItem value="course">Kursga</SelectItem>
            <SelectItem value="faculty">Fakultetga</SelectItem>
            <SelectItem value="specialty">Yo'nalishga</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Holat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="pending">Kutilmoqda</SelectItem>
            <SelectItem value="approved">Tasdiqlangan</SelectItem>
            <SelectItem value="rejected">Rad etilgan</SelectItem>
            <SelectItem value="completed">Bajarilgan</SelectItem>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Talaba</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Turi</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Qayerdan</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Qayerga</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Sana</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Holat</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {transfers?.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900 text-sm">{transfer.student_name}</p>
                    <p className="text-xs text-gray-500">{transfer.student_id_number}</p>
                  </td>
                  <td className="px-3 py-2">{getTypeBadge(transfer.transfer_type)}</td>
                  <td className="px-3 py-2">
                    {transfer.from_group_name && (
                      <p className="text-sm text-gray-900">{transfer.from_group_name}</p>
                    )}
                    {transfer.from_faculty_name && (
                      <p className="text-xs text-gray-500">{transfer.from_faculty_name}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {transfer.to_group_name && (
                      <p className="text-sm text-blue-700 font-medium">{transfer.to_group_name}</p>
                    )}
                    {transfer.to_faculty_name && (
                      <p className="text-xs text-gray-500">{transfer.to_faculty_name}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm">{formatDate(transfer.transfer_date)}</p>
                    <p className="text-xs text-gray-500">{transfer.created_by_name}</p>
                  </td>
                  <td className="px-3 py-2 text-center">{getStatusBadge(transfer.status)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {transfer.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {!isLoading && transfers?.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-600">
                    Ko'chirishlar topilmadi
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

