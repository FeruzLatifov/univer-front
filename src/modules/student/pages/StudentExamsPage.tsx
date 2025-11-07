import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Award, CheckCircle, XCircle, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStudentExams } from '@/lib/api/student';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentExamsPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['student', 'exams'],
    queryFn: () => getStudentExams(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const now = new Date();
  const upcomingExams = exams?.data?.filter((exam: any) =>
    new Date(exam.exam_date) >= now && exam.status === 'scheduled'
  ) || [];

  const pastExams = exams?.data?.filter((exam: any) =>
    exam.status === 'taken' || new Date(exam.exam_date) < now
  ) || [];

  const getStatusBadge = (status: string, passed?: boolean) => {
    if (status === 'taken') {
      return passed ? (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          O'tdi
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          O'tmadi
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Rejalashtirilgan
      </Badge>
    );
  };

  const getTimeUntilExam = (examDate: string) => {
    const date = new Date(examDate);
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} kun ${hours} soat qoldi`;
    } else if (hours > 0) {
      return `${hours} soat qoldi`;
    }
    return 'Bugun';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Imtihonlar</h1>
        <p className="text-muted-foreground">Kelayotgan va o'tgan imtihonlar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelayotgan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">Rejalashtirilgan imtihonlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topshirilgan</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastExams.length}</div>
            <p className="text-xs text-muted-foreground">Topshirilgan imtihonlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha ball</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pastExams.length > 0
                ? (pastExams.reduce((sum: number, exam: any) => sum + (exam.student_ball || 0), 0) / pastExams.length).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Imtihonlar bo'yicha</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Kelayotgan ({upcomingExams.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            <CheckCircle className="h-4 w-4 mr-2" />
            O'tgan ({pastExams.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Exams */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingExams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Kelayotgan imtihonlar yo'q</h3>
                <p className="text-muted-foreground">Hozircha rejalashtirilgan imtihonlar mavjud emas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingExams.map((exam: any) => (
                <Card key={exam.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h3 className="text-xl font-semibold">{exam.subject}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{exam.exam_type}</p>
                        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                          <Clock className="h-4 w-4" />
                          {getTimeUntilExam(exam.exam_date)}
                        </div>
                      </div>
                      {getStatusBadge(exam.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Sana</p>
                        <p className="font-semibold">
                          {new Date(exam.exam_date).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Vaqt</p>
                        <p className="font-semibold">{exam.start_time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Davomiyligi</p>
                        <p className="font-semibold">{exam.duration} daqiqa</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Maksimal ball</p>
                        <p className="font-semibold">{exam.max_ball}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Past Exams */}
        <TabsContent value="past" className="space-y-4">
          {pastExams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">O'tgan imtihonlar yo'q</h3>
                <p className="text-muted-foreground">Hozircha topshirilgan imtihonlar mavjud emas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastExams.map((exam: any) => {
                const percentage = exam.max_ball > 0 ? (exam.student_ball / exam.max_ball) * 100 : 0;
                const passed = percentage >= 55; // Assuming 55% is passing grade

                return (
                  <Card key={exam.id} className={`border-l-4 ${passed ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold">{exam.subject}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{exam.exam_type}</p>
                        </div>
                        {getStatusBadge(exam.status, passed)}
                      </div>

                      <div className="space-y-4">
                        {/* Score Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Natija</span>
                            <span className="text-sm font-bold">
                              {exam.student_ball} / {exam.max_ball} ball ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>

                        {/* Exam Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Sana</p>
                            <p className="font-semibold">
                              {new Date(exam.exam_date).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Vaqt</p>
                            <p className="font-semibold">{exam.start_time}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Davomiyligi</p>
                            <p className="font-semibold">{exam.duration} daqiqa</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
