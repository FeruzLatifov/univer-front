import { api } from './client';

// ==================== TYPES ====================

export interface Notification {
  id: number;
  user_id: number;
  user_type: 'teacher' | 'student' | 'admin';
  type: NotificationType;
  title: string;
  message: string;
  entity_type?: 'assignment' | 'test' | 'grade' | 'attendance';
  entity_id?: number;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  read_at?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sent_via_email: boolean;
  sent_via_push: boolean;
  email_sent_at?: string;
  push_sent_at?: string;
  created_at: string;
  expires_at?: string;

  // Computed attributes
  icon?: string;
  priority_label?: string;
  priority_color?: string;
  time_ago?: string;
}

export type NotificationType =
  | 'assignment_due'
  | 'assignment_graded'
  | 'assignment_posted'
  | 'assignment_submitted'
  | 'test_available'
  | 'test_ending_soon'
  | 'test_graded'
  | 'grade_posted'
  | 'grade_updated'
  | 'attendance_marked'
  | 'attendance_warning'
  | 'announcement'
  | 'message_received'
  | 'comment_posted';

export interface NotificationSettings {
  id: number;
  user_id: number;
  user_type: 'teacher' | 'student' | 'admin';
  notification_type: NotificationType;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface NotificationFilters {
  page?: number;
  per_page?: number;
  is_read?: boolean;
  type?: NotificationType;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  high_priority?: boolean;
  recent?: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  today: number;
  recent: number;
  urgent: number;
  by_type: Record<string, number>;
}

export interface UpdateSettingsData {
  settings: Array<{
    notification_type: NotificationType;
    email_enabled?: boolean;
    push_enabled?: boolean;
    sms_enabled?: boolean;
    in_app_enabled?: boolean;
  }>;
}

// ==================== API FUNCTIONS ====================

/**
 * Get all notifications
 */
export async function getNotifications(
  filters?: NotificationFilters
): Promise<PaginatedNotifications> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }

  const response = await api.get(`/notifications?${params.toString()}`);
  return response.data.data;
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(
  page = 1,
  perPage = 20
): Promise<PaginatedNotifications> {
  const response = await api.get(`/notifications/unread?page=${page}&per_page=${perPage}`);
  return response.data.data;
}

/**
 * Get recent notifications (last 7 days, limit 10)
 */
export async function getRecentNotifications(): Promise<Notification[]> {
  const response = await api.get('/notifications/recent');
  return response.data.data;
}

/**
 * Get single notification
 */
export async function getNotification(id: number): Promise<Notification> {
  const response = await api.get(`/notifications/${id}`);
  return response.data.data;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: number): Promise<void> {
  await api.put(`/notifications/${id}/read`);
}

/**
 * Mark notification as unread
 */
export async function markNotificationAsUnread(id: number): Promise<void> {
  await api.put(`/notifications/${id}/unread`);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{ count: number }> {
  const response = await api.put('/notifications/mark-all-read');
  return { count: response.data.count };
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const response = await api.get('/notifications/unread-count');
  return response.data.data.count;
}

/**
 * Get notification statistics
 */
export async function getNotificationStats(): Promise<NotificationStats> {
  const response = await api.get('/notifications/stats');
  return response.data.data;
}

// ==================== SETTINGS ====================

/**
 * Get notification settings
 */
export async function getNotificationSettings(): Promise<NotificationSettings[]> {
  const response = await api.get('/notifications/settings/all');
  return response.data.data;
}

/**
 * Update multiple notification settings
 */
export async function updateNotificationSettings(data: UpdateSettingsData): Promise<void> {
  await api.put('/notifications/settings/bulk', data);
}

/**
 * Update single notification setting
 */
export async function updateNotificationSetting(
  type: NotificationType,
  data: {
    email_enabled?: boolean;
    push_enabled?: boolean;
    sms_enabled?: boolean;
    in_app_enabled?: boolean;
  }
): Promise<NotificationSettings> {
  const response = await api.put(`/notifications/settings/${type}`, data);
  return response.data.data;
}

/**
 * Enable all notification channels for a type
 */
export async function enableAllChannels(type: NotificationType): Promise<void> {
  await api.put(`/notifications/settings/${type}/enable-all`);
}

/**
 * Disable all notification channels for a type
 */
export async function disableAllChannels(type: NotificationType): Promise<void> {
  await api.put(`/notifications/settings/${type}/disable-all`);
}

/**
 * Reset notification settings to default
 */
export async function resetNotificationSettings(): Promise<void> {
  await api.post('/notifications/settings/reset');
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get notification icon name
 */
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    assignment_due: 'clock',
    assignment_graded: 'check-circle',
    assignment_posted: 'file-text',
    assignment_submitted: 'upload',
    test_available: 'clipboard',
    test_ending_soon: 'alert-circle',
    test_graded: 'award',
    grade_posted: 'star',
    grade_updated: 'edit',
    attendance_marked: 'check',
    attendance_warning: 'alert-triangle',
    announcement: 'megaphone',
    message_received: 'mail',
    comment_posted: 'message-circle',
  };

  return icons[type] || 'bell';
}

/**
 * Get notification type label
 */
export function getNotificationTypeLabel(type: NotificationType): string {
  const labels: Record<NotificationType, string> = {
    assignment_due: 'Topshiriq muddati',
    assignment_graded: 'Topshiriq baholandi',
    assignment_posted: 'Yangi topshiriq',
    assignment_submitted: 'Topshiriq topshirildi',
    test_available: 'Test ochildi',
    test_ending_soon: 'Test tugash vaqti yaqin',
    test_graded: 'Test baholandi',
    grade_posted: 'Yangi baho',
    grade_updated: 'Baho o\'zgartirildi',
    attendance_marked: 'Davomat belgilandi',
    attendance_warning: 'Davomat ogohlantiruvi',
    announcement: 'E\'lon',
    message_received: 'Yangi xabar',
    comment_posted: 'Yangi izoh',
  };

  return labels[type] || type;
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-gray-500',
    normal: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  return colors[priority] || colors.normal;
}
