import { mockDiplomas } from '@/lib/mockData'

export default function DiplomasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Diplomlar</h1>
      <div className="grid gap-4">
        {mockDiplomas.map(diploma => (
          <div key={diploma.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold text-lg">{diploma.student_name}</h3>
            <p className="text-sm text-gray-500">Seriya: {diploma.diploma_series} № {diploma.diploma_number}</p>
            <p className="text-sm text-gray-600 mt-2">{diploma.specialty_name}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm">GPA: <strong>{diploma.gpa.toFixed(2)}</strong></span>
              {diploma.honors && <span className="text-xs px-2 py-1 bg-success-100 text-success-800 rounded">Imtiyozli</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

