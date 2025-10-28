import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FileText, Download, FileCheck, FileSpreadsheet, Award, FileSignature, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getStudentDocuments,
  getStudentDecrees,
  getStudentReferences,
  getStudentContracts,
  generateReference
} from '@/lib/api/student';
import { toast } from 'sonner';

export default function StudentDocumentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all documents
  const { data: allDocuments, isLoading: allLoading } = useQuery({
    queryKey: ['student', 'documents', 'all'],
    queryFn: getStudentDocuments,
  });

  // Fetch decrees
  const { data: decrees, isLoading: decreesLoading } = useQuery({
    queryKey: ['student', 'decrees'],
    queryFn: getStudentDecrees,
    enabled: activeTab === 'decree',
  });

  // Fetch references
  const { data: references, isLoading: referencesLoading, refetch: refetchReferences } = useQuery({
    queryKey: ['student', 'references'],
    queryFn: getStudentReferences,
    enabled: activeTab === 'reference',
  });

  // Fetch contracts
  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['student', 'contracts'],
    queryFn: getStudentContracts,
    enabled: activeTab === 'contract',
  });

  // Generate new reference
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReference = async () => {
    try {
      setIsGenerating(true);
      const result = await generateReference();
      toast.success('Ma\'lumotnoma muvaffaqiyatli yaratildi!');
      refetchReferences();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'decree':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'reference':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'contract':
        return <FileSignature className="h-5 w-5 text-purple-500" />;
      case 'diploma':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'transcript':
      case 'academic_info':
        return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeName = (type: string) => {
    const types: Record<string, string> = {
      decree: 'Buyruq',
      reference: 'Ma\'lumotnoma',
      contract: 'Kontrakt',
      diploma: 'Diplom',
      transcript: 'Transkript',
      academic_info: 'Akademik ma\'lumotnoma',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Xujjatlarim</h1>
          <p className="text-muted-foreground">Buyruqlar, ma'lumotnomalar va boshqa xujjatlar</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <FileText className="h-4 w-4 mr-2" />
            Barchasi
          </TabsTrigger>
          <TabsTrigger value="decree">
            <FileText className="h-4 w-4 mr-2" />
            Buyruqlar
          </TabsTrigger>
          <TabsTrigger value="reference">
            <FileCheck className="h-4 w-4 mr-2" />
            Ma'lumotnomalar
          </TabsTrigger>
          <TabsTrigger value="contract">
            <FileSignature className="h-4 w-4 mr-2" />
            Kontrakt
          </TabsTrigger>
        </TabsList>

        {/* All Documents */}
        <TabsContent value="all" className="space-y-4">
          {allLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !allDocuments?.data || allDocuments.data.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Hozircha xujjatlar yo'q</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {allDocuments.data.map((doc: any) => (
                <Card key={`${doc.type}-${doc.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {getDocumentIcon(doc.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold">{doc.name}</h3>
                          <div className="flex gap-2 mt-1">
                            {doc.attributes?.map((attr: any, idx: number) => (
                              <span key={idx} className="text-xs text-muted-foreground">
                                {attr.label}: <span className="font-medium">{attr.value}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline">{getDocumentTypeName(doc.type)}</Badge>
                      </div>
                      {doc.file && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.file} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Yuklash
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Decrees */}
        <TabsContent value="decree" className="space-y-4">
          {decreesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !decrees?.data || decrees.data.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Buyruqlar topilmadi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {decrees.data.map((decree: any) => (
                <Card key={decree.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{decree.name}</h3>
                          <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                            <span>№ {decree.number}</span>
                            <span>•</span>
                            <span>{new Date(decree.date).toLocaleDateString('uz-UZ')}</span>
                            {decree.type && (
                              <>
                                <span>•</span>
                                <span>{decree.type}</span>
                              </>
                            )}
                          </div>
                          {decree.description && (
                            <p className="text-sm text-muted-foreground mt-2">{decree.description}</p>
                          )}
                        </div>
                      </div>
                      {decree.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={decree.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Yuklash
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* References */}
        <TabsContent value="reference" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReference}
              disabled={isGenerating}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {isGenerating ? 'Yaratilmoqda...' : 'Yangi ma\'lumotnoma'}
            </Button>
          </div>

          {referencesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !references?.data || references.data.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Ma'lumotnomalar topilmadi</p>
                <Button onClick={handleGenerateReference} disabled={isGenerating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Birinchi ma'lumotnoma yaratish
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {references.data.map((ref: any) => (
                <Card key={ref.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <FileCheck className="h-8 w-8 text-green-500" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Ma'lumotnoma № {ref.number}</h3>
                          <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                            <span>{new Date(ref.issue_date).toLocaleDateString('uz-UZ')}</span>
                            {ref.semester && (
                              <>
                                <span>•</span>
                                <span>{ref.semester.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant={ref.status === 'active' ? 'default' : 'secondary'}>
                          {ref.status === 'active' ? 'Faol' : 'Nofaol'}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={ref.download_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Yuklash
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contracts */}
        <TabsContent value="contract" className="space-y-4">
          {contractsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !contracts?.data?.items || contracts.data.items.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Kontrakt topilmadi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {contracts.data.items.map((contract: any) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <FileSignature className="h-8 w-8 text-purple-500" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Kontrakt № {contract.number}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Sana:</span>
                              <p className="font-medium">
                                {new Date(contract.contract_date).toLocaleDateString('uz-UZ')}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Summa:</span>
                              <p className="font-medium">
                                {contract.amount?.toLocaleString('uz-UZ')} so'm
                              </p>
                            </div>
                            {contract.education_year && (
                              <div>
                                <span className="text-muted-foreground">O'quv yili:</span>
                                <p className="font-medium">{contract.education_year.name}</p>
                              </div>
                            )}
                            <div>
                              <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                                {contract.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/api/v1/student/contract-download/${contract.id}`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Yuklash
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
