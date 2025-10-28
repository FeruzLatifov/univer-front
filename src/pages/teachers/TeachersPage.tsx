import { mockTeachers } from '@/lib/mockData'

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">O'qituvchilar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border flex items-center gap-4">
            <img src={teacher.photo} alt={teacher.full_name} className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
              <p className="text-sm text-gray-500">{teacher.position}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

