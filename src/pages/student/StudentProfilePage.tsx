import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getStudentProfile,
  updateStudentProfile,
  updateStudentPassword,
  uploadStudentPhoto,
  deleteStudentPhoto
} from '@/lib/api/student'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2, User, Lock, Camera, Trash2, Save, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function StudentProfilePage() {
  const queryClient = useQueryClient()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    phone: '',
    email: '',
    current_address: '',
    telegram_username: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  // Fetch profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: getStudentProfile,
    onSuccess: (data) => {
      setProfileForm({
        phone: data.phone || '',
        email: data.email || '',
        current_address: data.current_address || '',
        telegram_username: data.telegram_username || '',
      })
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] })
      toast.success('Profil muvaffaqiyatli yangilandi')
      setIsEditingProfile(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Profilni yangilashda xatolik yuz berdi')
    },
  })

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: updateStudentPassword,
    onSuccess: () => {
      toast.success('Parol muvaffaqiyatli o\'zgartirildi')
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
      setIsChangingPassword(false)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Parolni o\'zgartirishda xatolik yuz berdi'
      const errors = error.response?.data?.errors

      if (errors) {
        Object.values(errors).flat().forEach((err: any) => {
          toast.error(err)
        })
      } else {
        toast.error(errorMessage)
      }
    },
  })

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: uploadStudentPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] })
      toast.success('Rasm muvaffaqiyatli yuklandi')
      setSelectedImage(null)
      setImagePreview(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Rasmni yuklashda xatolik yuz berdi')
    },
  })

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: deleteStudentPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] })
      toast.success('Rasm o\'chirildi')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Rasmni o\'chirishda xatolik yuz berdi')
    },
  })

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileForm)
  }

  // Handle password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('Parol tasdiqlash mos kelmadi')
      return
    }

    updatePasswordMutation.mutate(passwordForm)
  }

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Rasm hajmi 2MB dan oshmasligi kerak')
        return
      }

      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Faqat JPG, JPEG, PNG formatdagi rasmlar qabul qilinadi')
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle photo upload
  const handlePhotoUpload = () => {
    if (selectedImage) {
      uploadPhotoMutation.mutate(selectedImage)
    }
  }

  // Handle photo delete
  const handlePhotoDelete = () => {
    if (window.confirm('Rasmni o\'chirishni xohlaysizmi?')) {
      deletePhotoMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-gray-600">Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            Parol
          </TabsTrigger>
          <TabsTrigger value="photo">
            <Camera className="h-4 w-4 mr-2" />
            Rasm
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
              <CardDescription>
                Telefon raqam, email va boshqa kontakt ma'lumotlarni yangilang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* View Mode */}
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">F.I.SH</Label>
                      <p className="font-medium">{profile?.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Talaba ID</Label>
                      <p className="font-medium">{profile?.student_id_number}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Passport</Label>
                      <p className="font-medium">{profile?.passport_number}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Jinsi</Label>
                      <p className="font-medium">{profile?.gender === 11 ? 'Erkak' : 'Ayol'}</p>
                    </div>
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Telefon</Label>
                      <p className="font-medium">{profile?.phone || 'Kiritilmagan'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="font-medium">{profile?.email || 'Kiritilmagan'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-500">Telegram</Label>
                      <p className="font-medium">{profile?.telegram_username || 'Kiritilmagan'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-500">Joriy manzil</Label>
                      <p className="font-medium">{profile?.current_address || 'Kiritilmagan'}</p>
                    </div>
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Fakultet</Label>
                      <p className="font-medium">{profile?.faculty?.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Guruh</Label>
                      <p className="font-medium">{profile?.group?.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Ta'lim shakli</Label>
                      <p className="font-medium">{profile?.education_form?.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Kirish yili</Label>
                      <p className="font-medium">{profile?.year_of_enter}</p>
                    </div>
                  </div>

                  <Button onClick={() => setIsEditingProfile(true)} className="w-full">
                    Tahrirlash
                  </Button>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+998 90 123-45-67"
                      />
                      <p className="text-sm text-gray-500 mt-1">Misol: +998 90 123-45-67</p>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="student@university.uz"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={profileForm.telegram_username}
                      onChange={(e) => setProfileForm({ ...profileForm, telegram_username: e.target.value })}
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Joriy manzil</Label>
                    <Textarea
                      id="address"
                      value={profileForm.current_address}
                      onChange={(e) => setProfileForm({ ...profileForm, current_address: e.target.value })}
                      placeholder="Toshkent shahar, Yunusobod tumani..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="flex-1"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saqlanmoqda...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Saqlash
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Bekor qilish
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Parolni o'zgartirish</CardTitle>
              <CardDescription>
                Yangi parol kamida 8 ta belgidan iborat bo'lishi va raqamlar bo'lishi kerak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Joriy parol *</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="new_password">Yangi parol *</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Kamida 8 ta belgi, katta-kichik harf va raqam bo'lishi kerak
                  </p>
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Parolni tasdiqlang *</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={passwordForm.password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="w-full"
                >
                  {updatePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      O'zgartirilmoqda...
                    </>
                  ) : (
                    'Parolni o\'zgartirish'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photo Tab */}
        <TabsContent value="photo">
          <Card>
            <CardHeader>
              <CardTitle>Profil rasmi</CardTitle>
              <CardDescription>
                JPG, JPEG yoki PNG formatdagi rasm yuklang (maksimal 2MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-40 w-40">
                  <AvatarImage
                    src={imagePreview || (profile?.image ? `http://localhost:8000/storage/${profile.image}` : '')}
                  />
                  <AvatarFallback className="text-4xl">
                    {profile?.first_name?.[0]}{profile?.second_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                {profile?.image && !selectedImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handlePhotoDelete}
                    disabled={deletePhotoMutation.isPending}
                  >
                    {deletePhotoMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Rasmni o'chirish
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="photo">Yangi rasm tanlang</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                  />
                </div>

                {selectedImage && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePhotoUpload}
                      disabled={uploadPhotoMutation.isPending}
                      className="flex-1"
                    >
                      {uploadPhotoMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Yuklash
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(null)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Bekor qilish
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
