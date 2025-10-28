import { api } from './client';

// ==================== TYPES ====================

export interface ForumCategory {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  is_active: boolean;
  is_locked: boolean;
  requires_approval: boolean;
  allowed_user_types?: string[];
  topics_count: number;
  posts_count: number;
  latest_topic?: ForumTopic;
  created_at: string;
  updated_at: string;

  // Relationships
  parent?: ForumCategory;
  children?: ForumCategory[];
  _translations?: {
    uz?: { name: string; description?: string };
    ru?: { name: string; description?: string };
    en?: { name: string; description?: string };
  };
}

export interface ForumTopic {
  id: number;
  category_id: number;
  author_id: number;
  author_type: 'teacher' | 'student' | 'admin';
  title: string;
  slug: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_featured: boolean;
  is_approved: boolean;
  tags?: string[];
  views_count: number;
  posts_count: number;
  likes_count: number;
  best_answer_post_id?: number;
  last_post_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relationships
  category?: ForumCategory;
  author?: {
    id: number;
    firstname: string;
    lastname: string;
    avatar?: string;
  };
  posts?: ForumPost[];
  attachments?: ForumAttachment[];
  latest_post?: ForumPost;
  user_liked?: boolean;
  user_subscribed?: boolean;
  _translations?: {
    uz?: { title: string; body: string };
    ru?: { title: string; body: string };
    en?: { title: string; body: string };
  };
}

export interface ForumPost {
  id: number;
  topic_id: number;
  author_id: number;
  author_type: 'teacher' | 'student' | 'admin';
  parent_post_id?: number;
  body: string;
  is_approved: boolean;
  is_best_answer: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relationships
  topic?: ForumTopic;
  author?: {
    id: number;
    firstname: string;
    lastname: string;
    avatar?: string;
  };
  parent?: ForumPost;
  replies?: ForumPost[];
  attachments?: ForumAttachment[];
  user_liked?: boolean;
  _translations?: {
    uz?: { body: string };
    ru?: { body: string };
    en?: { body: string };
  };
}

export interface ForumAttachment {
  id: number;
  attachable_id: number;
  attachable_type: 'topic' | 'post';
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  url?: string;
  download_url?: string;
  formatted_size?: string;
}

export interface PaginatedCategories {
  data: ForumCategory[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedTopics {
  data: ForumTopic[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface TopicFilters {
  page?: number;
  per_page?: number;
  search?: string;
  tags?: string[];
  is_pinned?: boolean;
  is_featured?: boolean;
  sort_by?: 'latest' | 'popular' | 'most_viewed' | 'most_liked';
}

export interface CreateTopicData {
  category_id: number;
  title: string;
  body: string;
  tags?: string[];
  attachments?: File[];
}

export interface CreatePostData {
  topic_id: number;
  body: string;
  parent_post_id?: number;
  attachments?: File[];
}

// ==================== CATEGORIES ====================

/**
 * Get all forum categories
 */
export async function getCategories(): Promise<ForumCategory[]> {
  const response = await api.get('/forum/categories');
  return response.data.data;
}

/**
 * Get single category
 */
export async function getCategory(id: number): Promise<ForumCategory> {
  const response = await api.get(`/forum/categories/${id}`);
  return response.data.data;
}

// ==================== TOPICS ====================

/**
 * Get topics in a category
 */
export async function getTopics(
  categoryId: number,
  filters?: TopicFilters
): Promise<PaginatedTopics> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }

  const response = await api.get(
    `/forum/categories/${categoryId}/topics?${params.toString()}`
  );
  return response.data.data;
}

/**
 * Get single topic with posts
 */
export async function getTopic(id: number): Promise<ForumTopic> {
  const response = await api.get(`/forum/topics/${id}`);
  return response.data.data;
}

/**
 * Create new topic
 */
export async function createTopic(data: CreateTopicData): Promise<ForumTopic> {
  // If attachments, use FormData
  if (data.attachments && data.attachments.length > 0) {
    const formData = new FormData();

    formData.append('category_id', String(data.category_id));
    formData.append('title', data.title);
    formData.append('body', data.body);
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    // Add attachments
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const response = await api.post('/forum/topics', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Otherwise, use JSON
  const response = await api.post('/forum/topics', data);
  return response.data.data;
}

/**
 * Update topic
 */
export async function updateTopic(
  id: number,
  data: Partial<CreateTopicData>
): Promise<ForumTopic> {
  const response = await api.put(`/forum/topics/${id}`, data);
  return response.data.data;
}

/**
 * Delete topic
 */
export async function deleteTopic(id: number): Promise<void> {
  await api.delete(`/forum/topics/${id}`);
}

// ==================== POSTS ====================

/**
 * Create new post (reply)
 */
export async function createPost(data: CreatePostData): Promise<ForumPost> {
  const { topic_id, ...postData } = data;

  // If attachments, use FormData
  if (data.attachments && data.attachments.length > 0) {
    const formData = new FormData();

    formData.append('body', postData.body);
    if (postData.parent_post_id) {
      formData.append('parent_post_id', String(postData.parent_post_id));
    }

    // Add attachments
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const response = await api.post(`/forum/topics/${topic_id}/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Otherwise, use JSON
  const response = await api.post(`/forum/topics/${topic_id}/posts`, postData);
  return response.data.data;
}

/**
 * Update post
 */
export async function updatePost(
  id: number,
  body: string
): Promise<ForumPost> {
  const response = await api.put(`/forum/posts/${id}`, { body });
  return response.data.data;
}

/**
 * Delete post
 */
export async function deletePost(id: number): Promise<void> {
  await api.delete(`/forum/posts/${id}`);
}

// ==================== LIKES ====================

/**
 * Toggle topic like
 */
export async function toggleTopicLike(topicId: number): Promise<{ liked: boolean }> {
  const response = await api.post(`/forum/topics/${topicId}/like`);
  return response.data.data;
}

/**
 * Toggle post like
 */
export async function togglePostLike(postId: number): Promise<{ liked: boolean }> {
  const response = await api.post(`/forum/posts/${postId}/like`);
  return response.data.data;
}

// ==================== SUBSCRIPTIONS ====================

/**
 * Subscribe to topic
 */
export async function subscribeToTopic(topicId: number): Promise<void> {
  await api.post(`/forum/topics/${topicId}/subscribe`);
}

/**
 * Unsubscribe from topic
 */
export async function unsubscribeFromTopic(topicId: number): Promise<void> {
  await api.delete(`/forum/topics/${topicId}/subscribe`);
}
