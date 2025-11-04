/**
 * Date Range Picker Component
 *
 * Simplified date range picker using native inputs
 * Easy to use for filtering by date ranges
 */

import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({
  date,
  setDate,
  className,
}: DatePickerWithRangeProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      setDate({
        from: new Date(value),
        to: date?.to,
      })
    } else {
      setDate(undefined)
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value && date?.from) {
      setDate({
        from: date.from,
        to: new Date(value),
      })
    }
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1">
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="date"
          value={formatDateForInput(date?.from)}
          onChange={handleFromChange}
          className="pl-10"
          placeholder="Dan"
        />
      </div>
      <span className="text-muted-foreground">-</span>
      <div className="flex-1">
        <Input
          type="date"
          value={formatDateForInput(date?.to)}
          onChange={handleToChange}
          disabled={!date?.from}
          placeholder="Gacha"
        />
      </div>
    </div>
  )
}
