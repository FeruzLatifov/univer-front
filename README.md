# HEMIS React Frontend

**HEMIS** - Higher Education Management Information System uchun zamonaviy React frontend.

Bu loyiha React 19, TypeScript, Vite va Tailwind CSS dan foydalanadi. Shuning uchun kodni yozishda zamonaviy JavaScript/TypeScript imkoniyatlaridan foydalaning.

#### Happy coding!

---

## 📋 Talablar

- **Node.js**: 20.19.0+ yoki 22.12.0+
- **Yarn**: 4.10.3+ (package manager)
- **Backend API**: univer-back (Laravel backend ishlab turishi kerak)

---

## 🚀 O'rnatish

### 1. Loyihani yuklab olish

```bash
git clone <repository-url>
cd univer-front
```

### 2. Dependencies o'rnatish

```bash
yarn install
```

### 3. Environment sozlash

`.env` faylni yarating:

```bash
cp .env.example .env
```

`.env` faylda backend API manzilini to'ldiring:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_VERSION=1.0.0
```

### 4. Development server ishga tushirish

```bash
yarn dev
```

Server ishga tushadi: `http://localhost:5173`

---

## 📁 Loyiha Strukturasi

```
src/
    assets/          Images, fonts, static files
    components/
        ui/          Shadcn UI components
        common/      Reusable components
    features/        Feature-based modules
        auth/        Authentication
        dashboard/   Dashboard
    hooks/           Custom React hooks
    lib/             Utilities, helpers
    pages/           Page components
    routes/          Route configuration
    services/        API services
    stores/          Zustand state management
    types/           TypeScript types
    locales/         i18n translation files
public/              Public static assets
```

---

## 🔧 Asosiy Commandlar

### Development

```bash
# Development server
yarn dev

# Development server (boshqa port)
yarn dev --port 3000

# Type checking
yarn type-check
```

### Build

```bash
# Production build
yarn build

# Preview production build
yarn preview
```

### Code Quality

```bash
# ESLint
yarn lint

# TypeScript check
yarn type-check
```

### Testing

```bash
# Run tests
yarn test

# Tests with UI
yarn test:ui

# Test coverage
yarn test:coverage
```

---

## 🎨 UI Components

Loyiha **Shadcn UI** dan foydalanadi - zamonaviy, accessible va customizable komponentlar:

- Radix UI (headless components)
- Tailwind CSS (styling)
- Lucide React (icons)
- React Hook Form (forms)
- Zod (validation)

**Yangi komponent qo'shish**:
```bash
npx shadcn@latest add button
```

---

## 🔑 Authentication

Frontend backend JWT authentication bilan ishlaydi:

### Login

```typescript
// Login request
POST /api/auth/login
{
  "login": "admin@example.com",
  "password": "password"
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1...",
  "refresh_token": "eyJ0eXAiOiJKV1...",
  "user": { ... }
}
```

### Token Management

- Access token: `localStorage` da saqlanadi
- Refresh token: `localStorage` da saqlanadi
- Auto refresh: Access token 60 daqiqa, refresh token 30 kun

---

## 🌐 Localization (i18n)

Loyiha **react-i18next** dan foydalanadi:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('common.welcome')}</h1>;
}
```

**Qo'llab-quvvatlanadigan tillar**:
- Uzbek (Lotin) - `uz`
- Uzbek (Kiril) - `oz`
- Russian - `ru`
- English - `en`

**Tarjima qo'shish**:
- `src/locales/uz.json` - O'zbek
- `src/locales/ru.json` - Rus
- `src/locales/en.json` - Ingliz

---

## 📊 State Management

Loyiha **Zustand** dan foydalanadi - minimal, fast va simple state management:

```typescript
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**Server state**: TanStack Query (data fetching va caching)

---

## 🔄 Git Workflow

### Loyihani yangilash

```bash
# Git'dan yangilanishlarni olish
git pull

# Dependencies yangilash (agar kerak bo'lsa)
yarn install

# Dev server qayta ishga tushirish
yarn dev
```

---

## ❓ Tez-tez so'raladigan savollar (FAQ)

### Q: Backend API ishlamayapti, frontend ishlaydimi?

**A**: YO'Q. Frontend backendga bog'liq. Avval backend ishga tushirish kerak:
```bash
cd /home/adm1n/univer/univer-back
php artisan serve
```

### Q: Port 5173 band bo'lsa?

**A**: Boshqa portda ishga tushiring:
```bash
yarn dev --port 3000
# yoki
yarn dev --port 8080
```

### Q: Build xatolik bersa?

**A**:
```bash
# 1. Node modules tozalash
rm -rf node_modules
yarn install

# 2. Type check
yarn type-check

# 3. Build qayta
yarn build
```

---

## 🐛 Muammolarni hal qilish (Troubleshooting)

### Yarn install xatolik bersa

```bash
# 1. Yarn versiyasini tekshirish
yarn --version
# Kutilgan: 4.10.3+

# 2. Cache tozalash
yarn cache clean

# 3. Qayta o'rnatish
rm -rf node_modules
yarn install
```

### API connection xatoligi

```bash
# 1. .env faylni tekshiring
cat .env | grep VITE_API_URL
# Kutilgan: http://127.0.0.1:8000/api

# 2. Backend ishlab turganini tekshiring
curl http://127.0.0.1:8000/api/health

# 3. CORS xatoligini tekshiring
# Backend .env da:
# CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### TypeScript xatoligi

```bash
# Type check
yarn type-check

# ESLint
yarn lint

# Fix auto-fixable issues
yarn lint --fix
```

---

## 🏗️ Build va Deploy

### Production Build

```bash
# Build yaratish
yarn build

# Build natijasi: dist/ papkada

# Preview (test)
yarn preview
```

### Build fayllari

```
dist/
  assets/
    index-[hash].js      Compiled JavaScript
    index-[hash].css     Compiled CSS
  index.html             Entry point
```

### Static Hosting

Build fayllarini har qanday static hosting'ga deploy qilish mumkin:

- Nginx
- Apache
- Vercel
- Netlify
- GitHub Pages

**Nginx config example**:

```nginx
server {
    listen 80;
    server_name student.univer.uz;

    root /var/www/univer-front/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📦 Asosiy Dependencies

### Main Dependencies

- **React 19**: UI library
- **TypeScript 5.9**: Type safety
- **Vite 7**: Build tool
- **React Router 7**: Routing
- **TanStack Query 5**: Data fetching
- **Axios 1**: HTTP client
- **Zustand 5**: State management
- **React Hook Form 7**: Form handling
- **Zod 4**: Schema validation
- **i18next 23**: Internationalization
- **Tailwind CSS 4**: Styling
- **Shadcn UI**: Component library

### Dev Dependencies

- **Vitest**: Testing framework
- **TypeScript ESLint**: Linting
- **Autoprefixer**: CSS post-processing

---

## 📞 Support

**Backend API**: `http://127.0.0.1:8000`
**Frontend Dev**: `http://localhost:5173`

---

**Versiya**: 1.0.0
**React**: 19.2.0
**Node.js**: 20.19.0+ yoki 22.12.0+
**Package Manager**: Yarn 4.10.3
**Status**: ✅ Production Ready

**Last Updated**: January 9, 2025
