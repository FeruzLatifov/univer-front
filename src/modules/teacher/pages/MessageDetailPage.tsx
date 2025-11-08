import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  Mail,
  Clock,
  User,
  Paperclip,
  Download,
  Reply,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessage, useDeleteMessage, useSendMessage } from '@/hooks/useMessages';
import { getAttachmentDownloadUrl } from '@/lib/api/messaging';
import { useToast } from '@/hooks/use-toast';

export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showReply, setShowReply] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ reply: string }>();

  // Fetch message using hook
  const {
    data: message,
    isLoading,
    refetch,
  } = useMessage(Number(id));

  // Delete mutation using hook
  const deleteMutation = useDeleteMessage();

  // Reply mutation using hook
  const replyMutation = useSendMessage();

  const onReplySubmit = (data: { reply: string }) => {
    if (!data.reply.trim()) {
      toast({
        title: 'Xatolik',
        description: 'Javob matnini kiriting',
        variant: 'destructive',
      });
      return;
    }
    replyMutation.mutate({
      receiver_id: message?.sender_id,
      receiver_type: message?.sender_type,
      subject: `Re: ${message?.subject}`,
      body: data.reply,
      message_type: 'direct',
      priority: 'normal',
      parent_message_id: message?.id,
    }, {
      onSuccess: () => {
        reset();
        setShowReply(false);
        refetch();
      },
    });
  };

  const handleDelete = () => {
    if (confirm('Xabarni o\'chirmoqchimisiz?')) {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => {
          navigate('/teacher/messages');
        },
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Xabar topilmadi</h3>
        <Button className="mt-4" onClick={() => navigate('/teacher/messages')}>
          Orqaga qaytish
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/messages')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{message.subject}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              {getPriorityBadge(message.priority)}
              <Badge variant="outline">{message.message_type}</Badge>
              {message.has_attachments && (
                <Badge variant="outline">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {message.attachments?.length || 0} fayl
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowReply(!showReply)}>
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {message.sender?.firstname} {message.sender?.lastname}
                </p>
                <p className="text-sm text-muted-foreground">
                  Kimga:{' '}
                  {message.receiver
                    ? `${message.receiver.firstname} ${message.receiver.lastname}`
                    : message.recipients
                    ? `${message.recipients.length} kishi`
                    : 'Unknown'}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(message.created_at).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                {new Date(message.created_at).toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{message.body}</p>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Qo'shimcha fayllar ({message.attachments.length})
                </h3>
                <div className="space-y-2">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{attachment.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.formatted_size || 'Unknown size'} •{' '}
                            {attachment.file_type?.toUpperCase() || 'FILE'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={getAttachmentDownloadUrl(attachment.id)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Yuklab olish
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Replies */}
      {message.replies && message.replies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Javoblar ({message.replies.length})</h2>
          {message.replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">
                        {reply.sender?.firstname} {reply.sender?.lastname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap">{reply.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReply && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Reply className="h-5 w-5" />
              Javob yozish
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onReplySubmit)} className="space-y-4">
              <Textarea
                placeholder="Javobingizni yozing..."
                rows={6}
                {...register('reply')}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReply(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={replyMutation.isPending}>
                  {replyMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Reply className="mr-2 h-4 w-4" />
                      Javob yuborish
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Parent Message Info */}
      {message.parent_message_id && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bu xabar boshqa xabarga javob. Parent message ID: {message.parent_message_id}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
