import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { teacherNotificationService } from '@/services/teacher/NotificationService'
import { getErrorMessage } from '@/lib/utils/error'
import type {
  NotificationFilters,
  NotificationSettings,
  UpdateSettingsData,
} from '@/lib/api/notifications'

/**
 * React Query hooks for Notification management
 *
 * Best practices:
 * - Use query keys for caching and invalidation
 * - Show toast notifications for mutations
 * - Handle errors gracefully
 * - Invalidate related queries after mutations
 */

// Query keys for better cache management
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
}

/**
 * Fetch notifications with filters
 */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => teacherNotificationService.getNotifications(filters),
    staleTime: 1000 * 60 * 1, // 1 minute (notifications change frequently)
  })
}

/**
 * Mark notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => teacherNotificationService.markAsRead(id),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Bildirishnomani o\'qilgan deb belgilashda xatolik'))
    },
  })
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => teacherNotificationService.markAllAsRead(),
    onSuccess: (data) => {
      toast.success(`${data.count} ta bildirishnoma o'qilgan deb belgilandi`)
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Bildirishnomalarni o\'qilgan deb belgilashda xatolik'))
    },
  })
}

/**
 * Fetch notification settings
 */
export function useNotificationSettings() {
  return useQuery<NotificationSettings[]>({
    queryKey: notificationKeys.settings(),
    queryFn: () => teacherNotificationService.getSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes (settings don't change often)
  })
}

/**
 * Update notification settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSettingsData) => teacherNotificationService.updateSettings(data),
    onSuccess: () => {
      toast.success('Sozlamalar saqlandi')
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() })
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Sozlamalarni saqlashda xatolik'))
    },
  })
}
