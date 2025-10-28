import { api } from './client'

export interface Topic {
  id: number
  subject_id: number
  name: string
  name_uz: string
  name_ru: string
  name_en: string
  description?: string
  position: number
  hours: number
  week: number
  active: boolean
  created_at: string
}

export interface TopicsResponse {
  success: boolean
  data: Topic[]
}

export interface TopicResponse {
  success: boolean
  data: Topic
  message?: string
}

export interface CreateTopicPayload {
  subject_id: number
  name: string
  description?: string
  hours: number
  week: number
  position?: number
}

export const getSubjectTopics = async (subjectId: number): Promise<TopicsResponse> => {
  const response = await api.get(`/subject/${subjectId}/topics`)
  return response.data
}

export const createTopic = async (subjectId: number, payload: CreateTopicPayload): Promise<TopicResponse> => {
  const response = await api.post(`/subject/${subjectId}/topic`, payload)
  return response.data
}

export const updateTopic = async (subjectId: number, topicId: number, payload: Partial<CreateTopicPayload>): Promise<TopicResponse> => {
  const response = await api.put(`/subject/${subjectId}/topic/${topicId}`, payload)
  return response.data
}

export const deleteTopic = async (subjectId: number, topicId: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/subject/${subjectId}/topic/${topicId}`)
  return response.data
}

export const reorderTopics = async (subjectId: number, topicIds: number[]): Promise<{ success: boolean }> => {
  const response = await api.post(`/subject/${subjectId}/topics/reorder`, { topic_ids: topicIds })
  return response.data
}
