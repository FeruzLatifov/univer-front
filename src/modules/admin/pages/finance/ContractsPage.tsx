import { mockContracts } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shartnomalar</h1>
      <div className="grid gap-4">
        {mockContracts.map(contract => (
          <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{contract.student_name}</h3>
                <p className="text-sm text-gray-500">№ {contract.contract_number}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(contract.contract_sum)}</p>
                <p className="text-sm text-success-600">To'langan: {formatCurrency(contract.paid_sum)}</p>
                <p className="text-sm text-error-600">Qarz: {formatCurrency(contract.debt_sum)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

