import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Send,
  Paperclip,
  X,
  UserPlus,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendMessage, type SendMessageData } from '@/lib/api/messaging';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

const messageSchema = z.object({
  message_type: z.enum(['direct', 'broadcast']),
  receiver_id: z.number().optional(),
  receiver_type: z.enum(['teacher', 'student', 'admin']).optional(),
  subject: z.string().min(1, 'Mavzu kiritilishi shart').max(500, 'Maksimal 500 belgi'),
  body: z.string().min(1, 'Xabar matni kiritilishi shart'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function ComposeMessagePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [messageType, setMessageType] = useState<'direct' | 'broadcast'>('direct');
  const [recipients, setRecipients] = useState<Array<{ id: number; name: string; type: string }>>(
    []
  );
  const [attachments, setAttachments] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message_type: 'direct',
      priority: 'normal',
    },
  });

  const sendMutation = useMutation({
    mutationFn: (data: SendMessageData) => sendMessage(data),
    onSuccess: () => {
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Xabar yuborildi',
      });
      navigate('/teacher/messages');
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik',
        description: error.response?.data?.message || 'Xabar yuborishda xatolik',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size (max 10MB)
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

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const onSubmit = (data: MessageFormData) => {
    const messageData: SendMessageData = {
      subject: data.subject,
      body: data.body,
      message_type: messageType,
      priority: data.priority,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    if (messageType === 'direct') {
      if (!data.receiver_id || !data.receiver_type) {
        toast({
          title: 'Xatolik',
          description: 'Qabul qiluvchini tanlang',
          variant: 'destructive',
        });
        return;
      }
      messageData.receiver_id = data.receiver_id;
      messageData.receiver_type = data.receiver_type;
    } else {
      if (recipients.length === 0) {
        toast({
          title: 'Xatolik',
          description: 'Kamida 1 ta qabul qiluvchi tanlang',
          variant: 'destructive',
        });
        return;
      }
      messageData.recipients = recipients.map((r) => ({ id: r.id, type: r.type }));
    }

    sendMutation.mutate(messageData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/messages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yangi xabar</h1>
          <p className="text-muted-foreground">O'qituvchi yoki talabaga xabar yuboring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Xabar ma'lumotlari</CardTitle>
            <CardDescription>
              Qabul qiluvchi va xabar tafsilotlarini kiriting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Type */}
            <div className="space-y-2">
              <Label>Xabar turi</Label>
              <Select
                value={messageType}
                onValueChange={(value: 'direct' | 'broadcast') => {
                  setMessageType(value);
                  setValue('message_type', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>To'g'ridan-to'g'ri (1 kishiga)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="broadcast">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Gruppa xabar (ko'p kishiga)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipient (Direct) */}
            {messageType === 'direct' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qabul qiluvchi ID</Label>
                  <Input
                    type="number"
                    placeholder="Masalan: 120"
                    {...register('receiver_id', { valueAsNumber: true })}
                  />
                  {errors.receiver_id && (
                    <p className="text-sm text-red-500">{errors.receiver_id.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Qabul qiluvchi turi</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue('receiver_type', value as 'teacher' | 'student' | 'admin')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Talaba</SelectItem>
                      <SelectItem value="teacher">O'qituvchi</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Recipients (Broadcast) */}
            {messageType === 'broadcast' && (
              <div className="space-y-2">
                <Label>Qabul qiluvchilar</Label>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Gruppa xabar uchun API qo'shimcha endpoint kerak (userlarni qidirish).
                    Hozircha manual ravishda recipient ID larini kiriting.
                  </AlertDescription>
                </Alert>
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipients.map((recipient, index) => (
                      <Badge key={index} variant="secondary">
                        {recipient.name}
                        <button
                          type="button"
                          onClick={() =>
                            setRecipients(recipients.filter((_, i) => i !== index))
                          }
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Priority */}
            <div className="space-y-2">
              <Label>Muhimlik darajasi</Label>
              <Select
                defaultValue="normal"
                onValueChange={(value) =>
                  setValue('priority', value as 'low' | 'normal' | 'high' | 'urgent')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Past</SelectItem>
                  <SelectItem value="normal">Oddiy</SelectItem>
                  <SelectItem value="high">Yuqori</SelectItem>
                  <SelectItem value="urgent">Shoshilinch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Mavzu *</Label>
              <Input
                placeholder="Xabar mavzusi..."
                {...register('subject')}
                maxLength={500}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label>Xabar matni *</Label>
              <Textarea
                placeholder="Xabar matnini yozing..."
                rows={8}
                {...register('body')}
              />
              {errors.body && (
                <p className="text-sm text-red-500">{errors.body.message}</p>
              )}
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Qo'shimcha fayllar</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={attachments.length >= 5}
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Fayl biriktirish
                </Button>
                <span className="text-sm text-muted-foreground">
                  Maksimal 5 ta fayl, har biri 10MB gacha
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />

              {attachments.length > 0 && (
                <div className="space-y-2 mt-4">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/teacher/messages')}
          >
            Bekor qilish
          </Button>
          <Button type="submit" disabled={sendMutation.isPending}>
            {sendMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Yuborish
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
