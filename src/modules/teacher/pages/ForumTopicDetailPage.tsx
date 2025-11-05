import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  Pin,
  Lock,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Reply,
  Edit,
  Trash,
  Paperclip,
  Tag,
  CheckCircle,
  Bell,
  BellOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  useForumTopic,
  useCreateReply,
  useUpdatePost,
  useDeletePost,
  useToggleTopicLike,
  useTogglePostLike,
  useSubscribeToTopic,
  useUnsubscribeFromTopic,
} from '@/hooks/useForum';
import type { ForumPost } from '@/services/teacher/ForumService';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function ForumTopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [replyText, setReplyText] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [replyToPostId, setReplyToPostId] = useState<number | null>(null);

  // Fetch topic using hook
  const {
    data: topic,
    isLoading,
    refetch,
  } = useForumTopic(Number(topicId));

  // Mutations using hooks
  const createPostMutation = useCreateReply();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const likeTopicMutation = useToggleTopicLike();
  const likePostMutation = useTogglePostLike();
  const subscribeToTopicMutation = useSubscribeToTopic();
  const unsubscribeFromTopicMutation = useUnsubscribeFromTopic();

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    createPostMutation.mutate({
      topic_id: Number(topicId),
      body: replyText,
      parent_post_id: replyToPostId || undefined,
    }, {
      onSuccess: () => {
        setReplyText('');
        setReplyToPostId(null);
        refetch();
      },
    });
  };

  const handleUpdatePost = async () => {
    if (!editingPostId || !editText.trim()) return;

    updatePostMutation.mutate({
      id: editingPostId,
      body: editText,
    }, {
      onSuccess: () => {
        setEditingPostId(null);
        setEditText('');
        refetch();
      },
    });
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;
    deletePostMutation.mutate(deletingPostId, {
      onSuccess: () => {
        setDeletingPostId(null);
        refetch();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg">Mavzu topilmadi</p>
          <Button onClick={() => navigate('/teacher/forum')} className="mt-4">
            Forumga qaytish
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/teacher/forum" className="hover:text-foreground">
          Forum
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/teacher/forum/categories/${topic.category_id}`}
          className="hover:text-foreground"
        >
          {topic.category?._translations?.uz?.name || topic.category?.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">
          {topic._translations?.uz?.title || topic.title}
        </span>
      </div>

      {/* Topic Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {topic.is_pinned && (
                  <Pin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
                {topic.is_featured && (
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
                {topic.is_locked && (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <h1 className="text-3xl font-bold">
                  {topic._translations?.uz?.title || topic.title}
                </h1>
              </div>

              {/* Author & Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={topic.author?.avatar} />
                    <AvatarFallback>
                      {topic.author
                        ? topic.author.firstname[0] + topic.author.lastname[0]
                        : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {topic.author
                      ? `${topic.author.firstname} ${topic.author.lastname}`
                      : 'Noma\'lum'}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(topic.created_at), {
                    addSuffix: true,
                    locale: uz,
                  })}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{topic.views_count} ko'rildi</span>
                </div>
              </div>

              {/* Tags */}
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topic.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={topic.user_subscribed ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const mutation = topic.user_subscribed
                    ? unsubscribeFromTopicMutation
                    : subscribeToTopicMutation;
                  mutation.mutate(Number(topicId), {
                    onSuccess: () => refetch(),
                  });
                }}
                disabled={subscribeToTopicMutation.isPending || unsubscribeFromTopicMutation.isPending}
              >
                {topic.user_subscribed ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Obunani bekor qilish
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Obuna bo'lish
                  </>
                )}
              </Button>
              <Button
                variant={topic.user_liked ? 'default' : 'outline'}
                size="sm"
                onClick={() => likeTopicMutation.mutate(Number(topicId), {
                  onSuccess: () => refetch(),
                })}
                disabled={likeTopicMutation.isPending}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {topic.likes_count}
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: (topic._translations?.uz?.body || topic.body).replace(
                /\n/g,
                '<br />'
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Javoblar ({topic.posts_count})
        </h2>

        {topic.posts && topic.posts.length > 0 ? (
          topic.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => likePostMutation.mutate(post.id)}
              onReply={() => {
                setReplyToPostId(post.id);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              onEdit={() => {
                setEditingPostId(post.id);
                setEditText(post._translations?.uz?.body || post.body);
              }}
              onDelete={() => setDeletingPostId(post.id)}
              isEditing={editingPostId === post.id}
              editText={editText}
              setEditText={setEditText}
              onSaveEdit={handleUpdatePost}
              onCancelEdit={() => {
                setEditingPostId(null);
                setEditText('');
              }}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Hali javoblar yo'q. Birinchi bo'lib javob yozing!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Form */}
      {!topic.is_locked && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {replyToPostId ? 'Javobga javob yozish' : 'Javob yozish'}
            </h3>
            {replyToPostId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyToPostId(null)}
                className="w-fit"
              >
                Bekor qilish
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Javobingizni yozing..."
              rows={5}
              disabled={createPostMutation.isPending}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || createPostMutation.isPending}
              >
                <Reply className="mr-2 h-4 w-4" />
                {createPostMutation.isPending ? 'Yuklanmoqda...' : 'Javob yuborish'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Javobni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu javobni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>O'chirish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface PostCardProps {
  post: ForumPost;
  onLike: () => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

function PostCard({
  post,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isEditing,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
}: PostCardProps) {
  return (
    <Card className={cn(post.is_best_answer && 'border-green-600 border-2')}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Author Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback>
                {post.author ? post.author.firstname[0] + post.author.lastname[0] : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-center">
              <div className="font-medium">
                {post.author
                  ? `${post.author.firstname} ${post.author.lastname}`
                  : 'Noma\'lum'}
              </div>
              <div className="text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: uz,
                })}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {post.is_best_answer && (
              <Badge className="mb-2 bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Eng yaxshi javob
              </Badge>
            )}

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={5}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={onSaveEdit}>
                    Saqlash
                  </Button>
                  <Button size="sm" variant="outline" onClick={onCancelEdit}>
                    Bekor qilish
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="prose dark:prose-invert prose-sm max-w-none mb-3"
                  dangerouslySetInnerHTML={{
                    __html: (post._translations?.uz?.body || post.body).replace(
                      /\n/g,
                      '<br />'
                    ),
                  }}
                />

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={onLike}>
                    <ThumbsUp
                      className={cn(
                        'h-4 w-4 mr-1',
                        post.user_liked && 'fill-current text-blue-600'
                      )}
                    />
                    {post.likes_count}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onReply}>
                    <Reply className="h-4 w-4 mr-1" />
                    Javob
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onDelete}>
                    <Trash className="h-4 w-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </>
            )}

            {/* Nested Replies */}
            {post.replies && post.replies.length > 0 && (
              <div className="mt-4 ml-4 space-y-3 border-l-2 border-muted pl-4">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.author?.avatar} />
                        <AvatarFallback>
                          {reply.author
                            ? reply.author.firstname[0] + reply.author.lastname[0]
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {reply.author
                          ? `${reply.author.firstname} ${reply.author.lastname}`
                          : 'Noma\'lum'}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.created_at), {
                          addSuffix: true,
                          locale: uz,
                        })}
                      </span>
                    </div>
                    <div
                      className="prose dark:prose-invert prose-sm"
                      dangerouslySetInnerHTML={{
                        __html: (
                          reply._translations?.uz?.body || reply.body
                        ).replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
