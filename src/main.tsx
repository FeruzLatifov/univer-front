import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { SentryErrorBoundary } from './components/ErrorBoundary'
import './i18n' // i18n ni initsializatsiya qilish

// Initialize Sentry
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    integrations: [
      // Browser Tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      // Replay for session recording
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      // React Router integration
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.2'),

    // Session Replay (captures user sessions for debugging)
    replaysSessionSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1'),
    replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0'),

    // Release tracking
    release: import.meta.env.VITE_APP_VERSION,

    // Don't send errors in development
    enabled: import.meta.env.PROD,

    // Before send hook - filter out unwanted errors
    beforeSend(event, hint) {
      // Don't send 404 errors to Sentry
      if (hint.originalException instanceof Error) {
        if (hint.originalException.message.includes('404')) {
          return null
        }
      }
      return event
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Network errors
      'NetworkError',
      'Network request failed',
      // Chunk load errors (user on old version)
      'ChunkLoadError',
      'Loading chunk',
    ],
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={3000}
          />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SentryErrorBoundary>
  </React.StrictMode>,
)

