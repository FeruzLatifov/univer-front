import { useQuery } from '@tanstack/react-query';
import { Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStudentGrades } from '@/lib/api/student';
import type { StudentGradeRecord, StudentGradesResponse } from '@/lib/types/student';

export default function StudentGradesPage() {
  const { data, isLoading } = useQuery<StudentGradesResponse>({
    queryKey: ['student', 'grades'],
    queryFn: () => getStudentGrades(),
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;

  const grades: StudentGradeRecord[] = data?.grades ?? [];
  const stats = data?.statistics || {};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Baholarim</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Jami fanlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_subjects || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">O'rtacha ball</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.average || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.gpa || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fanlar bo'yicha baholar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {grades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium flex-1">{grade.subject}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Oraliq: {grade.midterm}</span>
                  <span className="text-sm text-muted-foreground">Yakuniy: {grade.final}</span>
                  <Badge variant="default" className="w-12 justify-center">{grade.grade}</Badge>
                  <span className="font-bold w-12 text-right">{grade.total}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
