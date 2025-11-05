import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Lock,
  TrendingUp,
  Users,
  ChevronRight,
  Plus,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useForumCategories } from '@/hooks/useForum';
import type { ForumCategory } from '@/services/teacher/ForumService';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForumCategoriesPage() {
  const { t } = useTranslation();

  // Use hook for fetching categories
  const { data: categories, isLoading } = useForumCategories();

  // Group categories by parent
  const rootCategories = categories?.filter((cat) => !cat.parent_id) || [];
  const getCategoryChildren = (parentId: number) =>
    categories?.filter((cat) => cat.parent_id === parentId) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forum</h1>
          <p className="text-muted-foreground">
            O'qituvchilar va talabalar bilan fikr almashing
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {rootCategories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Kategoriyalar topilmadi</p>
              <p className="text-sm text-muted-foreground">
                Forum kategoriyalari hali yaratilmagan
              </p>
            </CardContent>
          </Card>
        ) : (
          rootCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              children={getCategoryChildren(category.id)}
            />
          ))
        )}
      </div>

      {/* Stats Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Forum Statistikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Kategoriyalar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {categories?.reduce((sum, cat) => sum + cat.topics_count, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Mavzular</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {categories?.reduce((sum, cat) => sum + cat.posts_count, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Javoblar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CategoryCardProps {
  category: ForumCategory;
  children: ForumCategory[];
}

function CategoryCard({ category, children }: CategoryCardProps) {
  const hasChildren = children.length > 0;

  return (
    <Card className={cn(!category.is_active && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div
              className={cn(
                'p-3 rounded-lg',
                category.color
                  ? `bg-${category.color}-100 dark:bg-${category.color}-900`
                  : 'bg-primary/10'
              )}
            >
              {category.is_locked ? (
                <Lock className="h-6 w-6" />
              ) : hasChildren ? (
                <FolderOpen className="h-6 w-6" />
              ) : (
                <MessageSquare className="h-6 w-6" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={`/teacher/forum/categories/${category.id}`}
                  className="hover:underline"
                >
                  <CardTitle className="text-xl">
                    {category._translations?.uz?.name || category.name}
                  </CardTitle>
                </Link>
                {category.is_locked && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Yopiq
                  </Badge>
                )}
                {category.requires_approval && (
                  <Badge variant="outline">Tasdiqlash kerak</Badge>
                )}
                {!category.is_active && (
                  <Badge variant="destructive">Nofaol</Badge>
                )}
              </div>
              {category.description && (
                <CardDescription className="line-clamp-2">
                  {category._translations?.uz?.description || category.description}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 ml-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{category.topics_count}</div>
              <div className="text-xs text-muted-foreground">Mavzular</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{category.posts_count}</div>
              <div className="text-xs text-muted-foreground">Javoblar</div>
            </div>
          </div>

          {/* Arrow */}
          {!category.is_locked && (
            <Link
              to={`/teacher/forum/categories/${category.id}`}
              className="ml-4 flex items-center"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Latest Topic */}
      {category.latest_topic && (
        <CardContent className="pt-0">
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">So'nggi mavzu:</span>
              <Link
                to={`/teacher/forum/topics/${category.latest_topic.id}`}
                className="font-medium hover:underline truncate"
              >
                {category.latest_topic._translations?.uz?.title ||
                  category.latest_topic.title}
              </Link>
            </div>
          </div>
        </CardContent>
      )}

      {/* Child Categories */}
      {hasChildren && (
        <CardContent className="pt-0">
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-2 text-muted-foreground">
              Sub-kategoriyalar:
            </div>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <Link
                  key={child.id}
                  to={`/teacher/forum/categories/${child.id}`}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm',
                    'border border-border hover:bg-accent transition-colors',
                    !child.is_active && 'opacity-50'
                  )}
                >
                  <Folder className="h-3.5 w-3.5" />
                  <span>{child._translations?.uz?.name || child.name}</span>
                  <Badge variant="secondary" className="ml-1">
                    {child.topics_count}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
