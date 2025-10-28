import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStudentSchedule } from '@/lib/api/student';

const DAYS_UZ = [
  { key: 'monday', label: 'Dushanba' },
  { key: 'tuesday', label: 'Seshanba' },
  { key: 'wednesday', label: 'Chorshanba' },
  { key: 'thursday', label: 'Payshanba' },
  { key: 'friday', label: 'Juma' },
  { key: 'saturday', label: 'Shanba' },
];

export default function StudentSchedulePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student', 'schedule'],
    queryFn: getStudentSchedule,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  const schedule = data?.schedule || {};
  const currentWeek = data?.current_week || 1;

  const getLessonTypeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case 'lecture':
        return 'default';
      case 'practice':
        return 'secondary';
      case 'lab':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'Ma\'ruza';
      case 'practice':
        return 'Amaliy';
      case 'lab':
        return 'Laboratoriya';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dars jadvali</h1>
          <p className="text-muted-foreground">Haftalik dars jadvali</p>
        </div>
        <Badge variant="outline" className="text-lg py-2 px-4">
          <Calendar className="h-4 w-4 mr-2" />
          {currentWeek}-hafta
        </Badge>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-4">
        {DAYS_UZ.map((day) => {
          const daySchedule = schedule[day.key] || [];

          return (
            <Card key={day.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {day.label}
                  <Badge variant="secondary" className="ml-2">
                    {daySchedule.length} ta dars
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {daySchedule.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Bu kunda dars yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daySchedule.map((lesson: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Time */}
                        <div className="flex flex-col items-center justify-center min-w-[80px] border-r pr-4">
                          <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-semibold text-sm">{lesson.start_time}</span>
                          <span className="text-xs text-muted-foreground">-</span>
                          <span className="font-semibold text-sm">{lesson.end_time}</span>
                        </div>

                        {/* Lesson Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-lg">{lesson.subject?.name}</h4>
                              </div>
                              <Badge variant={getLessonTypeVariant(lesson.type)}>
                                {getLessonTypeLabel(lesson.type)}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {lesson.lesson_number}-dars
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            {/* Teacher */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{lesson.teacher?.name || 'O\'qituvchi ko\'rsatilmagan'}</span>
                            </div>

                            {/* Room */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{lesson.room || 'Xona ko\'rsatilmagan'}</span>
                            </div>

                            {/* Week */}
                            {lesson.week_type && lesson.week_type !== 'all' && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {lesson.week_type === 'odd' ? 'Toq haftalar' : 'Juft haftalar'}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {lesson.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              {lesson.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Dars turlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">Ma'ruza</Badge>
              <span className="text-sm text-muted-foreground">- Nazariy dars</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Amaliy</Badge>
              <span className="text-sm text-muted-foreground">- Amaliy mashg'ulot</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Laboratoriya</Badge>
              <span className="text-sm text-muted-foreground">- Laboratoriya ishi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
