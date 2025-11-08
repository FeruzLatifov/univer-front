import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FileText, Video, Link as LinkIcon, Download, BookOpen, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStudentResources, getStudentSubjects } from '@/lib/api/student';
import type { StudentResourceResponse, StudentSubjectsResponse, StudentResourceItem } from '@/lib/types/student';

export default function StudentResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fetch subjects for filter
  const { data: subjects } = useQuery<StudentSubjectsResponse>({
    queryKey: ['student', 'subjects'],
    queryFn: () => getStudentSubjects(),
  });

  // Fetch resources
  const { data: resources, isLoading } = useQuery<StudentResourceResponse>({
    queryKey: ['student', 'resources', selectedSubject],
    queryFn: () => getStudentResources(selectedSubject !== 'all' ? selectedSubject : undefined),
  });

  const getResourceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'document':
      case 'pdf':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'link':
      case 'url':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb > 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const filteredResources = resources?.data?.filter((resource) => {
    if (selectedType === 'all') return true;
    return resource.type?.toLowerCase() === selectedType.toLowerCase();
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Elektron Resurslar</h1>
        <p className="text-muted-foreground">Fanlar bo'yicha o'quv materiallari</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fan</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Fan tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fanlar</SelectItem>
                  {subjects?.data?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turi</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tur tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha turlar</SelectItem>
                  <SelectItem value="document">Hujjat</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Havola</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredResources.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resurslar topilmadi</h3>
            <p className="text-muted-foreground">
              {selectedSubject !== 'all' || selectedType !== 'all'
                ? 'Ushbu filtrlar bo\'yicha resurslar mavjud emas'
                : 'Hozircha elektron resurslar yuklanmagan'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource: StudentResourceItem) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Icon and Type */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-muted rounded-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    <Badge variant="outline">
                      {resource.type || 'Fayl'}
                    </Badge>
                  </div>

                  {/* Title and Subject */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {resource.name}
                    </h3>
                    {resource.subject && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{resource.subject.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {resource.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {resource.description}
                    </p>
                  )}

                  {/* File Info */}
                  {resource.file_size && (
                    <div className="text-xs text-muted-foreground">
                      Hajmi: {getFileSize(resource.file_size)}
                    </div>
                  )}

                  {/* Download Button */}
                  {resource.download_url && (
                    <Button className="w-full gap-2" asChild>
                      <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Yuklash
                      </a>
                    </Button>
                  )}

                  {/* Link for URL type */}
                  {resource.type?.toLowerCase() === 'link' && resource.file_path && (
                    <Button className="w-full gap-2" variant="outline" asChild>
                      <a href={resource.file_path} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4" />
                        Ochish
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Card */}
      {!isLoading && filteredResources.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Jami resurslar:
              </span>
              <span className="font-semibold">
                {filteredResources.length} ta
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
