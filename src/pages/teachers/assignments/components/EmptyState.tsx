import { FileQuestion } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = 'Topshiriqlar topilmadi',
  description = 'Hozircha birorta topshiriq yo\'q. Yangi topshiriq yarating.',
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full bg-muted p-6">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground max-w-sm">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </Card>
  )
}
