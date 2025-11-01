import { useQuery } from '@tanstack/react-query'
import { Award, Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import { employeesApi } from '@/lib/api/employees'
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

export default function AcademicDegreesPage() {
  const { data: degrees, isLoading } = useQuery({
    queryKey: ['academic-degrees'],
    queryFn: () => employeesApi.getAcademicDegrees(),
  })

  const { data: ranks } = useQuery({
    queryKey: ['academic-ranks'],
    queryFn: () => employeesApi.getAcademicRanks(),
  })

  const getLevelBadge = (level: number) => {
    const levels = [
      { level: 1, label: 'Bakalavr', color: 'bg-blue-100 text-blue-700' },
      { level: 2, label: 'Magistr', color: 'bg-green-100 text-green-700' },
      { level: 3, label: 'PhD', color: 'bg-purple-100 text-purple-700' },
      { level: 4, label: 'DSc', color: 'bg-red-100 text-red-700' },
    ]
    const levelData = levels.find((l) => l.level === level) || levels[0]
    return <Badge className={levelData.color}>{levelData.label}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ilmiy Darajalar</h1>
              <p className="text-purple-100">Ilmiy darajalar va unvonlar boshqaruvi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Degrees */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Ilmiy Darajalar
            </h2>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Qo'shish
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Daraja</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {degrees?.map((degree) => (
                    <TableRow key={degree.id}>
                      <TableCell>
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {degree.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{degree.name}</p>
                        {degree.description && (
                          <p className="text-sm text-gray-600">{degree.description}</p>
                        )}
                      </TableCell>
                      <TableCell>{getLevelBadge(degree.level)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            degree.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {degree.status === 'active' ? 'Faol' : 'Faol emas'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!isLoading && degrees?.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Ilmiy darajalar topilmadi
                  </h3>
                  <p className="text-xs text-gray-600">Yangi ilmiy daraja qo'shing</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Academic Ranks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Ilmiy Unvonlar
            </h2>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Qo'shish
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Daraja</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranks?.map((rank) => (
                  <TableRow key={rank.id}>
                    <TableCell>
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {rank.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{rank.name}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rank.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          rank.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {rank.status === 'active' ? 'Faol' : 'Faol emas'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {ranks?.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Ilmiy unvonlar topilmadi
                </h3>
                <p className="text-xs text-gray-600">Yangi ilmiy unvon qo'shing</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

