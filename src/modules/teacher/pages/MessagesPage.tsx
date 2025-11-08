import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  Inbox,
  Paperclip,
  Search,
  Plus,
  MoreVertical,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useInboxMessages, useSentMessages, useMarkAsRead, useDeleteMessage } from '@/hooks/useMessages';
import type { Message } from '@/services/teacher/MessageService';

type ReadFilter = 'all' | 'read' | 'unread'
type PriorityFilter = 'all' | 'urgent' | 'high' | 'normal' | 'low'

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<ReadFilter>('all');
  const [filterPriority, setFilterPriority] = useState<PriorityFilter>('all');
  const [page, setPage] = useState(1);

  // Fetch inbox messages using hook
  const {
    data: inboxData,
    isLoading: inboxLoading,
    refetch: refetchInbox,
  } = useInboxMessages({
    page,
    per_page: 15,
    is_read: filterRead === 'all' ? undefined : filterRead === 'read',
    priority: filterPriority === 'all' ? undefined : filterPriority,
    search: searchTerm || undefined,
  });

  // Fetch sent messages using hook
  const {
    data: sentData,
    isLoading: sentLoading,
    refetch: refetchSent,
  } = useSentMessages(page, 15);

  const messages = activeTab === 'inbox' ? inboxData?.data : sentData?.data;
  const isLoading = activeTab === 'inbox' ? inboxLoading : sentLoading;
  const totalPages = activeTab === 'inbox' ? inboxData?.last_page : sentData?.last_page;

  // Mark as read mutation
  const markAsReadMutation = useMarkAsRead();

  // Delete message mutation
  const deleteMessageMutation = useDeleteMessage();

  const handleMarkAsRead = async (id: number) => {
    await markAsReadMutation.mutateAsync(id);
    refetchInbox();
  };

  const handleDeleteMessage = async (id: number) => {
    if (confirm('Xabarni o\'chirmoqchimisiz?')) {
      await deleteMessageMutation.mutateAsync(id);
      if (activeTab === 'inbox') {
        refetchInbox();
      } else {
        refetchSent();
      }
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'default',
      normal: 'secondary',
      low: 'outline',
    } as const;

    const labels = {
      urgent: 'Shoshilinch',
      high: 'Yuqori',
      normal: 'Oddiy',
      low: 'Past',
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'secondary'}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    );
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xabarlar</h1>
          <p className="text-muted-foreground">
            O'qituvchilar va talabalar bilan muloqot qiling
          </p>
        </div>
        <Link to="/teacher/messages/compose">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yangi xabar
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2">
              <Inbox className="h-4 w-4" />
              Kiruvchi
              {inboxData && inboxData.total > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {inboxData.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <Send className="h-4 w-4" />
              Yuborilgan
              {sentData && sentData.total > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {sentData.total}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Xabarlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {activeTab === 'inbox' && (
              <>
                <Select value={filterRead} onValueChange={setFilterRead}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hammasi</SelectItem>
                    <SelectItem value="unread">O'qilmagan</SelectItem>
                    <SelectItem value="read">O'qilgan</SelectItem>
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
              </>
            )}
          </div>
        </div>

        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Xabarlar yo'q</h3>
              <p className="text-muted-foreground">
                Hozircha sizga xabar kelmagan
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message: Message) => (
                <Link
                  key={message.id}
                  to={`/teacher/messages/${message.id}`}
                  onClick={() => !message.is_read && handleMarkAsRead(message.id)}
                >
                  <div
                    className={cn(
                      'p-4 rounded-lg border hover:bg-accent transition-colors',
                      !message.is_read && 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!message.is_read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                          <p className="font-semibold truncate">
                            {message.sender?.firstname} {message.sender?.lastname}
                          </p>
                          {getPriorityIcon(message.priority)}
                          {getPriorityBadge(message.priority)}
                          {message.has_attachments && (
                            <Badge variant="outline">
                              <Paperclip className="h-3 w-3 mr-1" />
                              Fayl
                            </Badge>
                          )}
                        </div>
                        <h3
                          className={cn(
                            'text-sm mb-1',
                            !message.is_read ? 'font-semibold' : 'font-medium'
                          )}
                        >
                          {message.subject}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.body}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(message.created_at).toLocaleDateString('uz-UZ')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center whitespace-nowrap rounded-lg h-10 w-10 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMarkAsRead(message.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              O'qilgan deb belgilash
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600"
                            >
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages && totalPages > 1 && (
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
                Sahifa {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Keyingi
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Sent Tab */}
        <TabsContent value="sent" className="space-y-4">
          {/* Similar structure to inbox */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Yuborilgan xabarlar yo'q</h3>
              <p className="text-muted-foreground">
                Hozircha xabar yubormagansiz
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message: Message) => (
                <Link key={message.id} to={`/teacher/messages/${message.id}`}>
                  <div className="p-4 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold truncate">
                            Kimga:{' '}
                            {message.receiver
                              ? `${message.receiver.firstname} ${message.receiver.lastname}`
                              : `${message.recipients?.length || 0} kishi`}
                          </p>
                          {getPriorityBadge(message.priority)}
                          {message.has_attachments && (
                            <Badge variant="outline">
                              <Paperclip className="h-3 w-3 mr-1" />
                              Fayl
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-sm font-medium mb-1">{message.subject}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.body}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(message.created_at).toLocaleDateString('uz-UZ')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center whitespace-nowrap rounded-lg h-10 w-10 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600"
                            >
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages && totalPages > 1 && (
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
                Sahifa {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
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
