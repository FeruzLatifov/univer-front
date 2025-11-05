import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ChevronLeft,
  ChevronRight,
  Paperclip,
  X,
  Tag as TagIcon,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import forumService from '@/services/teacher/ForumService';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Sarlavha kamida 5 ta belgidan iborat bo\'lishi kerak')
    .max(500, 'Sarlavha 500 ta belgidan oshmasligi kerak'),
  body: z
    .string()
    .min(10, 'Matn kamida 10 ta belgidan iborat bo\'lishi kerak')
    .max(50000, 'Matn 50000 ta belgidan oshmasligi kerak'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateTopicPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['forum', 'category', categoryId],
    queryFn: () => forumService.getCategory(Number(categoryId!)),
    enabled: !!categoryId,
  });

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  // Create topic mutation
  const createTopicMutation = useMutation({
    mutationFn: forumService.createTopic.bind(forumService),
    onSuccess: (data) => {
      toast({
        title: 'Muvaffaqiyatli!',
        description: category?.requires_approval
          ? 'Mavzu yaratildi va tasdiqlash kutilmoqda'
          : 'Mavzu muvaffaqiyatli yaratildi',
      });
      navigate(`/teacher/forum/topics/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Mavzu yaratishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });

  // Handle tag addition
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size (max 10MB per file)
    const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast({
        title: 'Xatolik',
        description: 'Fayl hajmi 10MB dan oshmasligi kerak',
        variant: 'destructive',
      });
      return;
    }

    // Max 5 files
    if (attachments.length + files.length > 5) {
      toast({
        title: 'Xatolik',
        description: 'Maksimal 5 ta fayl biriktirish mumkin',
        variant: 'destructive',
      });
      return;
    }

    setAttachments([...attachments, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Form submit
  const onSubmit = async (data: FormData) => {
    if (!categoryId) return;

    createTopicMutation.mutate({
      category_id: Number(categoryId),
      title: data.title,
      body: data.body,
      tags: tags.length > 0 ? tags : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  if (categoryLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
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

  if (category.is_locked) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg">Bu kategoriya yopiq</p>
          <p className="text-muted-foreground mt-2">
            Bu kategoriyada yangi mavzu yaratish mumkin emas
          </p>
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
          to={`/teacher/forum/categories/${categoryId}`}
          className="hover:text-foreground"
        >
          {category._translations?.uz?.name || category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Yangi mavzu</span>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Yangi mavzu yaratish</CardTitle>
          <CardDescription>
            {category._translations?.uz?.description || category.description}
          </CardDescription>
          {category.requires_approval && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-2">
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Tasdiqlash kerak
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Bu kategoriyada yaratilgan mavzular moderator tomonidan tasdiqlanishi kerak
                </p>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Mavzu sarlavhasi</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Mavzu sarlavhasini kiriting..."
                        {...field}
                        disabled={createTopicMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Qisqa va tushunarli sarlavha yozing (5-500 belgi)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Body */}
          <Card>
            <CardHeader>
              <CardTitle>Mavzu matni</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Mavzu haqida batafsil yozing..."
                        rows={12}
                        {...field}
                        disabled={createTopicMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Savolingiz yoki fikringizni batafsil bayon qiling
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Teglar (ixtiyoriy)</CardTitle>
              <CardDescription>
                Mavzuni topish osonroq bo'lishi uchun teglar qo'shing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Teg kiriting..."
                  disabled={createTopicMutation.isPending || tags.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={
                    !tagInput.trim() ||
                    createTopicMutation.isPending ||
                    tags.length >= 5
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      <TagIcon className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                        disabled={createTopicMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {tags.length}/5 ta teg qo'shildi
              </p>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Fayllar (ixtiyoriy)</CardTitle>
              <CardDescription>
                Maksimal 5 ta fayl, har biri 10MB dan oshmasligi kerak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={createTopicMutation.isPending || attachments.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={createTopicMutation.isPending || attachments.length >= 5}
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Fayl biriktirish
                </Button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        disabled={createTopicMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {attachments.length}/5 ta fayl biriktirildi
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={createTopicMutation.isPending}
            >
              {createTopicMutation.isPending ? 'Yuklanmoqda...' : 'Mavzu yaratish'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate(`/teacher/forum/categories/${categoryId}`)}
              disabled={createTopicMutation.isPending}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Bekor qilish
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
