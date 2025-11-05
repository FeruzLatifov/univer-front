import {
  getCategories,
  getCategory,
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  createPost,
  updatePost,
  deletePost,
  toggleTopicLike,
  togglePostLike,
  subscribeToTopic,
  unsubscribeFromTopic,
  type ForumCategory,
  type ForumTopic,
  type ForumPost,
  type PaginatedTopics,
  type TopicFilters,
  type CreateTopicData,
  type CreatePostData,
} from '@/lib/api/forum';

/**
 * Teacher Forum Service
 * Handles all forum operations for teachers
 */
class ForumService {
  // ==================== CATEGORIES ====================

  /**
   * Get all forum categories
   */
  async getCategories(): Promise<ForumCategory[]> {
    return getCategories();
  }

  /**
   * Get single category by ID
   */
  async getCategory(id: number): Promise<ForumCategory> {
    return getCategory(id);
  }

  // ==================== TOPICS ====================

  /**
   * Get topics in a category
   */
  async getTopics(categoryId: number, filters?: TopicFilters): Promise<PaginatedTopics> {
    return getTopics(categoryId, filters);
  }

  /**
   * Get single topic by ID
   */
  async getTopic(id: number): Promise<ForumTopic> {
    return getTopic(id);
  }

  /**
   * Create a new topic
   */
  async createTopic(data: CreateTopicData): Promise<ForumTopic> {
    return createTopic(data);
  }

  /**
   * Update a topic
   */
  async updateTopic(id: number, data: Partial<CreateTopicData>): Promise<ForumTopic> {
    return updateTopic(id, data);
  }

  /**
   * Delete a topic
   */
  async deleteTopic(id: number): Promise<void> {
    return deleteTopic(id);
  }

  // ==================== POSTS ====================

  /**
   * Create a new post (reply)
   */
  async createReply(data: CreatePostData): Promise<ForumPost> {
    return createPost(data);
  }

  /**
   * Update a post
   */
  async updatePost(id: number, body: string): Promise<ForumPost> {
    return updatePost(id, body);
  }

  /**
   * Delete a post
   */
  async deletePost(id: number): Promise<void> {
    return deletePost(id);
  }

  // ==================== INTERACTIONS ====================

  /**
   * Toggle like on a topic
   */
  async toggleTopicLike(topicId: number): Promise<{ liked: boolean }> {
    return toggleTopicLike(topicId);
  }

  /**
   * Toggle like on a post
   */
  async togglePostLike(postId: number): Promise<{ liked: boolean }> {
    return togglePostLike(postId);
  }

  /**
   * Subscribe to topic notifications
   */
  async subscribeToTopic(topicId: number): Promise<void> {
    return subscribeToTopic(topicId);
  }

  /**
   * Unsubscribe from topic notifications
   */
  async unsubscribeFromTopic(topicId: number): Promise<void> {
    return unsubscribeFromTopic(topicId);
  }
}

export default new ForumService();

// Export types
export type {
  ForumCategory,
  ForumTopic,
  ForumPost,
  PaginatedTopics,
  TopicFilters,
  CreateTopicData,
  CreatePostData,
};
