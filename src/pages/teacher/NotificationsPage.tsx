import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  Settings,
  Clock,
  FileText,
  Award,
  Calendar,
  Megaphone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStats,
  type Notification,
} from '@/lib/api/notifications';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications', 'list', activeTab, filterType, filterPriority, page],
    queryFn: () =>
      getNotifications({
        page,
        per_page: 20,
        is_read: activeTab === 'all' ? undefined : false,
        type: filterType === 'all' ? undefined : (filterType as any),
        priority: filterPriority === 'all' ? undefined : (filterPriority as any),
      }),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: getNotificationStats,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (data) => {
      toast({
        title: 'Muvaffaqiyatli',
        description: `${data.count} ta bildirishnoma o'qilgan deb belgilandi`,
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      assignment_due: Clock,
      assignment_graded: Check,
      assignment_posted: FileText,
      test_available: FileText,
      test_graded: Award,
      grade_posted: Award,
      attendance_marked: Calendar,
      attendance_warning: AlertCircle,
      announcement: Megaphone,
      message_received: Mail,
    };

    const Icon = icons[type] || Bell;
    return Icon;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'text-red-500 bg-red-100 dark:bg-red-950',
      high: 'text-orange-500 bg-orange-100 dark:bg-orange-950',
      normal: 'text-blue-500 bg-blue-100 dark:bg-blue-950',
      low: 'text-gray-500 bg-gray-100 dark:bg-gray-950',
    };
    return colors[priority] || colors.normal;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hozirgina';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} kun oldin`;
    return created.toLocaleDateString('uz-UZ');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            Barcha bildirishnomalarni boshqaring
          </p>
        </div>
        <Link to="/teacher/notifications/settings">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Sozlamalar
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Jami</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">O'qilmagan</p>
            <p className="text-2xl font-bold text-blue-500">{stats.unread}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Bugun</p>
            <p className="text-2xl font-bold text-green-500">{stats.today}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Shoshilinch</p>
            <p className="text-2xl font-bold text-red-500">{stats.urgent}</p>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              Hammasi
              {stats && stats.total > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              O'qilmagan
              {stats && stats.unread > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {stats.unread}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha turlar</SelectItem>
                <SelectItem value="assignment_due">Topshiriq muddati</SelectItem>
                <SelectItem value="assignment_graded">Topshiriq baholandi</SelectItem>
                <SelectItem value="test_available">Test ochildi</SelectItem>
                <SelectItem value="test_graded">Test baholandi</SelectItem>
                <SelectItem value="grade_posted">Yangi baho</SelectItem>
                <SelectItem value="attendance_marked">Davomat</SelectItem>
                <SelectItem value="announcement">E'lon</SelectItem>
                <SelectItem value="message_received">Yangi xabar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha</SelectItem>
                <SelectItem value="urgent">Shoshilinch</SelectItem>
                <SelectItem value="high">Yuqori</SelectItem>
                <SelectItem value="normal">Oddiy</SelectItem>
                <SelectItem value="low">Past</SelectItem>
              </SelectContent>
            </Select>

            {stats && stats.unread > 0 && (
              <Button
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Barchasini o'qilgan
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <TabsContent value={activeTab} className="space-y-2 mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
            </div>
          ) : !notificationsData?.data || notificationsData.data.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Bildirishnomalar yo'q</h3>
              <p className="text-muted-foreground">
                Hozircha bildirishnoma kelmagan
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notificationsData.data.map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer',
                      !notification.is_read && 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.action_url ? (
                      <Link to={notification.action_url}>
                        <NotificationContent notification={notification} Icon={Icon} />
                      </Link>
                    ) : (
                      <NotificationContent notification={notification} Icon={Icon} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {notificationsData && notificationsData.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Oldingi
              </Button>
              <span className="text-sm text-muted-foreground">
                Sahifa {page} / {notificationsData.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === notificationsData.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Keyingi
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Notification Content Component
function NotificationContent({ notification, Icon }: { notification: Notification; Icon: any }) {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 dark:bg-red-950',
      high: 'bg-orange-100 dark:bg-orange-950',
      normal: 'bg-blue-100 dark:bg-blue-950',
      low: 'bg-gray-100 dark:bg-gray-950',
    };
    return colors[priority] || colors.normal;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hozirgina';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} kun oldin`;
    return created.toLocaleDateString('uz-UZ');
  };

  return (
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className={cn('h-12 w-12 rounded-full flex items-center justify-center shrink-0', getPriorityColor(notification.priority))}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={cn('text-sm', !notification.is_read ? 'font-semibold' : 'font-medium')}>
            {notification.title}
          </h3>
          {!notification.is_read && <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(notification.created_at)}
          </span>
          {notification.priority === 'urgent' && (
            <Badge variant="destructive" className="text-xs">
              Shoshilinch
            </Badge>
          )}
          {notification.priority === 'high' && (
            <Badge variant="default" className="text-xs">
              Muhim
            </Badge>
          )}
          {notification.action_text && (
            <Badge variant="outline" className="text-xs">
              {notification.action_text}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
