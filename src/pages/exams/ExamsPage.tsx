import { mockExams } from '@/lib/mockData'

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Imtihonlar</h1>
      <div className="grid gap-4">
        {mockExams.map(exam => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold text-lg">{exam.subject_name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Guruh</p>
                <p className="font-medium">{exam.group_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sana</p>
                <p className="font-medium">{exam.exam_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Vaqt</p>
                <p className="font-medium">{exam.exam_time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Xona</p>
                <p className="font-medium">{exam.room}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

