import { mockSubjects } from '@/lib/mockData'

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fanlar</h1>
      <div className="grid gap-4">
        {mockSubjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold text-lg">{subject.name}</h3>
            <p className="text-sm text-gray-500">Kod: {subject.code} | Kredit: {subject.credit}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

