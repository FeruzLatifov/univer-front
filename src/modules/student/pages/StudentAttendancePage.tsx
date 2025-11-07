import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStudentAttendance } from '@/lib/api/student';

export default function StudentAttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'attendance', selectedSubject],
    queryFn: () =>
      getStudentAttendance(
        selectedSubject !== 'all' ? Number(selectedSubject) : undefined
      ),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  const attendance = data?.attendance || [];
  const stats = data?.statistics || {};
  const subjects = data?.subjects || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'excused':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Qatnashdi';
      case 'absent':
        return 'Qatnashmadi';
      case 'late':
        return 'Kechikdi';
      case 'excused':
        return 'Uzrli sabab';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'present':
        return 'default';
      case 'absent':
        return 'destructive';
      case 'late':
        return 'secondary';
      case 'excused':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Davomat</h1>
          <p className="text-muted-foreground">Dars davomatingiz va statistika</p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Fan tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha fanlar</SelectItem>
            {subjects.map((subject: any) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umumiy foiz</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.attendance_rate || 0}%</div>
            <Progress value={stats.attendance_rate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qatnashdi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.present || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total ? `${((stats.present / stats.total) * 100).toFixed(1)}%` : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qatnashmadi</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.absent || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total ? `${((stats.absent / stats.total) * 100).toFixed(1)}%` : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kechikdi</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.late || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total ? `${((stats.late / stats.total) * 100).toFixed(1)}%` : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Davomat tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Davomat ma'lumotlari topilmadi</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendance.map((record: any) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium">{record.subject?.name || record.subject_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('uz-UZ', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {record.lesson_number && (
                        <p className="text-xs text-muted-foreground">
                          {record.lesson_number}-dars
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(record.status)}>
                      {getStatusLabel(record.status)}
                    </Badge>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {record.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject-wise Statistics */}
      {selectedSubject === 'all' && subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fanlar bo'yicha davomat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject: any) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.attendance_rate}%
                    </span>
                  </div>
                  <Progress value={subject.attendance_rate} />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Qatnashdi: {subject.present}</span>
                    <span>Qatnashmadi: {subject.absent}</span>
                    <span>Kechikdi: {subject.late}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
