import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function TestListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>

              {/* Meta */}
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-28" />
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>

              {/* Dates */}
              <div className="flex gap-6 mt-4 pt-4 border-t">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
