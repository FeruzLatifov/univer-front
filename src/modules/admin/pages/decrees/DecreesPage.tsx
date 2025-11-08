import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Download,
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
import { Badge } from '@/components/ui/badge'
import type { DecreeFilters } from '@/lib/types/decree'
import { formatDate } from '@/lib/utils'

export default function DecreesPage() {
  const [filters, setFilters] = useState<DecreeFilters>({
    status: 'all',
    search: '',
  })

  const { data: decrees, isLoading } = useQuery({
    queryKey: ['decrees', filters],
    queryFn: () => decreesApi.getDecrees(filters),
  })

  const { data: stats } = useQuery({
    queryKey: ['decree-stats'],
    queryFn: () => decreesApi.getStats(),
  })

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: DecreeFilters['status']) => {
    setFilters({ ...filters, status: value })
  }

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, decree_type: value === 'all' ? undefined : value })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <Edit className="w-3 h-3 mr-1" />
            Qoralama
          </Badge>
        )
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
      case 'archived':
        return (
          <Badge className="bg-purple-100 text-purple-700">
            <FileText className="w-3 h-3 mr-1" />
            Arxivlangan
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      enrollment: { label: 'Qabul', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      transfer: { label: "Ko'chirish", color: 'bg-purple-50 text-purple-700 border-purple-200' },
      expulsion: { label: 'Chetlatish', color: 'bg-red-50 text-red-700 border-red-200' },
      graduation: { label: 'Bitiruv', color: 'bg-green-50 text-green-700 border-green-200' },
      'academic-leave': { label: "Ta'til", color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      restore: { label: 'Tiklash', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      disciplinary: { label: 'Intizomiy', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    }
    const typeData = types[type] || { label: type, color: 'bg-gray-50 text-gray-700 border-gray-200' }
    return (
      <Badge variant="outline" className={typeData.color}>
        {typeData.label}
      </Badge>
    )
  }

  const statCards = [
    {
      title: 'Jami Buyruqlar',
      value: stats?.total_decrees || 0,
      color: 'from-blue-500 to-blue-600',
      icon: FileText,
    },
    {
      title: 'Kutilmoqda',
      value: stats?.pending_decrees || 0,
      color: 'from-yellow-500 to-yellow-600',
      icon: Clock,
    },
    {
      title: 'Tasdiqlangan',
      value: stats?.approved_decrees || 0,
      color: 'from-green-500 to-green-600',
      icon: CheckCircle,
    },
    {
      title: 'Shu oy',
      value: stats?.this_month_count || 0,
      color: 'from-purple-500 to-purple-600',
      icon: FileText,
    },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Buyruqlar</h1>
              <p className="text-sm text-indigo-100">Talabalar buyruqlari</p>
            </div>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 h-9" size="sm">
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
            placeholder="Buyruq raqami..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Select value={filters.decree_type || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-9">
            <FileText className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Turi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha turlar</SelectItem>
            <SelectItem value="enrollment">Qabul</SelectItem>
            <SelectItem value="transfer">Ko'chirish</SelectItem>
            <SelectItem value="expulsion">Chetlatish</SelectItem>
            <SelectItem value="graduation">Bitiruv</SelectItem>
            <SelectItem value="academic-leave">Ta'til</SelectItem>
            <SelectItem value="restore">Tiklash</SelectItem>
            <SelectItem value="disciplinary">Intizomiy</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => handleStatusChange(value as DecreeFilters['status'])}>
          <SelectTrigger className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Holat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="draft">Qoralama</SelectItem>
            <SelectItem value="pending">Kutilmoqda</SelectItem>
            <SelectItem value="approved">Tasdiqlangan</SelectItem>
            <SelectItem value="rejected">Rad etilgan</SelectItem>
            <SelectItem value="archived">Arxivlangan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Compact Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Buyruq</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Sarlavha</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Turi</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Talaba</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Sana</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Holat</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {decrees?.map((decree) => (
                <tr key={decree.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="font-mono font-medium text-indigo-600 text-sm">{decree.decree_number}</div>
                    <div className="text-xs text-gray-500">{formatDate(decree.decree_date)}</div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{decree.title}</p>
                    {decree.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">{decree.description}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">{getTypeBadge(decree.decree_type)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-50 text-blue-700 rounded font-medium text-xs">
                      {decree.students.length}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm">{formatDate(decree.created_at)}</p>
                    <p className="text-xs text-gray-500">{decree.created_by_name}</p>
                  </td>
                  <td className="px-3 py-2 text-center">{getStatusBadge(decree.status)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {decree.file && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
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

            {!isLoading && decrees?.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-600">
                    Buyruqlar topilmadi
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

