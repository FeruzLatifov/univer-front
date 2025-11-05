/**
 * Teacher Notification Service
 *
 * Handles all teacher notification-related API calls.
 * Wraps notification API functions from @/lib/api/notifications.
 */

import {
  getNotifications as apiGetNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationSettings as apiGetSettings,
  updateNotificationSettings as apiUpdateSettings,
  type NotificationFilters,
  type PaginatedNotifications,
  type NotificationSettings,
  type UpdateSettingsData,
} from '@/lib/api/notifications'

/**
 * Teacher Notification Service
 */
export class TeacherNotificationService {
  /**
   * Get notifications with optional filters
   */
  async getNotifications(filters?: NotificationFilters): Promise<PaginatedNotifications> {
    return apiGetNotifications(filters)
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: number): Promise<void> {
    return markNotificationAsRead(id)
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ count: number }> {
    return markAllNotificationsAsRead()
  }

  /**
   * Get notification settings
   */
  async getSettings(): Promise<NotificationSettings[]> {
    return apiGetSettings()
  }

  /**
   * Update notification settings
   */
  async updateSettings(data: UpdateSettingsData): Promise<void> {
    return apiUpdateSettings(data)
  }
}

// Export singleton instance
export const teacherNotificationService = new TeacherNotificationService()
