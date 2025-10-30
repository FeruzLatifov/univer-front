import { useParams } from 'react-router-dom'
import { mockStudents } from '@/lib/mockData'

export default function StudentDetailPage() {
  const { id } = useParams()
  const student = mockStudents.find(s => s.id === id)

  if (!student) {
    return <div>Talaba topilmadi</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.full_name}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Student ID: {student.student_id_number}</p>
      {/* Add more details */}
    </div>
  )
}

