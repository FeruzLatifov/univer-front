import React from 'react'
import * as Sentry from '@sentry/react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  eventId?: string
}

function ErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
  const isDevelopment = import.meta.env.DEV

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="text-2xl">Xatolik yuz berdi</CardTitle>
              <CardDescription>
                Kechirasiz, kutilmagan xatolik yuz berdi. Ushbu xatolik avtomatik ravishda qayd qilindi.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error details in development */}
          {isDevelopment && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="font-semibold text-sm mb-2">Xatolik tafsilotlari (faqat development):</p>
              <pre className="text-xs overflow-auto max-h-40 bg-black/5 p-2 rounded">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </div>
          )}

          {/* Event ID for support */}
          {eventId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Xatolik ID:</strong> {eventId}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Agar muammo takrorlansa, ushbu ID ni texnik yordam xizmatiga yuboring.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={resetError}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Qayta urinib ko'rish
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              className="flex-1"
              variant="outline"
            >
              <Home className="mr-2 h-4 w-4" />
              Bosh sahifaga qaytish
            </Button>
          </div>

          {/* Report feedback */}
          {eventId && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Xatolik haqida ma'lumot avtomatik yuborildi.
                Tez orada muammoni hal qilamiz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Create Sentry Error Boundary with custom fallback
export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: (errorData) => <ErrorFallback {...errorData} />,
    showDialog: false, // We have our own UI, don't show Sentry dialog
    onError: (error, errorInfo, eventId) => {
      // Additional error logging if needed
      console.error('Error caught by boundary:', error, errorInfo, eventId)
    },
  }
)

// Export default for convenience
export default SentryErrorBoundary
