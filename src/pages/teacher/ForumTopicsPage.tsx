import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  Pin,
  Lock,
  Star,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  getCategory,
  getTopics,
  toggleTopicLike,
  type ForumTopic,
  type TopicFilters,
} from '@/lib/api/forum';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function ForumTopicsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'most_viewed' | 'most_liked'>(
    'latest'
  );
  const [page, setPage] = useState(1);

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['forum', 'category', categoryId],
    queryFn: () => getCategory(Number(categoryId)),
    enabled: !!categoryId,
  });

  // Fetch topics
  const filters: TopicFilters = {
    page,
    per_page: 20,
    sort_by: sortBy,
    search: searchTerm || undefined,
  };

  const {
    data: topicsData,
    isLoading: topicsLoading,
    refetch,
  } = useQuery({
    queryKey: ['forum', 'topics', categoryId, filters],
    queryFn: () => getTopics(Number(categoryId), filters),
    enabled: !!categoryId,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (topicId: number) => toggleTopicLike(topicId),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['forum', 'topic'] });
    },
  });

  const handleLike = async (topicId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await likeMutation.mutateAsync(topicId);
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Like qo\'shishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  };

  if (categoryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg">Kategoriya topilmadi</p>
          <Button onClick={() => navigate('/teacher/forum')} className="mt-4">
            Forumga qaytish
          </Button>
        </CardContent>
      </Card>
    );
  }

  const topics = topicsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/teacher/forum" className="hover:text-foreground">
          Forum
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">
          {category._translations?.uz?.name || category.name}
        </span>
      </div>

      {/* Category Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                {category._translations?.uz?.name || category.name}
              </CardTitle>
              {category.description && (
                <CardDescription className="text-base">
                  {category._translations?.uz?.description || category.description}
                </CardDescription>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{category.topics_count} mavzu</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{category.posts_count} javob</span>
                </div>
                {category.is_locked && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Yopiq
                  </Badge>
                )}
              </div>
            </div>
            {!category.is_locked && (
              <Link to={`/teacher/forum/categories/${categoryId}/create`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi mavzu
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mavzularda qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                So'nggi
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Mashhur
              </div>
            </SelectItem>
            <SelectItem value="most_viewed">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Ko'p ko'rilgan
              </div>
            </SelectItem>
            <SelectItem value="most_liked">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Ko'p yoqtirilan
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Topics List */}
      {topicsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Mavzular topilmadi</p>
            <p className="text-sm text-muted-foreground mb-4">
              Bu kategoriyada hali mavzular yo'q
            </p>
            {!category.is_locked && (
              <Link to={`/teacher/forum/categories/${categoryId}/create`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Birinchi mavzu yarating
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onLike={(e) => handleLike(topic.id, e)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {topicsData && topicsData.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {topicsData.total} dan {(page - 1) * 20 + 1}-
            {Math.min(page * 20, topicsData.total)} ko'rsatilmoqda
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Oldingi
            </Button>
            <div className="text-sm">
              {page} / {topicsData.last_page}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(topicsData.last_page, p + 1))}
              disabled={page === topicsData.last_page}
            >
              Keyingi
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopicCardProps {
  topic: ForumTopic;
  onLike: (e: React.MouseEvent) => void;
}

function TopicCard({ topic, onLike }: TopicCardProps) {
  return (
    <Link to={`/teacher/forum/topics/${topic.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Topic Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {topic.is_pinned && (
                  <Pin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
                {topic.is_featured && (
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
                {topic.is_locked && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <h3 className="font-semibold text-lg line-clamp-1">
                  {topic._translations?.uz?.title || topic.title}
                </h3>
              </div>

              {/* Author & Date */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1.5">
                  <span>Muallif:</span>
                  <span className="font-medium">
                    {topic.author
                      ? `${topic.author.firstname} ${topic.author.lastname}`
                      : 'Noma\'lum'}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(topic.created_at), {
                    addSuffix: true,
                    locale: uz,
                  })}
                </div>
              </div>

              {/* Tags */}
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {topic.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {topic.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{topic.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.posts_count}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{topic.views_count}</span>
                </div>
                <button
                  onClick={onLike}
                  className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    topic.user_liked
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-muted-foreground hover:text-blue-600'
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{topic.likes_count}</span>
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2">
              {!topic.is_approved && (
                <Badge variant="outline" className="whitespace-nowrap">
                  Kutilmoqda
                </Badge>
              )}
              {topic.best_answer_post_id && (
                <Badge variant="default" className="whitespace-nowrap bg-green-600">
                  Javob topildi
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
