import { mockPayments } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To'lovlar</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talaba</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockPayments.map(payment => (
              <tr key={payment.id}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{payment.student_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(payment.payment_date)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-success-600">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white uppercase">{payment.payment_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

