import { mockGroups } from '@/lib/mockData'

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guruhlar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGroups.map(group => (
          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{group.specialty_name}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Talabalar: {group.student_count}</span>
              <span className="text-sm text-gray-500">{group.course}-kurs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

