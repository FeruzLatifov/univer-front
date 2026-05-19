import { useState } from 'react'
import { Wallet, AlertTriangle, FileText, TrendingUp } from 'lucide-react'
import { useContracts, useContractDebtors } from '@/hooks/useContracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' soʻm'
}

type TabValue = 'all' | 'debtors'

export default function ContractsPage() {
  const [tab, setTab] = useState<TabValue>('all')
  const { data: all, isLoading: allLoading } = useContracts()
  const { data: debt, isLoading: debtLoading } = useContractDebtors()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shartnomalar</h1>
        <p className="text-muted-foreground mt-1">
          {all?.education_year ?? "Joriy o'quv yili"} · Sizning guruhlaringizdagi shartnomalar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami shartnomalar</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            {allLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">{all?.count ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Qarzdorlar</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            {debtLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">{debt?.total_debtors ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Jami qarz</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            {debtLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(debt?.total_debt ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="all">Barchasi</TabsTrigger>
          <TabsTrigger value="debtors">
            Qarzdorlar
            {debt && debt.total_debtors > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {debt.total_debtors}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          <ContractsList
            items={all?.contracts ?? []}
            isLoading={allLoading}
            emptyText="Shartnomalar topilmadi"
          />
        </TabsContent>

        <TabsContent value="debtors" className="space-y-2">
          <ContractsList
            items={debt?.debtors ?? []}
            isLoading={debtLoading}
            emptyText="Hozircha qarzdorlar yo'q"
            highlightDebt
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ContractsListProps {
  items: import('@/services/teacher/ContractService').ContractListItem[]
  isLoading: boolean
  emptyText: string
  highlightDebt?: boolean
}

function ContractsList({ items, isLoading, emptyText, highlightDebt }: ContractsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Wallet className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>{emptyText}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((c) => {
        const debtRatio = c.contract_summa > 0 ? (c.debt_summa / c.contract_summa) * 100 : 0
        const hasDebt = c.debt_summa > 0

        return (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{c.student?.full_name ?? '—'}</h3>
                    {c.student?.student_id_number && (
                      <Badge variant="outline" className="text-xs">
                        {c.student.student_id_number}
                      </Badge>
                    )}
                    {c.group && (
                      <Badge variant="secondary" className="text-xs">
                        {c.group}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    {c.contract_number && (
                      <div>Shartnoma: <span className="font-medium">{c.contract_number}</span></div>
                    )}
                    {c.contract_date && <div>Sana: {c.contract_date}</div>}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Summa: <span className="font-medium text-foreground">{formatCurrency(c.contract_summa)}</span>
                  </div>
                  <div className="text-sm">
                    To'langan: <span className="font-medium text-green-600">{formatCurrency(c.paid_summa)}</span>
                  </div>
                  <div className={`text-sm font-semibold ${hasDebt ? 'text-red-600' : 'text-green-600'}`}>
                    Qarz: {formatCurrency(c.debt_summa)}
                  </div>
                  {highlightDebt && hasDebt && (
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(debtRatio)}% qarz
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
