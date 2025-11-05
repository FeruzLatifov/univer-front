import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FileText,
  Eye,
  PenTool,
  Search,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { employeeDocumentService } from '@/services/employee/DocumentService'
import type { DocumentListFilters } from '@/services/employee/DocumentService'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { useToast } from '@/hooks/use-toast'
import { useMenuStore } from '@/stores/menuStore'
import type { DateRange } from 'react-day-picker'

export default function DocumentSignPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const findMenuByUrl = useMenuStore((s) => s.findMenuByUrl)
  const menuItem = findMenuByUrl('/document/sign-documents')
  const dashboardItem = useMenuStore((s) => s.findMenuByUrl('/dashboard'))
  const pageTitle = menuItem?.label || 'Hujjatni imzolash'
  const homeLabel = dashboardItem?.label || 'Asosiy'

  // Filters state
  const [filters, setFilters] = useState<DocumentListFilters>({
    per_page: 20,
  })
  const [searchInput, setSearchInput] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Dialog states
  const [selectedHash, setSelectedHash] = useState<string | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isSignConfirmOpen, setIsSignConfirmOpen] = useState(false)

  // Build query filters with debounced search and date range
  const queryFilters = useMemo(() => {
    return {
      ...filters,
      search: searchInput || undefined,
      date_from: dateRange?.from?.toISOString().split('T')[0],
      date_to: dateRange?.to?.toISOString().split('T')[0],
    }
  }, [filters, searchInput, dateRange])

  // Fetch documents list
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['employee-documents', queryFilters],
    queryFn: () => employeeDocumentService.getDocumentsToSign(queryFilters),
  })

  // Fetch document details
  const { data: documentDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['employee-document-detail', selectedHash],
    queryFn: () => employeeDocumentService.getDocumentByHash(selectedHash!),
    enabled: !!selectedHash && isViewOpen,
  })

  // Sign document mutation
  const signMutation = useMutation({
    mutationFn: (hash: string) => employeeDocumentService.signDocument(hash),
    onSuccess: (data) => {
      toast({
        title: 'Muvaffaqiyat',
        description: data.message || 'Hujjat imzolandi',
      })
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] })
      queryClient.invalidateQueries({ queryKey: ['employee-document-detail'] })
      setIsSignConfirmOpen(false)
      setIsViewOpen(false)
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Hujjatni imzolashda xatolik',
        variant: 'destructive',
      })
    },
  })

  const documents = documentsData?.items || []
  const pagination = documentsData?.pagination

  const handleViewDocument = (hash: string) => {
    setSelectedHash(hash)
    setIsViewOpen(true)
  }

  const handleSignClick = (hash: string) => {
    setSelectedHash(hash)
    setIsSignConfirmOpen(true)
  }

  const handleSignConfirm = () => {
    if (selectedHash) {
      signMutation.mutate(selectedHash)
    }
  }

  const handleFilterChange = (key: keyof DocumentListFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ per_page: 20 })
    setSearchInput('')
    setDateRange(undefined)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-[#F2C94C] text-[#1E2124]">
            <Clock className="w-3 h-3 mr-1" />
            Kutilmoqda
          </Badge>
        )
      case 'signed':
        return (
          <Badge className="bg-[#27AE60] text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Imzolangan
          </Badge>
        )
      default:
        return <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'reviewer':
        return <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">Kelishuvchi</Badge>
      case 'approver':
        return <Badge className="bg-[#2F80ED] text-white">Tasdiqlovchi</Badge>
      default:
        return <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">{type}</Badge>
    }
  }

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'webimzo':
        return 'WebImzo'
      case 'eduimzo':
        return 'EduImzo'
      case 'local':
        return 'Lokal'
      default:
        return provider
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[#F5F6FA] min-h-screen text-[#1E2124]">
      {/* Header (compact, Yii2-like) */}
      <div className="mb-2">
        <div className="text-sm text-[#6B7280]">{homeLabel} <span className="mx-2">/</span> {pageTitle}</div>
        <h1 className="mt-1 text-2xl font-semibold text-[#1E2124]">{pageTitle}</h1>
      </div>

      {/* Filters */}
      <Card className="border-[#E5E7EB]">
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <h2 className="text-lg font-semibold text-[#1E2124]">Qidiruv va filtr</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearFilters}
              className="border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tozalash
            </Button>
          </div>

          <div className="space-y-4">
            {/* Row 1: Search + Status + Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  placeholder="Hujjat nomi yoki xodim ismi..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 border-[#E5E7EB]"
                />
              </div>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('status', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger className="border-[#E5E7EB]">
                  <SelectValue placeholder="Holat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha holatlar</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                  <SelectItem value="signed">Imzolangan</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('type', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger className="border-[#E5E7EB]">
                  <SelectValue placeholder="Imzo turi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha turlar</SelectItem>
                  <SelectItem value="reviewer">Kelishuvchi</SelectItem>
                  <SelectItem value="approver">Tasdiqlovchi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Date Range + Document Type + Per Page */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-[#6B7280] mb-1.5 block">Sana oralig'i</label>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-[#6B7280] mb-1.5 block">Hujjat turi</label>
                <Input
                  placeholder="Barcha turlar"
                  value={filters.document_type || ''}
                  onChange={(e) => handleFilterChange('document_type', e.target.value)}
                  className="border-[#E5E7EB]"
                />
              </div>

              <div>
                <label className="text-sm text-[#6B7280] mb-1.5 block">Sahifada</label>
                <Select
                  value={String(filters.per_page || 20)}
                  onValueChange={(value) => handleFilterChange('per_page', Number(value))}
                >
                  <SelectTrigger className="border-[#E5E7EB]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 ta</SelectItem>
                    <SelectItem value="20">20 ta</SelectItem>
                    <SelectItem value="50">50 ta</SelectItem>
                    <SelectItem value="100">100 ta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
        </div>
      ) : (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hujjatlar</h2>
              {pagination && (
                <p className="text-sm text-[#6B7280]">
                  Jami: {pagination.total} ta hujjat
                </p>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E2124] mb-2">
                  Hujjatlar topilmadi
                </h3>
                <p className="text-[#6B7280]">Sizga imzolash uchun hujjatlar mavjud emas</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 border-[#E5E7EB]">
                        <TableHead className="text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Hujjat
                          </div>
                        </TableHead>
                        <TableHead className="text-[#6B7280]">Holat</TableHead>
                        <TableHead className="text-[#6B7280]">Rol</TableHead>
                        <TableHead className="text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Sana
                          </div>
                        </TableHead>
                        <TableHead className="text-right text-[#6B7280]">Amallar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} className="border-[#E5E7EB] hover:bg-gray-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#2F80ED]/10 text-[#2F80ED] flex items-center justify-center flex-shrink-0 mt-1">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#1E2124]">{doc.document_title}</p>
                                <p className="text-xs text-[#6B7280] mt-0.5">{doc.document_type}</p>
                                {doc.employee_name && (
                                  <p className="text-xs text-[#6B7280] mt-0.5">
                                    {doc.employee_name} · {doc.employee_position}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>{getTypeBadge(doc.type)}</TableCell>
                          <TableCell>
                            <p className="text-sm text-[#6B7280]">
                              {new Date(doc.created_at).toLocaleDateString('uz-UZ')}
                            </p>
                            {doc.signed_at && (
                              <p className="text-xs text-[#27AE60] mt-0.5">
                                ✓ {new Date(doc.signed_at).toLocaleDateString('uz-UZ')}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => handleViewDocument(doc.document_hash)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {doc.status === 'pending' && (
                                <Button
                                  size="sm"
                                  className="h-8 px-3 bg-[#2F80ED] hover:bg-[#2666BE] text-white"
                                  onClick={() => handleSignClick(doc.document_hash)}
                                >
                                  <PenTool className="w-3 h-3 mr-1" />
                                  Imzolash
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-[#6B7280]">
                      {pagination.from}-{pagination.to} / {pagination.total}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pagination.current_page === 1}
                      >
                        Oldingi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pagination.current_page === pagination.last_page}
                      >
                        Keyingi
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* View Document Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Hujjat tafsilotlari
            </DialogTitle>
            <DialogDescription>
              {documentDetail?.document_title || 'Yuklanmoqda...'}
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED]"></div>
          </div>
          ) : documentDetail ? (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Hujjat turi</p>
                  <p className="font-medium">{documentDetail.document_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Holat</p>
                  <div>{getStatusBadge(documentDetail.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Imzo turi</p>
                  <p className="font-medium">{getProviderLabel(documentDetail.provider)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yaratilgan</p>
                  <p className="font-medium">
                    {new Date(documentDetail.created_at).toLocaleString('uz-UZ')}
                  </p>
                </div>
              </div>

              {/* Signers List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Imzolovchilar</h3>
                <div className="space-y-2">
                  {documentDetail.signers?.map((signer) => (
                    <div
                      key={signer.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600">
                            {signer.priority}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{signer.employee_name}</p>
                          <p className="text-sm text-gray-600">{signer.employee_position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTypeBadge(signer.type)}
                        {getStatusBadge(signer.status)}
                        {signer.signed_at && (
                          <p className="text-xs text-gray-500">
                            {new Date(signer.signed_at).toLocaleDateString('uz-UZ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Sign Confirmation Dialog */}
      <Dialog open={isSignConfirmOpen} onOpenChange={setIsSignConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Hujjatni imzolash
            </DialogTitle>
            <DialogDescription>
              Hujjatni imzolashni tasdiqlaysizmi? Bu amaldan qaytib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSignConfirmOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleSignConfirm}
              disabled={signMutation.isPending}
              className="bg-[#2F80ED] hover:bg-[#2666BE]"
            >
              {signMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Imzolanmoqda...
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4 mr-2" />
                  Imzolash
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
