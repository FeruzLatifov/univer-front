import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Bell, Mail, Smartphone, MessageSquare, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  resetNotificationSettings,
  type NotificationSettings,
} from '@/lib/api/notifications';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { useNotificationSettings, useUpdateSettings } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const notificationTypeLabels: Record<string, string> = {
  assignment_due: 'Topshiriq muddati tugaydi',
  assignment_graded: 'Topshiriq baholandi',
  assignment_posted: 'Yangi topshiriq',
  assignment_submitted: 'Topshiriq topshirildi',
  test_available: 'Test ochildi',
  test_ending_soon: 'Test tugash vaqti yaqin',
  test_graded: 'Test baholandi',
  grade_posted: 'Yangi baho qo\'yildi',
  grade_updated: 'Baho o\'zgartirildi',
  attendance_marked: 'Davomat belgilandi',
  attendance_warning: 'Davomat past',
  announcement: 'E\'lon',
  message_received: 'Yangi xabar keldi',
  comment_posted: 'Yangi izoh',
};

const notificationCategories = {
  'Topshiriqlar': ['assignment_due', 'assignment_graded', 'assignment_posted', 'assignment_submitted'],
  'Testlar': ['test_available', 'test_ending_soon', 'test_graded'],
  'Baholar': ['grade_posted', 'grade_updated'],
  'Davomat': ['attendance_marked', 'attendance_warning'],
  'Umumiy': ['announcement', 'message_received', 'comment_posted'],
};

export default function NotificationSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [localSettings, setLocalSettings] = useState<Record<string, NotificationSettings>>({});

  // Fetch settings using custom hook
  const { data: settings, isLoading } = useNotificationSettings();

  // Initialize local settings when data loads
  useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.notification_type] = setting;
        return acc;
      }, {} as Record<string, NotificationSettings>);
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  // Update settings mutation using custom hook
  const updateMutation = useUpdateSettings();

  // Reset settings mutation
  const resetMutation = useMutation({
    mutationFn: resetNotificationSettings,
    onSuccess: () => {
      toast.success('Sozlamalar standart holatga qaytarildi');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'settings'] });
    },
    onError: () => {
      toast.error('Sozlamalarni tiklashda xatolik');
    },
  });

  const handleToggle = (
    notificationType: string,
    channel: 'email_enabled' | 'push_enabled' | 'sms_enabled' | 'in_app_enabled',
    value: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [notificationType]: {
        ...prev[notificationType],
        [channel]: value,
      },
    }));
  };

  const handleSave = () => {
    const settingsArray = Object.entries(localSettings).map(([type, setting]) => ({
      notification_type: type,
      email_enabled: setting.email_enabled,
      push_enabled: setting.push_enabled,
      sms_enabled: setting.sms_enabled,
      in_app_enabled: setting.in_app_enabled,
    }));

    updateMutation.mutate({ settings: settingsArray });
  };

  const handleReset = () => {
    if (confirm('Barcha sozlamalarni standart holatga qaytarishni xohlaysizmi?')) {
      resetMutation.mutate();
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/notifications')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirishnoma sozlamalari</h1>
          <p className="text-muted-foreground">
            Qanday bildirishnomalarni qaysi kanal orqali olishni tanlang
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertTitle>Bildirishnomalar haqida</AlertTitle>
        <AlertDescription>
          Har bir bildirishnoma turini 4 xil kanal orqali olishingiz mumkin: Tizimda ko'rish,
          Email, Push bildirishnoma va SMS. Kerakli kanallarni yoqing yoki o'chiring.
        </AlertDescription>
      </Alert>

      {/* Channels Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Tizimda</p>
            <p className="text-xs text-muted-foreground">In-App</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Mail className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-xs text-muted-foreground">Pochta</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Smartphone className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Push</p>
            <p className="text-xs text-muted-foreground">Xabarnoma</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <MessageSquare className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium">SMS</p>
            <p className="text-xs text-muted-foreground">Telefon</p>
          </div>
        </div>
      </div>

      {/* Settings by Category */}
      {Object.entries(notificationCategories).map(([category, types]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {category} bilan bog'liq bildirishnomalar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {types.map((type, index) => {
              const setting = localSettings[type];

              if (!setting) return null;

              return (
                <div key={type}>
                  {index > 0 && <Separator className="my-4" />}
                  <div>
                    <h4 className="font-medium mb-3">
                      {notificationTypeLabels[type] || type}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* In-App */}
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor={`${type}-in-app`} className="flex items-center gap-2 cursor-pointer">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Tizimda</span>
                        </Label>
                        <Switch
                          id={`${type}-in-app`}
                          checked={setting.in_app_enabled}
                          onCheckedChange={(value) =>
                            handleToggle(type, 'in_app_enabled', value)
                          }
                        />
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor={`${type}-email`} className="flex items-center gap-2 cursor-pointer">
                          <Mail className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Email</span>
                        </Label>
                        <Switch
                          id={`${type}-email`}
                          checked={setting.email_enabled}
                          onCheckedChange={(value) =>
                            handleToggle(type, 'email_enabled', value)
                          }
                        />
                      </div>

                      {/* Push */}
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor={`${type}-push`} className="flex items-center gap-2 cursor-pointer">
                          <Smartphone className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Push</span>
                        </Label>
                        <Switch
                          id={`${type}-push`}
                          checked={setting.push_enabled}
                          onCheckedChange={(value) =>
                            handleToggle(type, 'push_enabled', value)
                          }
                        />
                      </div>

                      {/* SMS */}
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor={`${type}-sms`} className="flex items-center gap-2 cursor-pointer">
                          <MessageSquare className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">SMS</span>
                        </Label>
                        <Switch
                          id={`${type}-sms`}
                          checked={setting.sms_enabled}
                          onCheckedChange={(value) =>
                            handleToggle(type, 'sms_enabled', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 sticky bottom-4 bg-background/95 backdrop-blur p-4 border rounded-lg shadow-lg">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={resetMutation.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Standart holatga qaytarish
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/teacher/notifications')}
          >
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saqlanmoqda...
              </>
            ) : (
              'Saqlash'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
