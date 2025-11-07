import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  Clock,
  FileText,
  Award,
  Calendar,
  Megaphone,
  Mail,
  AlertCircle,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from '@/lib/api/notifications';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { LucideIcon } from 'lucide-react';

export default function NotificationsDropdown() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get recent notifications
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications', 'recent'],
    queryFn: getRecentNotifications,
    enabled: isOpen,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg h-10 w-10 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-gray-100 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount && unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[400px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Bildirishnomalar</h3>
            {unreadCount && unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} ta o'qilmagan
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Barchasini o'qilgan
              </Button>
            )}
            <Link to="/teacher/notifications/settings">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Bildirishnomalar yo'q
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div key={notification.id}>
                  {notification.action_url ? (
                    <Link
                      to={notification.action_url}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <NotificationItem notification={notification} />
                    </Link>
                  ) : (
                    <div onClick={() => handleNotificationClick(notification)}>
                      <NotificationItem notification={notification} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Link to="/teacher/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-center">
              Barchasini ko'rish
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Notification Item Component
function NotificationItem({ notification }: { notification: Notification }) {
  const getNotificationIcon = (type: string) => {
    const icons: Record<string, LucideIcon> = {
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
      urgent: 'text-red-500',
      high: 'text-orange-500',
      normal: 'text-blue-500',
      low: 'text-gray-500',
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

    const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={cn(
        'p-3 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0',
        !notification.is_read && 'bg-blue-50 dark:bg-blue-950/20'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
            notification.priority === 'urgent' ? 'bg-red-100' : 'bg-primary/10'
          )}
        >
          <Icon className={cn('h-5 w-5', getPriorityColor(notification.priority))} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={cn(
                'text-sm',
                !notification.is_read ? 'font-semibold' : 'font-medium'
              )}
            >
              {notification.title}
            </h4>
            {!notification.is_read && (
              <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
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
          </div>
        </div>
      </div>
    </div>
  );
}
