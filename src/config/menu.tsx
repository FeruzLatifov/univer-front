/**
 * ⚠️ DEPRECATED: This static menu configuration is NO LONGER USED! ⚠️
 *
 * The application now uses DYNAMIC MENU loaded from the backend API.
 *
 * CURRENT MENU SYSTEM:
 * - API: GET /api/v1/staff/menu (Laravel backend)
 * - Store: src/stores/menuStore.ts (Zustand state management)
 * - Service: src/lib/api/menu.ts (API client)
 * - Config: Backend config/menu.php (Laravel)
 * - Database: e_admin_resource table (permissions)
 *
 * WHY THIS FILE EXISTS:
 * - Kept for reference and backwards compatibility only
 * - DO NOT modify this file to change menu structure
 * - Menu changes should be made in Laravel backend
 *
 * TO CHANGE MENU:
 * 1. Edit: /home/adm1n/univer/univer-back/config/menu.php
 * 2. Update: e_admin_resource database table
 * 3. Clear cache: php artisan cache:clear
 * 4. Frontend will automatically fetch new menu
 *
 * TODO: This file can be safely deleted after confirming no imports exist.
 *
 * @deprecated Use dynamic menu from backend API instead
 * @see src/stores/menuStore.ts
 * @see src/lib/api/menu.ts
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  DollarSign,
  BookOpen,
  UserCheck,
  FileText,
  Archive,
  BarChart3,
  Settings,
  Shield,
  Briefcase,
  Award,
  TrendingUp,
  CreditCard,
  Receipt,
  Library,
  CalendarDays,
  BookOpenCheck,
  School,
  FileCheck,
  Scroll,
  PieChart,
  Users2,
  KeyRound,
  Building2,
  MessageSquare,
  // Talim ikonkalari
  BookMarked,
  Microscope,
  Calculator,
  Code,
  Brain,
  Stethoscope,
  Atom,
  Globe,
  PenTool,
  ClipboardList,
  CalendarCheck,
  Banknote,
  FileSpreadsheet,
  GraduationCap as Diploma,
  FileBarChart,
  UserCog,
  ShieldCheck,
  Cog,
} from 'lucide-react'

export interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  color: string // Tailwind color class
  gradient: string // CSS gradient class
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Boshqaruv paneli',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
    color: 'text-blue-600',
    gradient: 'gradient-science',
  },
  {
    id: 'structure',
    label: 'OTM Tuzilmasi',
    icon: <Building2 className="w-5 h-5" />,
    path: '/structure/university',
    color: 'text-blue-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'structure-university',
        label: 'OTM haqida',
        icon: <Building2 className="w-4 h-4" />,
        path: '/structure/university',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'structure-faculties',
        label: 'Fakultetlar',
        icon: <Building2 className="w-4 h-4" />,
        path: '/structure/faculties',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'structure-departments',
        label: 'Kafedralar',
        icon: <GraduationCap className="w-4 h-4" />,
        path: '/structure/departments',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'decrees',
    label: 'Buyruqlar',
    icon: <FileText className="w-5 h-5" />,
    path: '/decrees',
    color: 'text-blue-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'decrees-list',
        label: 'Buyruqlar ro\'yxati',
        icon: <FileText className="w-4 h-4" />,
        path: '/decrees',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'transfers-list',
        label: 'Ko\'chirishlar',
        icon: <Users className="w-4 h-4" />,
        path: '/transfers',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'students',
    label: 'Talabalar',
    icon: <GraduationCap className="w-5 h-5" />,
    path: '/students',
    color: 'text-green-600',
    gradient: 'gradient-code',
    children: [
      {
        id: 'students-list',
        label: 'Talabalar ro\'yxati',
        icon: <Users className="w-4 h-4" />,
        path: '/students',
        color: 'text-green-600',
        gradient: 'gradient-code',
      },
      {
        id: 'students-groups',
        label: 'O\'quv guruhlari',
        icon: <Users2 className="w-4 h-4" />,
        path: '/students/groups',
        color: 'text-green-600',
        gradient: 'gradient-code',
      },
      {
        id: 'students-stats',
        label: 'Talabalar statistikasi',
        icon: <PieChart className="w-4 h-4" />,
        path: '/students/statistics',
        color: 'text-green-600',
        gradient: 'gradient-code',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Akademik baholash',
    icon: <ClipboardCheck className="w-5 h-5" />,
    path: '/performance',
    color: 'text-amber-600',
    gradient: 'gradient-philosophy',
    children: [
      {
        id: 'performance-grades',
        label: 'Baholar jurnali',
        icon: <PenTool className="w-4 h-4" />,
        path: '/performance',
        color: 'text-amber-600',
        gradient: 'gradient-philosophy',
      },
      {
        id: 'performance-gpa',
        label: 'GPA reytingi',
        icon: <TrendingUp className="w-4 h-4" />,
        path: '/performance/gpa',
        color: 'text-amber-600',
        gradient: 'gradient-philosophy',
      },
      {
        id: 'performance-debtors',
        label: 'Qarzdo r talabalar',
        icon: <FileText className="w-4 h-4" />,
        path: '/performance/debtors',
        color: 'text-amber-600',
        gradient: 'gradient-philosophy',
      },
    ],
  },
  {
    id: 'attendance',
    label: 'Davomat nazorati',
    icon: <CalendarCheck className="w-5 h-5" />,
    path: '/attendance',
    color: 'text-purple-600',
    gradient: 'gradient-math',
  },
  {
    id: 'finance',
    label: 'Moliya boshqaruvi',
    icon: <Banknote className="w-5 h-5" />,
    path: '/finance',
    color: 'text-indigo-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'finance-contracts',
        label: 'O\'quv shartnomalari',
        icon: <FileCheck className="w-4 h-4" />,
        path: '/finance/contracts',
        color: 'text-indigo-600',
        gradient: 'gradient-science',
      },
      {
        id: 'finance-payments',
        label: 'To\'lovlar hisoboti',
        icon: <CreditCard className="w-4 h-4" />,
        path: '/finance/payments',
        color: 'text-indigo-600',
        gradient: 'gradient-science',
      },
      {
        id: 'finance-invoices',
        label: 'Schyot-fakturalar',
        icon: <Receipt className="w-4 h-4" />,
        path: '/finance/invoices',
        color: 'text-indigo-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'curriculum',
    label: 'O\'quv rejalari',
    icon: <BookMarked className="w-5 h-5" />,
    path: '/curriculum',
    color: 'text-purple-600',
    gradient: 'gradient-math',
    children: [
      {
        id: 'curriculum-plans',
        label: 'O\'quv rejalari',
        icon: <Library className="w-4 h-4" />,
        path: '/curriculum',
        color: 'text-purple-600',
        gradient: 'gradient-math',
      },
      {
        id: 'curriculum-subjects',
        label: 'Fanlar katalogi',
        icon: <BookOpenCheck className="w-4 h-4" />,
        path: '/curriculum/subjects',
        color: 'text-purple-600',
        gradient: 'gradient-math',
      },
      {
        id: 'curriculum-schedule',
        label: 'Dars jadvali',
        icon: <CalendarDays className="w-4 h-4" />,
        path: '/curriculum/schedule',
        color: 'text-purple-600',
        gradient: 'gradient-math',
      },
    ],
  },
  {
    id: 'employees',
    label: 'Xodimlar',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/employees',
    color: 'text-blue-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'employees-list',
        label: 'Xodimlar ro\'yxati',
        icon: <Users className="w-4 h-4" />,
        path: '/employees',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'employees-workload',
        label: 'O\'qituvchilar yuklamasi',
        icon: <Briefcase className="w-4 h-4" />,
        path: '/employees/workload',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'employees-degrees',
        label: 'Ilmiy darajalar',
        icon: <Award className="w-4 h-4" />,
        path: '/employees/academic-degrees',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'teachers',
    label: 'O\'qituvchilar',
    icon: <UserCheck className="w-5 h-5" />,
    path: '/teachers',
    color: 'text-blue-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'teachers-list',
        label: 'O\'qituvchilar ro\'yxati',
        icon: <Users className="w-4 h-4" />,
        path: '/teachers',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-subjects',
        label: 'Fanlarim',
        icon: <BookOpen className="w-4 h-4" />,
        path: '/teacher/subjects',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-schedule',
        label: 'Dars jadvali',
        icon: <Calendar className="w-4 h-4" />,
        path: '/teacher/schedule',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-workload',
        label: 'Yuklama',
        icon: <Briefcase className="w-4 h-4" />,
        path: '/teacher/workload',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-attendance',
        label: 'Davomat',
        icon: <CalendarCheck className="w-4 h-4" />,
        path: '/teacher/attendance',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-grades',
        label: 'Baholar',
        icon: <Award className="w-4 h-4" />,
        path: '/teacher/grades',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teachers-assignments',
        label: 'Topshiriqlar',
        icon: <ClipboardList className="w-4 h-4" />,
        path: '/teacher/assignments',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teachers-tests',
        label: 'Testlar',
        icon: <Brain className="w-4 h-4" />,
        path: '/teacher/tests',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-resources',
        label: 'O\'quv materiallari',
        icon: <FileText className="w-4 h-4" />,
        path: '/teacher/resources',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-topics',
        label: 'Mavzular',
        icon: <BookMarked className="w-4 h-4" />,
        path: '/teacher/topics',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-exams',
        label: 'Imtihonlar',
        icon: <School className="w-4 h-4" />,
        path: '/teacher/exams',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-reports',
        label: 'Hisobotlar',
        icon: <BarChart3 className="w-4 h-4" />,
        path: '/teacher/reports',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'teacher-forum',
        label: 'Forum',
        icon: <MessageSquare className="w-4 h-4" />,
        path: '/teacher/forum',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'exams',
    label: 'Imtihonlar',
    icon: <School className="w-5 h-5" />,
    path: '/exams',
    color: 'text-purple-600',
    gradient: 'gradient-math',
  },
  {
    id: 'archive',
    label: 'Arxiv hujjatlari',
    icon: <Archive className="w-5 h-5" />,
    path: '/archive',
    color: 'text-indigo-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'archive-diplomas',
        label: 'Diplomlar',
        icon: <Diploma className="w-4 h-4" />,
        path: '/archive/diplomas',
        color: 'text-indigo-600',
        gradient: 'gradient-science',
      },
      {
        id: 'archive-certificates',
        label: 'Sertifikatlar',
        icon: <FileCheck className="w-4 h-4" />,
        path: '/archive/certificates',
        color: 'text-indigo-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Hisobotlar',
    icon: <FileBarChart className="w-5 h-5" />,
    path: '/reports',
    color: 'text-blue-600',
    gradient: 'gradient-science',
  },
  {
    id: 'system',
    label: 'Tizim boshqaruvi',
    icon: <ShieldCheck className="w-5 h-5" />,
    path: '/system',
    color: 'text-blue-600',
    gradient: 'gradient-science',
    children: [
      {
        id: 'system-users',
        label: 'Foydalanuvchilar',
        icon: <UserCog className="w-4 h-4" />,
        path: '/system/users',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
      {
        id: 'system-roles',
        label: 'Rollar va ruxsatlar',
        icon: <KeyRound className="w-4 h-4" />,
        path: '/system/roles',
        color: 'text-blue-600',
        gradient: 'gradient-science',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Tizim sozlamalari',
    icon: <Cog className="w-5 h-5" />,
    path: '/settings',
    color: 'text-gray-600',
    gradient: 'gradient-science',
  },
]
