import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStudentAssignments } from '@/lib/api/student';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentAssignmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student', 'assignments'],
    queryFn: () => getStudentAssignments(),
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Topshiriqlarim</h1>
      <div className="space-y-3">
        {data?.data?.map((assignment: any) => (
          <Card key={assignment.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{assignment.subject}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(assignment.deadline), { addSuffix: true, locale: uz })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                    {assignment.status === 'submitted' ? 'Topshirilgan' : 'Kutilmoqda'}
                  </Badge>
                  {assignment.submission?.grade && (
                    <Badge variant="outline">Ball: {assignment.submission.grade}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
