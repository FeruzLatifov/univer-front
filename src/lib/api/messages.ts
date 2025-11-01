import { api } from './client'

export interface Message {
  id: number
  sender_id: number
  sender_type: string
  receiver_id?: number
  receiver_type?: string
  subject: string
  body: string
  message_type: 'direct' | 'broadcast' | 'announcement'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_read: boolean
  has_attachments: boolean
  created_at: string
  read_at?: string
  sender?: any
  receiver?: any
  recipients?: any[]
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
}

export interface SendMessageData {
  receiver_id?: number
  receiver_type?: string
  recipients?: Array<{ id: number; type: string }>
  subject: string
  body: string
  message_type: 'direct' | 'broadcast' | 'announcement'
  priority?: string
  parent_message_id?: number
  attachments?: File[]
}

// Get inbox messages
export const getInboxMessages = async (params?: {
  page?: number
  per_page?: number
  is_read?: boolean
  search?: string
}) => {
  const response = await api.get('/v1/messages/inbox', { params })
  return response.data
}

// Get sent messages
export const getSentMessages = async (params?: {
  page?: number
  per_page?: number
}) => {
  const response = await api.get('/v1/messages/sent', { params })
  return response.data
}

// Get single message
export const getMessage = async (id: number) => {
  const response = await api.get(`/v1/messages/${id}`)
  return response.data
}

// Send message
export const sendMessage = async (data: SendMessageData) => {
  const formData = new FormData()

  // Append basic fields
  if (data.receiver_id) formData.append('receiver_id', data.receiver_id.toString())
  if (data.receiver_type) formData.append('receiver_type', data.receiver_type)

  if (data.recipients) {
    data.recipients.forEach((recipient, index) => {
      formData.append(`recipients[${index}][id]`, recipient.id.toString())
      formData.append(`recipients[${index}][type]`, recipient.type)
    })
  }

  formData.append('subject', data.subject)
  formData.append('body', data.body)
  formData.append('message_type', data.message_type)

  if (data.priority) formData.append('priority', data.priority)
  if (data.parent_message_id) formData.append('parent_message_id', data.parent_message_id.toString())

  // Append attachments
  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }

  const response = await api.post('/v1/messages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Reply to message
export const replyToMessage = async (id: number, data: {
  body: string
  attachments?: File[]
}) => {
  const formData = new FormData()
  formData.append('body', data.body)

  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }

  const response = await api.post(`/v1/messages/${id}/reply`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Mark as read
export const markMessageAsRead = async (id: number) => {
  const response = await api.post(`/v1/messages/${id}/mark-read`)
  return response.data
}

// Mark as unread
export const markMessageAsUnread = async (id: number) => {
  const response = await api.post(`/v1/messages/${id}/mark-unread`)
  return response.data
}

// Mark all as read
export const markAllMessagesAsRead = async () => {
  const response = await api.post('/v1/messages/mark-all-read')
  return response.data
}

// Archive message
export const archiveMessage = async (id: number) => {
  const response = await api.post(`/v1/messages/${id}/archive`)
  return response.data
}

// Star message
export const starMessage = async (id: number) => {
  const response = await api.post(`/v1/messages/${id}/star`)
  return response.data
}

// Unstar message
export const unstarMessage = async (id: number) => {
  const response = await api.post(`/v1/messages/${id}/unstar`)
  return response.data
}

// Delete message
export const deleteMessage = async (id: number) => {
  const response = await api.delete(`/v1/messages/${id}`)
  return response.data
}

// Get unread count
export const getUnreadCount = async () => {
  const response = await api.get('/v1/messages/unread-count')
  return response.data
}

// Search users
export const searchUsers = async (params: {
  search: string
  type?: 'student' | 'teacher'
}) => {
  const response = await api.get('/v1/messages/search-users', { params })
  return response.data
}

// Download attachment
export const downloadAttachment = async (id: number) => {
  const response = await api.get(`/v1/messages/attachments/${id}/download`, {
    responseType: 'blob',
  })

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'attachment')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
