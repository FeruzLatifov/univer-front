import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import MessageService, {
  type MessageFilters,
  type SendMessageData,
} from '@/services/teacher/MessageService';

/**
 * Hook for fetching inbox messages
 */
export function useInboxMessages(filters?: MessageFilters) {
  return useQuery({
    queryKey: ['messages', 'inbox', filters],
    queryFn: () => MessageService.getMessages(filters),
  });
}

/**
 * Hook for fetching sent messages
 */
export function useSentMessages(page = 1, perPage = 15) {
  return useQuery({
    queryKey: ['messages', 'sent', page, perPage],
    queryFn: () => MessageService.getSentMessages(page, perPage),
  });
}

/**
 * Hook for fetching a single message
 */
export function useMessage(id: number) {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => MessageService.getMessage(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching unread count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: () => MessageService.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook for sending a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SendMessageData) => MessageService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'sent'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Xabar yuborildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Xabar yuborishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for deleting a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => MessageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Xabar o\'chirildi',
      });
    },
    onError: () => {
      toast({
        title: 'Xatolik',
        description: 'Xabarni o\'chirishda xatolik',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for marking message as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MessageService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
    },
  });
}

/**
 * Hook for marking message as unread
 */
export function useMarkAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MessageService.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
    },
  });
}

/**
 * Hook for archiving a message
 */
export function useArchiveMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => MessageService.archiveMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Xabar arxivlandi',
      });
    },
  });
}

/**
 * Hook for starring a message
 */
export function useStarMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MessageService.starMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message'] });
    },
  });
}

/**
 * Hook for unstarring a message
 */
export function useUnstarMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MessageService.unstarMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message'] });
    },
  });
}
