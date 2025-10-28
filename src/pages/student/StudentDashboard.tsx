import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, ClipboardCheck, Award, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStudentDashboard } from '@/lib/api/student';

export default function StudentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: getStudentDashboard,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const student = data?.student;
  const subjects = data?.subjects;
  const assignments = data?.assignments;
  const tests = data?.tests;
  const attendance = data?.attendance;
  const grades = data?.grades;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Xush kelibsiz, {student?.name}!</h1>
        <p className="text-muted-foreground">{student?.group} • {student?.course}-kurs • {student?.semester}-semestr</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fanlar</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Faol fanlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topshiriqlar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Kelayotgan topshiriqlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Davomat</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance?.stats?.rate || 0}%</div>
            <Progress value={attendance?.stats?.rate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grades?.statistics?.gpa || 0}</div>
            <p className="text-xs text-muted-foreground">O'rtacha ball</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Kelayotgan topshiriqlar
            </CardTitle>
            <CardDescription>Keyingi 7 kun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments?.upcoming?.map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                  <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                    {assignment.status === 'submitted' ? 'Topshirilgan' : 'Kutilmoqda'}
                  </Badge>
                </div>
              ))}
              {(!assignments?.upcoming || assignments.upcoming.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Topshiriqlar yo'q</p>
              )}
            </div>
            <Link to="/student/assignments" className="block mt-4">
              <button className="w-full text-sm text-primary hover:underline">Barchasini ko'rish →</button>
            </Link>
          </CardContent>
        </Card>

        {/* Available Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mavjud testlar
            </CardTitle>
            <CardDescription>Topshirish mumkin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests?.available?.map((test: any) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{test.title}</p>
                    <p className="text-sm text-muted-foreground">{test.subject}</p>
                  </div>
                  <Badge>{test.attempts_count}/{test.max_attempts}</Badge>
                </div>
              ))}
              {(!tests?.available || tests.available.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Testlar yo'q</p>
              )}
            </div>
            <Link to="/student/tests" className="block mt-4">
              <button className="w-full text-sm text-primary hover:underline">Barchasini ko'rish →</button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            So'nggi baholar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades?.recent?.map((grade: any) => (
              <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{grade.subject}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Oraliq: {grade.midterm}</span>
                  <span className="text-sm text-muted-foreground">Yakuniy: {grade.final}</span>
                  <Badge variant="default">{grade.grade_letter}</Badge>
                  <span className="font-bold">{grade.total}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/student/grades" className="block mt-4">
            <button className="w-full text-sm text-primary hover:underline">Barchasini ko'rish →</button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
