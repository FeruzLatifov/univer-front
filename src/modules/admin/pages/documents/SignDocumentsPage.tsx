/**
 * Sign Documents Page
 *
 * Displays list of documents for current user to sign
 * Based on Yii2: backend/views/document/sign-documents.php
 *
 * Features:
 * - Advanced filtering (search, status, type, signer type, date range)
 * - Statistics cards
 * - Responsive design
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  Filter,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react'

import { getDocuments, getDocumentStats, type DocumentsFilters } from '@/lib/api/documents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import type { DateRange } from 'react-day-picker'

export default function SignDocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Filters from URL
  const filters: DocumentsFilters = {
    page: parseInt(searchParams.get('page') || '1'),
    per_page: parseInt(searchParams.get('per_page') || '50'),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    document_type: searchParams.get('document_type') || 'all',
    signer_type: searchParams.get('signer_type') || 'all',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
  }

  // Fetch documents
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['documents', filters],
    queryFn: () => getDocuments(filters),
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['document-stats'],
    queryFn: () => getDocumentStats(),
  })

  // Update URL params
  const updateFilters = (newFilters: Partial<DocumentsFilters>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })

    setSearchParams(params)
  }

  // Handle search
  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 })
  }

  // Handle date range
  useEffect(() => {
    if (dateRange?.from) {
      updateFilters({
        date_from: dateRange.from.toISOString().split('T')[0],
        date_to: dateRange.to?.toISOString().split('T')[0] || dateRange.from.toISOString().split('T')[0],
        page: 1,
      })
    } else {
      updateFilters({ date_from: '', date_to: '' })
    }
  }, [dateRange])

  // Get status badge variant
  const getStatusBadgeClass = (status: string) => {
    return status === 'signed'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'
  }

  // Get signer type badge variant
  const getSignerTypeBadgeClass = (type: string) => {
    return type === 'approver'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-purple-50 text-purple-700 border-purple-200'
  }

  // Clear all filters
  const clearFilters = () => {
    setDateRange(undefined)
    setSearchParams({})
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Imzolash uchun hujjatlar
          </h1>
          <p className="text-muted-foreground mt-1">
            Sizning imzoingizni kutayotgan hujjatlar
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yangilash
          </Button>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Tozalash
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats?.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami</p>
                <p className="text-2xl font-bold">{stats.data.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-75" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kutilmoqda</p>
                <p className="text-2xl font-bold text-amber-600">{stats.data.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-75" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Imzolangan</p>
                <p className="text-2xl font-bold text-green-600">{stats.data.signed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-75" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugungi</p>
                <p className="text-2xl font-bold text-blue-600">{stats.data.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500 opacity-75" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Filterlar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Hujjat nomi / Xodim qidirish..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              {data?.filters?.available_statuses?.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              )) || (
                <SelectItem value="all">Hammasi</SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Document Type Filter */}
          <Select value={filters.document_type} onValueChange={(value) => updateFilters({ document_type: value, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Hujjat turi" />
            </SelectTrigger>
            <SelectContent>
              {data?.filters?.available_types?.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              )) || (
                <SelectItem value="all">Barcha turlar</SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Signer Type Filter */}
          <Select value={filters.signer_type} onValueChange={(value) => updateFilters({ signer_type: value, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Imzo turi" />
            </SelectTrigger>
            <SelectContent>
              {data?.filters?.available_signer_types?.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              )) || (
                <SelectItem value="all">Barcha imzo turlari</SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="lg:col-span-2">
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-sm">#</th>
                <th className="text-left p-4 font-medium text-sm">Hujjat nomi</th>
                <th className="text-left p-4 font-medium text-sm">Imzo turi</th>
                <th className="text-left p-4 font-medium text-sm">Lavozim va Bo'lim</th>
                <th className="text-left p-4 font-medium text-sm">Holat</th>
                <th className="text-left p-4 font-medium text-sm">Imzolangan vaqt</th>
                <th className="text-left p-4 font-medium text-sm">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4"><Skeleton className="h-4 w-8" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-20" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
                    <p className="text-muted-foreground">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                      Qayta urinish
                    </Button>
                  </td>
                </tr>
              ) : !data?.data || data.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Hujjatlar topilmadi</p>
                  </td>
                </tr>
              ) : (
                data.data.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {(data.meta.from || 0) + index}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{item.document.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.document.type_label}
                          </Badge>
                          <span>#{item.document.document_id}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <Badge variant="outline" className={getSignerTypeBadgeClass(item.signer_type)}>
                          {item.signer_type_label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.created_at_human}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium">{item.employee_position}</p>
                        <p className="text-xs text-muted-foreground">{item.department}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={getStatusBadgeClass(item.status)}>
                        {item.status === 'signed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {item.status_label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">
                          {item.signed_at ? new Date(item.signed_at).toLocaleDateString('uz-UZ') : '-'}
                        </p>
                        {item.signed_at_human && (
                          <p className="text-xs text-muted-foreground">{item.signed_at_human}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" disabled={item.status === 'signed'}>
                        {item.status === 'signed' ? 'Imzolangan' : 'Imzolash'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              {data.meta.from}-{data.meta.to} / {data.meta.total} ta natija
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.current_page === 1}
                onClick={() => updateFilters({ page: data.meta.current_page - 1 })}
              >
                Oldingi
              </Button>

              <span className="text-sm px-4">
                {data.meta.current_page} / {data.meta.last_page}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.current_page === data.meta.last_page}
                onClick={() => updateFilters({ page: data.meta.current_page + 1 })}
              >
                Keyingi
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
