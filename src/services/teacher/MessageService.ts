import {
  getInbox,
  getSentMessages,
  getMessage,
  sendMessage,
  deleteMessage,
  markAsRead,
  markAsUnread,
  archiveMessage,
  starMessage,
  unstarMessage,
  getUnreadCount,
  type Message,
  type PaginatedMessages,
  type MessageFilters,
  type SendMessageData,
  type UnreadCount,
} from '@/lib/api/messaging';

/**
 * Teacher Message Service
 * Handles all messaging operations for teachers
 */
class MessageService {
  /**
   * Get inbox messages with filters
   */
  async getMessages(filters?: MessageFilters): Promise<PaginatedMessages> {
    return getInbox(filters);
  }

  /**
   * Get sent messages
   */
  async getSentMessages(page = 1, perPage = 15): Promise<PaginatedMessages> {
    return getSentMessages(page, perPage);
  }

  /**
   * Get single message by ID
   */
  async getMessage(id: number): Promise<Message> {
    return getMessage(id);
  }

  /**
   * Send a new message
   */
  async sendMessage(data: SendMessageData): Promise<Message> {
    return sendMessage(data);
  }

  /**
   * Delete a message
   */
  async deleteMessage(id: number): Promise<void> {
    return deleteMessage(id);
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: number): Promise<void> {
    return markAsRead(id);
  }

  /**
   * Mark message as unread
   */
  async markAsUnread(id: number): Promise<void> {
    return markAsUnread(id);
  }

  /**
   * Archive a message
   */
  async archiveMessage(id: number): Promise<void> {
    return archiveMessage(id);
  }

  /**
   * Star a message
   */
  async starMessage(id: number): Promise<void> {
    return starMessage(id);
  }

  /**
   * Unstar a message
   */
  async unstarMessage(id: number): Promise<void> {
    return unstarMessage(id);
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<UnreadCount> {
    return getUnreadCount();
  }
}

export default new MessageService();

// Export types
export type {
  Message,
  PaginatedMessages,
  MessageFilters,
  SendMessageData,
  UnreadCount,
};
