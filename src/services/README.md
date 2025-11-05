# 📦 API Services Layer

**Clean Architecture Pattern** - Service layer for all API interactions, matching the Laravel backend pattern.

## 🏗️ Architecture

```
src/services/
├── base/
│   └── BaseApiService.ts          ← Base class with CRUD operations
│
├── teacher/                        ← Teacher module services
│   ├── DashboardService.ts
│   ├── ScheduleService.ts
│   ├── AttendanceService.ts
│   ├── GradeService.ts
│   └── index.ts
│
├── student/                        ← Student module services
│   ├── DashboardService.ts
│   ├── ProfileService.ts
│   ├── DocumentService.ts
│   └── index.ts
│
├── admin/                          ← Admin module services
│   ├── StudentService.ts
│   ├── DepartmentService.ts
│   ├── GroupService.ts
│   └── index.ts
│
├── shared/                         ← Shared/common services
│   ├── SystemService.ts
│   └── index.ts
│
└── index.ts                        ← Main export
```

---

## 🚀 Usage

### Basic Usage

```typescript
import { teacherDashboardService, studentProfileService } from '@/services'

// In React component
function TeacherDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const dashboardData = await teacherDashboardService.getDashboardData()
      setData(dashboardData)
    }
    fetchData()
  }, [])

  return <div>...</div>
}
```

### With React Query (Recommended)

```typescript
import { useQuery } from '@tanstack/react-query'
import { teacherDashboardService } from '@/services'

function TeacherDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher', 'dashboard'],
    queryFn: () => teacherDashboardService.getDashboardData()
  })

  if (isLoading) return <Loader />
  if (error) return <Error message={error.message} />

  return <DashboardView data={data} />
}
```

### With Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentProfileService } from '@/services'

function ProfileEditor() {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data) => studentProfileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['student', 'profile'])
      toast.success('Profile updated!')
    }
  })

  const handleSubmit = (data) => {
    updateMutation.mutate(data)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 📚 Available Services

### Teacher Services

```typescript
import {
  teacherDashboardService,
  teacherScheduleService,
  teacherAttendanceService,
  teacherGradeService
} from '@/services'

// Dashboard
const dashboard = await teacherDashboardService.getDashboardData()
const stats = await teacherDashboardService.getStatistics()

// Schedule
const schedule = await teacherScheduleService.getSchedule({ week: 1 })
const today = await teacherScheduleService.getTodaySchedule()

// Attendance
const attendance = await teacherAttendanceService.getAttendance(scheduleId)
await teacherAttendanceService.markAttendance({ schedule_id: 1, attendance: [...] })

// Grades
const grades = await teacherGradeService.getGrades({ lesson_id: 1 })
await teacherGradeService.createBulkGrades({ lesson_id: 1, grades: [...] })
```

### Student Services

```typescript
import {
  studentDashboardService,
  studentProfileService,
  studentDocumentService
} from '@/services'

// Dashboard
const dashboard = await studentDashboardService.getDashboardData()
const schedule = await studentDashboardService.getTodaySchedule()

// Profile
const profile = await studentProfileService.getProfile()
await studentProfileService.updateProfile({ phone: '...' })
await studentProfileService.uploadPhoto(file)

// Documents
const requests = await studentDocumentService.getDocumentRequests()
await studentDocumentService.requestDocument({ document_type: 'transcript' })
```

### Admin Services

```typescript
import {
  adminStudentService,
  adminDepartmentService,
  adminGroupService
} from '@/services'

// Students
const students = await adminStudentService.getStudents({ page: 1, per_page: 20 })
await adminStudentService.createStudent({ ... })
await adminStudentService.updateStudent(id, { ... })

// Departments
const departments = await adminDepartmentService.getDepartments()
const tree = await adminDepartmentService.getDepartmentTree()

// Groups
const groups = await adminGroupService.getGroups({ course: 1 })
await adminGroupService.createGroup({ ... })
```

### Shared Services

```typescript
import { systemService } from '@/services'

// System config
const config = await systemService.getLoginConfig()
const languages = await systemService.getLanguages()
```

---

## 🛠️ Creating Custom Services

### 1. Extend BaseApiService

```typescript
import { BaseApiService } from '../base/BaseApiService'

export class MyCustomService extends BaseApiService {
  constructor() {
    super('/v1/my-module/endpoint')  // Base path
  }

  async getItems() {
    return this.get()  // GET /v1/my-module/endpoint
  }

  async getItem(id: number) {
    return this.get(`/${id}`)  // GET /v1/my-module/endpoint/:id
  }

  async createItem(data: any) {
    return this.post('', data)  // POST /v1/my-module/endpoint
  }

  async updateItem(id: number, data: any) {
    return this.put(`/${id}`, data)  // PUT /v1/my-module/endpoint/:id
  }

  async deleteItem(id: number) {
    return this.delete(`/${id}`)  // DELETE /v1/my-module/endpoint/:id
  }
}

// Export singleton
export const myCustomService = new MyCustomService()
```

### 2. With Query Parameters

```typescript
export class MyService extends BaseApiService {
  async getFilteredItems(filters: {
    page?: number
    per_page?: number
    status?: string
  }) {
    const query = this.buildQueryString(filters)
    return this.get(query)  // GET /endpoint?page=1&per_page=20&status=active
  }
}
```

### 3. With File Upload

```typescript
export class MyService extends BaseApiService {
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return this.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
```

---

## 🎯 Benefits

### ✅ Type Safety
- Full TypeScript support
- Interface definitions for requests/responses
- Compile-time error checking

### ✅ Maintainability
- Centralized API logic
- Easy to test
- Single source of truth

### ✅ Consistency
- Matches backend service layer pattern
- Uniform error handling
- Standardized API calls

### ✅ Reusability
- Singleton pattern
- Base class for common operations
- DRY principle

---

## 🔧 Configuration

API configuration is centralized in `src/config/api.ts`:

```typescript
// Automatically uses VITE_API_URL from .env
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Helper functions available
import { buildApiUrl, buildStorageUrl, getApiOrigin } from '@/config/api'
```

---

## 📖 Best Practices

### 1. Always use services, never direct axios calls

❌ **BAD:**
```typescript
const response = await axios.get('/api/v1/teacher/dashboard')
```

✅ **GOOD:**
```typescript
const data = await teacherDashboardService.getDashboardData()
```

### 2. Use React Query for data fetching

```typescript
const { data } = useQuery({
  queryKey: ['teacher', 'dashboard'],
  queryFn: () => teacherDashboardService.getDashboardData()
})
```

### 3. Handle errors properly

```typescript
try {
  const data = await teacherDashboardService.getDashboardData()
} catch (error) {
  console.error('Failed to fetch dashboard:', error)
  toast.error(error.message)
}
```

### 4. Use TypeScript types

```typescript
import type { TeacherDashboardData } from '@/services'

const [data, setData] = useState<TeacherDashboardData | null>(null)
```

---

## 🆕 Migration Guide

### Migrating from Direct API Calls

**Before:**
```typescript
const response = await apiClient.get('/v1/teacher/dashboard')
const data = response.data
```

**After:**
```typescript
const data = await teacherDashboardService.getDashboardData()
```

---

## 📝 Notes

- All services use singleton pattern (one instance per service)
- Services automatically handle authentication (JWT tokens)
- API client includes token refresh logic
- All API responses are unwrapped from Laravel format `{success, data}`
- Services match backend 1:1 for consistency

---

**Created:** 2025-11-05
**Pattern:** Clean Architecture + Service Layer
**Backend Match:** ✅ 100% Compatible
