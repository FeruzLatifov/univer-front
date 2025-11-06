# ⚛️ Univer Frontend - React Application

Modern frontend for Univer University Management System built with React 19 + TypeScript + Vite.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Setup environment
cp .env.example .env

# Start development server
yarn dev
# Open http://localhost:5173
```

## 🛠 Tech Stack

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **React Router 7** - Routing
- **React Hook Form + Zod** - Forms & validation
- **react-i18next** - Internationalization
- **Sentry** - Error tracking

## 🗂 Project Structure

```
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── ErrorBoundary.tsx  # Error handling
│   └── LanguageSwitcher.tsx  # Language selector
├── pages/
│   ├── student/           # Student portal pages
│   ├── teacher/           # Teacher portal pages
│   ├── auth/              # Authentication pages
│   ├── system/            # System pages
│   └── ...
├── lib/
│   ├── api/
│   │   └── client.ts      # Axios client with interceptors
│   └── utils.ts
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── locales/               # i18n translation files
│   ├── uz.json           # Uzbek translations
│   ├── ru.json           # Russian translations
│   └── en.json           # English translations
├── i18n.ts               # i18n configuration
├── App.tsx
└── main.tsx
```

## 🌐 Multi-Language

The app supports 3 languages with **react-i18next**:

- **Uzbek** (uz) - Default
- **Russian** (ru)
- **English** (en)

### Usage

```tsx
import { useTranslation } from 'react-i18next'

function Component() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('ru')}>
        Русский
      </button>
    </div>
  )
}
```

### Adding Translations

Edit translation files in `src/locales/`:
- `uz.json` - Uzbek
- `ru.json` - Russian
- `en.json` - English

## 🔌 API Integration

API client is configured in `src/lib/api/client.ts`

**Features:**
- Automatic JWT token injection
- Token refresh mechanism
- Language parameter injection (`?l=ru-RU`)
- Response unwrapping (Laravel format)
- Error handling

**Usage:**
```tsx
import { api } from '@/lib/api/client'

// GET request
const response = await api.get('/v1/student/profile')
// Actual: GET /v1/student/profile?l=uz-UZ

// POST request
const response = await api.post('/v1/student/auth/login', {
  student_id: '123456',
  password: 'password'
})
```

## 🎨 UI Components

Using **shadcn/ui** components built on Radix UI + Tailwind CSS.

**Available components:**
- Button, Input, Select
- Dialog, Sheet, Popover
- Table, Card, Tabs
- Toast, Alert, Badge
- And more...

**Add new component:**
```bash
npx shadcn@latest add button
```

## 🔐 Authentication

**Routes:**
- `/login` - Login page
- `/student/*` - Student portal (protected)
- `/teacher/*` - Teacher portal (protected)
- `/admin/*` - Admin panel (protected)

**Protected routes** automatically redirect to login if not authenticated.

## 📊 State Management

**Global state:** Zustand stores in `src/stores/`

**Server state:** TanStack Query

**Example store:**
```typescript
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

## 🧪 Development

```bash
# Start dev server
yarn dev

# Type check
yarn type-check

# Lint
yarn lint

# Build for production
yarn build

# Preview production build
yarn preview

# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Generate coverage report
yarn test:coverage
```

## 🔐 Security

This project implements comprehensive security measures:

- **XSS Protection** - DOMPurify sanitization for user-generated content
- **Secure Logging** - Environment-aware logging system
- **CSP Headers** - Content Security Policy implementation
- **Automated Tests** - 40+ security tests
- **CodeQL Scanning** - Zero vulnerabilities

**Security Rating:** ⭐⭐⭐⭐⚪ (4/5)

For detailed security documentation, see [docs/security/](./docs/security/).

## 🧪 Testing

**Test Framework:** Vitest with jsdom

**Test Coverage:**
- Unit tests for security utilities (sanitize, logger)
- 40 automated tests
- Coverage reporting with v8

```bash
yarn test           # Run tests in watch mode
yarn test:run       # Run tests once
yarn test:ui        # Run with UI
yarn test:coverage  # Generate coverage report
```

## 🚀 Production Build

```bash
# Build
yarn build

# Output in dist/
# Upload to your hosting
```

### Environment Variables

```env
# API URL
VITE_API_URL=http://localhost:8000/api

# Sentry (optional)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=production

# App version
VITE_APP_VERSION=1.0.0
```

## 📱 Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Built with Tailwind CSS
- **Error Tracking** - Sentry integration
- **Performance Monitoring** - React Query DevTools
- **Type Safety** - Full TypeScript coverage
- **Code Splitting** - Automatic with Vite
- **Hot Module Replacement** - Fast development

## 🔗 Links

- [Documentation](./docs/) - Project documentation
- [Security Documentation](./docs/security/) - Security analysis and guides
- [Frontend Development Plan](./FRONTEND_DEVELOPMENT_PLAN.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)

## 📦 Package Manager

This project uses **Yarn 4** (Berry).

**Important:** Use `yarn` instead of `npm`:
```bash
yarn install    # NOT npm install
yarn add pkg    # NOT npm install pkg
yarn dev        # NOT npm run dev
```
