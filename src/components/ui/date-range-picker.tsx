/**
 * Date Range Picker Component
 *
 * Modern date range picker with government-friendly styling
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
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2F80ED] pointer-events-none" />
        <Input
          type="date"
          value={formatDateForInput(date?.from)}
          onChange={handleFromChange}
          className="pl-10 border-[#E5E7EB] focus:border-[#2F80ED] focus:ring-[#2F80ED]"
          placeholder="Dan"
        />
      </div>
      <span className="text-[#6B7280] font-medium">—</span>
      <div className="flex-1">
        <Input
          type="date"
          value={formatDateForInput(date?.to)}
          onChange={handleToChange}
          disabled={!date?.from}
          className="border-[#E5E7EB] focus:border-[#2F80ED] focus:ring-[#2F80ED] disabled:bg-gray-50 disabled:text-[#6B7280]"
          placeholder="Gacha"
        />
      </div>
    </div>
  )
}
