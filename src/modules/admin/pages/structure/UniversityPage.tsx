import { useQuery } from '@tanstack/react-query'
import { Building2, Mail, Phone, Globe, User, Calendar } from 'lucide-react'
import { structureApi } from '@/lib/api/structure'
import { Card } from '@/components/ui/card'

export default function UniversityPage() {
  const { data: university, isLoading } = useQuery({
    queryKey: ['university'],
    queryFn: () => structureApi.getUniversity(),
  })

  const { data: stats } = useQuery({
    queryKey: ['structure-stats'],
    queryFn: () => structureApi.getStats(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!university) {
    return <div>Ma'lumot topilmadi</div>
  }

  const infoItems = [
    { icon: Building2, label: 'INN', value: university.inn },
    { icon: Mail, label: 'Email', value: university.email },
    { icon: Phone, label: 'Telefon', value: university.phone },
    { icon: Globe, label: 'Veb-sayt', value: university.website },
    { icon: User, label: 'Rektor', value: university.rector_name },
    { icon: Phone, label: 'Rektor telefoni', value: university.rector_phone },
    { icon: Calendar, label: 'Tashkil etilgan', value: university.established_year },
  ]

  const statCards = [
    {
      title: 'Fakultetlar',
      value: stats?.faculties_count || 0,
      color: 'from-blue-500 to-blue-600',
      icon: Building2,
    },
    {
      title: 'Kafedralar',
      value: stats?.departments_count || 0,
      color: 'from-purple-500 to-purple-600',
      icon: Building2,
    },
    {
      title: 'Talabalar',
      value: stats?.students_count || 0,
      color: 'from-green-500 to-green-600',
      icon: User,
    },
    {
      title: 'O\'qituvchilar',
      value: stats?.teachers_count || 0,
      color: 'from-orange-500 to-orange-600',
      icon: User,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{university.name}</h1>
            <p className="text-blue-100">Oliy ta'lim muassasasi haqida ma'lumot</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Aloqa Ma'lumotlari
          </h2>
          <div className="space-y-4">
            {infoItems.map((item, index) => {
              const Icon = item.icon
              return item.value ? (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                </div>
              ) : null
            })}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Tavsif
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {university.description || 'Tavsif mavjud emas'}
            </p>
          </div>

          {university.address && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Manzil</p>
              <p className="text-gray-900 font-medium">{university.address}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

