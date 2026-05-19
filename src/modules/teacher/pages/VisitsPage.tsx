import { useState, type FormEvent } from 'react'
import { Plus, Home, MapPin, Calendar, Search } from 'lucide-react'
import { useTutorVisits, useCreateTutorVisit } from '@/hooks/useTutorVisits'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function VisitsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, error } = useTutorVisits({
    search: debouncedSearch || undefined,
    per_page: 50,
  })

  const visits = data?.items ?? []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talaba tashriflari</h1>
          <p className="text-muted-foreground mt-1">
            Kurator tomonidan o'tkazilgan tashriflar tarixi
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yangi tashrif
            </Button>
          </DialogTrigger>
          <CreateVisitDialogContent onClose={() => setDialogOpen(false)} />
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDebouncedSearch(search.trim())
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Talaba ismi yoki id raqami bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {error && (
        <Card className="border-error-200 bg-error-50 dark:bg-error-950">
          <CardContent className="pt-6">
            <p className="text-error-700 dark:text-error-300">
              Tashriflarni yuklashda xatolik yuz berdi
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && visits.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Home className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>
              {debouncedSearch
                ? "Qidiruv bo'yicha tashrif topilmadi"
                : "Hozircha tashriflar yo'q. Yangisini qo'shish uchun yuqori-o'ngdagi tugmani bosing."}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && visits.length > 0 && (
        <div className="space-y-3">
          {visits.map((visit) => {
            const fullName = visit.student
              ? [visit.student.second_name, visit.student.first_name, visit.student.third_name]
                  .filter(Boolean)
                  .join(' ')
              : `Student #${visit._student}`

            return (
              <Card key={visit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{fullName}</h3>
                        {visit.student?.student_id_number && (
                          <Badge variant="outline" className="text-xs">
                            {visit.student.student_id_number}
                          </Badge>
                        )}
                      </div>
                      {visit.current_address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{visit.current_address}</span>
                        </div>
                      )}
                      {visit.comment && (
                        <p className="text-sm text-muted-foreground italic">
                          "{visit.comment}"
                        </p>
                      )}
                      {visit.roommate_count != null && (
                        <div className="text-xs text-muted-foreground">
                          Birga yashaydiganlar: {visit.roommate_count}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(visit.created_at).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CreateVisitDialogContent({ onClose }: { onClose: () => void }) {
  const [studentId, setStudentId] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [comment, setComment] = useState('')
  const [roommateCount, setRoommateCount] = useState('')
  const [geolocation, setGeolocation] = useState('')

  const mutation = useCreateTutorVisit()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const sid = Number(studentId)
    if (!sid) return

    mutation.mutate(
      {
        _student: sid,
        current_address: currentAddress || null,
        comment: comment || null,
        roommate_count: roommateCount ? Number(roommateCount) : null,
        geolocation: geolocation || null,
      },
      {
        onSuccess: () => {
          setStudentId('')
          setCurrentAddress('')
          setComment('')
          setRoommateCount('')
          setGeolocation('')
          onClose()
        },
      }
    )
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Yangi tashrif</DialogTitle>
        <DialogDescription>
          Talabaga tashrif buyurgan bo'lsangiz uning ma'lumotlarini saqlang. Yangi manzil
          talabaning profayliga avtomatik ko'chiriladi.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student_id">Talaba ID *</Label>
          <Input
            id="student_id"
            type="number"
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Masalan: 5021"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current_address">Joriy manzil</Label>
          <Input
            id="current_address"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            placeholder="Toshkent, Yashnobod 12-uy"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="roommate_count">Hamxonalar soni</Label>
            <Input
              id="roommate_count"
              type="number"
              min={0}
              value={roommateCount}
              onChange={(e) => setRoommateCount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geolocation">Geolokatsiya</Label>
            <Input
              id="geolocation"
              value={geolocation}
              onChange={(e) => setGeolocation(e.target.value)}
              placeholder="41.31,69.27"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment">Izoh</Label>
          <Textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tashrif natijasi, talaba bilan suhbat..."
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" disabled={mutation.isPending || !studentId}>
            {mutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
