import { api } from './client';
import { buildAttachmentUrl } from '@/config/api';

// ==================== TYPES ====================

export interface Message {
  id: number;
  sender_id: number;
  sender_type: 'teacher' | 'student' | 'admin';
  receiver_id?: number;
  receiver_type?: 'teacher' | 'student' | 'admin';
  subject: string;
  body: string;
  message_type: 'direct' | 'broadcast' | 'announcement';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  read_at?: string;
  has_attachments: boolean;
  parent_message_id?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relationships
  sender?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  receiver?: {
    id: number;
    firstname: string;
    lastname: string;
  };
  recipients?: MessageRecipient[];
  attachments?: MessageAttachment[];
  replies?: Message[];
}

export interface MessageRecipient {
  id: number;
  message_id: number;
  recipient_id: number;
  recipient_type: 'teacher' | 'student' | 'admin';
  is_read: boolean;
  read_at?: string;
  is_archived: boolean;
  is_starred: boolean;
  created_at: string;
}

export interface MessageAttachment {
  id: number;
  message_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  url?: string;
  download_url?: string;
  formatted_size?: string;
  icon?: string;
}

export interface PaginatedMessages {
  data: Message[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface MessageFilters {
  page?: number;
  per_page?: number;
  is_read?: boolean;
  message_type?: 'direct' | 'broadcast' | 'announcement';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  has_attachments?: boolean;
  search?: string;
}

export interface SendMessageData {
  receiver_id?: number;
  receiver_type?: 'teacher' | 'student' | 'admin';
  recipients?: Array<{ id: number; type: string }>;
  subject: string;
  body: string;
  message_type: 'direct' | 'broadcast' | 'announcement';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  parent_message_id?: number;
  attachments?: File[];
}

export interface UnreadCount {
  direct: number;
  broadcast: number;
  total: number;
}

// ==================== API FUNCTIONS ====================

/**
 * Get inbox messages
 */
export async function getInbox(filters?: MessageFilters): Promise<PaginatedMessages> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }

  const response = await api.get(`/messages/inbox?${params.toString()}`);
  return response.data.data;
}

/**
 * Get sent messages
 */
export async function getSentMessages(page = 1, perPage = 15): Promise<PaginatedMessages> {
  const response = await api.get(`/messages/sent?page=${page}&per_page=${perPage}`);
  return response.data.data;
}

/**
 * Get single message
 */
export async function getMessage(id: number): Promise<Message> {
  const response = await api.get(`/messages/${id}`);
  return response.data.data;
}

/**
 * Send a message
 */
export async function sendMessage(data: SendMessageData): Promise<Message> {
  // If attachments, use FormData
  if (data.attachments && data.attachments.length > 0) {
    const formData = new FormData();

    // Add basic fields
    if (data.receiver_id) formData.append('receiver_id', String(data.receiver_id));
    if (data.receiver_type) formData.append('receiver_type', data.receiver_type);
    if (data.recipients) formData.append('recipients', JSON.stringify(data.recipients));
    formData.append('subject', data.subject);
    formData.append('body', data.body);
    formData.append('message_type', data.message_type);
    if (data.priority) formData.append('priority', data.priority);
    if (data.parent_message_id) formData.append('parent_message_id', String(data.parent_message_id));

    // Add attachments
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const response = await api.post('/messages/send', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Otherwise, use JSON
  const response = await api.post('/messages/send', data);
  return response.data.data;
}

/**
 * Mark message as read
 */
export async function markAsRead(id: number): Promise<void> {
  await api.put(`/messages/${id}/read`);
}

/**
 * Mark message as unread
 */
export async function markAsUnread(id: number): Promise<void> {
  await api.put(`/messages/${id}/unread`);
}

/**
 * Archive message
 */
export async function archiveMessage(id: number): Promise<void> {
  await api.put(`/messages/${id}/archive`);
}

/**
 * Star message
 */
export async function starMessage(id: number): Promise<void> {
  await api.put(`/messages/${id}/star`);
}

/**
 * Unstar message
 */
export async function unstarMessage(id: number): Promise<void> {
  await api.put(`/messages/${id}/unstar`);
}

/**
 * Delete message
 */
export async function deleteMessage(id: number): Promise<void> {
  await api.delete(`/messages/${id}`);
}

/**
 * Get unread message count
 */
export async function getUnreadCount(): Promise<UnreadCount> {
  const response = await api.get('/messages/unread-count');
  return response.data.data;
}

/**
 * Download attachment
 */
export function getAttachmentDownloadUrl(attachmentId: number): string {
  return buildAttachmentUrl(attachmentId);
}
