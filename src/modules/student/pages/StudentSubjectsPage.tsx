import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStudentSubjects } from '@/lib/api/student';

export default function StudentSubjectsPage() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['student', 'subjects'],
    queryFn: getStudentSubjects,
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fanlarim</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects?.map((subject: any) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {subject.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Kod: {subject.code}</p>
                <p className="text-sm">O'qituvchi: {subject.teacher.name}</p>
                <div className="flex gap-2">
                  <Badge>Kredit: {subject.credit}</Badge>
                  <Badge variant="outline">{subject.total_acload} soat</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
