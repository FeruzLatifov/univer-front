import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import ForumService, {
  type TopicFilters,
  type CreateTopicData,
  type CreatePostData,
} from '@/services/teacher/ForumService';

// ==================== CATEGORIES ====================

/**
 * Hook for fetching all forum categories
 */
export function useForumCategories() {
  return useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: () => ForumService.getCategories(),
  });
}

/**
 * Hook for fetching a single category
 */
export function useForumCategory(id: number) {
  return useQuery({
    queryKey: ['forum', 'category', id],
    queryFn: () => ForumService.getCategory(id),
    enabled: !!id,
  });
}

// ==================== TOPICS ====================

/**
 * Hook for fetching topics in a category
 */
export function useForumTopics(categoryId: number, filters?: TopicFilters) {
  return useQuery({
    queryKey: ['forum', 'topics', categoryId, filters],
    queryFn: () => ForumService.getTopics(categoryId, filters),
    enabled: !!categoryId,
  });
}

/**
 * Hook for fetching a single topic
 */
export function useForumTopic(id: number) {
  return useQuery({
    queryKey: ['forum', 'topic', id],
    queryFn: () => ForumService.getTopic(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating a new topic
 */
export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTopicData) => ForumService.createTopic(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['forum', 'categories'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Yangi mavzu yaratildi',
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Mavzu yaratishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for updating a topic
 */
export function useUpdateTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTopicData> }) =>
      ForumService.updateTopic(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['forum', 'topics'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Mavzu tahrirlandi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Mavzu tahrirlashda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for deleting a topic
 */
export function useDeleteTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => ForumService.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['forum', 'categories'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Mavzu o\'chirildi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Mavzu o\'chirishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

// ==================== POSTS ====================

/**
 * Hook for creating a new post (reply)
 */
export function useCreateReply() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePostData) => ForumService.createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic', variables.topic_id] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Javob qo\'shildi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Javob qo\'shishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for updating a post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) =>
      ForumService.updatePost(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Javob tahrirlandi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Javob tahrirlashda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for deleting a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => ForumService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Javob o\'chirildi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Javob o\'chirishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

// ==================== INTERACTIONS ====================

/**
 * Hook for toggling topic like
 */
export function useToggleTopicLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: number) => ForumService.toggleTopicLike(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
      queryClient.invalidateQueries({ queryKey: ['forum', 'topics'] });
    },
  });
}

/**
 * Hook for toggling post like
 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => ForumService.togglePostLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
    },
  });
}

/**
 * Hook for subscribing to a topic
 */
export function useSubscribeToTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (topicId: number) => ForumService.subscribeToTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Obuna bo\'ldingiz',
      });
    },
  });
}

/**
 * Hook for unsubscribing from a topic
 */
export function useUnsubscribeFromTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (topicId: number) => ForumService.unsubscribeFromTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Obuna bekor qilindi',
      });
    },
  });
}
