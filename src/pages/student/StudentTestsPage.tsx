import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudentTests, getStudentTestResults } from '@/lib/api/student';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentTestsPage() {
  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ['student', 'tests'],
    queryFn: getStudentTests,
  });

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['student', 'test-results'],
    queryFn: getStudentTestResults,
  });

  if (testsLoading || resultsLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  const availableTests = tests?.data || [];
  const testResults = results?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Testlar</h1>
        <p className="text-muted-foreground">Mavjud testlar va natijalar</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">
            <ClipboardList className="h-4 w-4 mr-2" />
            Mavjud testlar ({availableTests.length})
          </TabsTrigger>
          <TabsTrigger value="results">
            <CheckCircle className="h-4 w-4 mr-2" />
            Natijalar ({testResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableTests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Hozircha mavjud testlar yo'q</p>
              </CardContent>
            </Card>
          ) : (
            availableTests.map((test: any) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{test.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{test.subject?.name}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Savollar soni</p>
                          <p className="font-semibold">{test.questions_count} ta</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Vaqt</p>
                          <p className="font-semibold">{test.duration} daqiqa</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Urinishlar</p>
                          <p className="font-semibold">
                            {test.attempts_count || 0}/{test.max_attempts}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">O'tish bali</p>
                          <p className="font-semibold">{test.passing_score}%</p>
                        </div>
                      </div>

                      {test.start_time && (
                        <div className="flex items-center gap-2 text-sm mb-4">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Boshlanish: {new Date(test.start_time).toLocaleString('uz-UZ')}</span>
                        </div>
                      )}

                      {test.end_time && (
                        <div className="flex items-center gap-2 text-sm mb-4">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Tugash: {formatDistanceToNow(new Date(test.end_time), {
                              addSuffix: true,
                              locale: uz
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge variant={test.status === 'published' ? 'default' : 'secondary'}>
                        {test.status === 'published' ? 'Faol' : 'Nofaol'}
                      </Badge>
                      {test.can_take ? (
                        <Button size="sm" asChild>
                          <Link to={`/student/tests/${test.id}/take`}>
                            Testni boshlash
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Urinishlar tugadi
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {testResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Hozircha test natijalari yo'q</p>
              </CardContent>
            </Card>
          ) : (
            testResults.map((result: any) => (
              <Card key={result.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{result.test?.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{result.test?.subject?.name}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Ball</p>
                          <p className="text-2xl font-bold text-primary">{result.score}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">To'g'ri javoblar</p>
                          <p className="font-semibold">
                            {result.correct_answers}/{result.total_questions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sarflangan vaqt</p>
                          <p className="font-semibold">{result.time_spent} daqiqa</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sana</p>
                          <p className="text-sm">
                            {new Date(result.completed_at).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            O'tdi
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            O'tmadi
                          </Badge>
                        )}
                        {result.is_best_score && (
                          <Badge variant="outline">Eng yaxshi natija</Badge>
                        )}
                      </div>
                    </div>

                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/student/tests/${result.test_id}/attempts/${result.id}`}>
                        Batafsil
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
