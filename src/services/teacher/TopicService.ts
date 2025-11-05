import { BaseApiService } from '../base/BaseApiService'

// ==================== TYPES ====================

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

export interface CreateTopicPayload {
  subject_id: number
  name: string
  description?: string
  hours: number
  week: number
  position?: number
}

// ==================== SERVICE ====================

/**
 * Teacher Topic Service
 * Manages subject topics and curriculum
 */
export class TopicService extends BaseApiService {
  constructor() {
    super('/v1/teacher/subjects')
  }

  /**
   * Get all topics for a subject
   */
  async getSubjectTopics(subjectId: number) {
    return this.get<Topic[]>(`/${subjectId}/topics`)
  }

  /**
   * Create new topic for a subject
   */
  async createTopic(subjectId: number, payload: CreateTopicPayload) {
    return this.post<Topic>(`/${subjectId}/topics`, payload)
  }

  /**
   * Update topic
   */
  async updateTopic(subjectId: number, topicId: number, payload: Partial<CreateTopicPayload>) {
    return this.put<Topic>(`/${subjectId}/topics/${topicId}`, payload)
  }

  /**
   * Delete topic
   */
  async deleteTopic(subjectId: number, topicId: number) {
    return this.delete(`/${subjectId}/topics/${topicId}`)
  }

  /**
   * Reorder topics
   */
  async reorderTopics(subjectId: number, topicIds: number[]) {
    return this.post(`/${subjectId}/topics/reorder`, { topic_ids: topicIds })
  }

  /**
   * Get syllabus overview
   */
  async getSyllabus(subjectId: number) {
    return this.get(`/${subjectId}/syllabus`)
  }
}

// Export singleton instance
export const teacherTopicService = new TopicService()
