# 📋 Univer-Frontend Rivojlantirish Rejasi

## 🔍 Backend (Yii2) va Frontend (React) Taqqoslash Tahlili

### ✅ Mavjud Frontend Modullar (Yaratilgan)
1. **Dashboard** - Boshqaruv paneli ✅
2. **Students** - Talabalar (List, Groups, Statistics) ✅
3. **Performance** - Akademik baholash (Grades, GPA, Debtors) ✅
4. **Attendance** - Davomat nazorati ✅
5. **Finance** - Moliya (Contracts, Payments, Invoices) ✅
6. **Curriculum** - O'quv rejalari (Plans, Subjects, Schedule) ✅
7. **Teachers** - O'qituvchilar (List, Workload) ✅
8. **Exams** - Imtihonlar ✅
9. **Archive** - Arxiv (Diplomas, Certificates) ✅
10. **Reports** - Hisobotlar ✅
11. **System** - Tizim (Users, Roles) ✅
12. **Settings** - Sozlamalar ✅

---

## ❌ Qolib Ketgan Backend Modullar (Frontendda yo'q)

### 1. **Structure (Tuzilma)** - CRITICAL ⚠️
Backend: `structure` menu
- `structure/university` - OTM haqida
- `structure/faculty` - Fakultetlar
- `structure/department` - Kafedralar
- `structure/section` - Bo'limlar

**Frontend status:** ❌ YO'Q
**Priority:** 🔴 **HIGH** - Tizimning asosiy tuzilmasi

---

### 2. **E-Documents (Elektron Hujjatlar)** - IMPORTANT 📄
Backend: `document` menu
- `document/sign-documents` - Imzo qo'yish uchun hujjatlar

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

### 3. **Employee (Xodimlar Ma'lumotlari)** - CRITICAL ⚠️
Backend: `employee` menu (13 ta submenu)
- `employee/employee` - Xodimlar
- `employee/direction` - Yo'nalishlar
- `employee/teacher` - O'qituvchilar
- `employee/professional-development` - Professional rivojlanish
- `employee/competition` - Tanlovlar
- `employee/academic-degree` - Ilmiy darajalar
- `employee/foreign-training` - Xorijiy treninglar
- `employee/foreign-employee` - Xorijiy xodimlar
- `employee/tutor-group` - Kurator guruhlari
- `employee/department-load` - Kafedra yuklama
- `employee/teacher-load` - O'qituvchi yuklama
- `employee/teacher-load-formation` - Yuklama shakllanishi
- `employee/teacher-load-type` - Yuklama turlari
- `employee/load-monitoring` - Yuklama monitoringi
- `employee/foreign-certificate` - Xorijiy sertifikatlar

**Frontend status:** ⚠️ Faqat `Teachers` (partial) - 2/15 submenu
**Priority:** 🔴 **HIGH**

---

### 4. **Decree/Transfer (Buyruqlar/O'qishni ko'chirish)** - CRITICAL ⚠️
Backend: `transfer` menu (16 ta submenu)
- `decree/index` - Buyruqlar
- `decree/edu-decree` - Ta'lim buyruqlari
- `decree/template` - Shablonlar
- `decree/disciplinary` - Intizomiy
- `transfer/student-group` - Guruhga ko'chirish
- `transfer/student-course-transfer` - Kursga ko'chirish
- `transfer/student-course-expel` - Kurs/semestrdan chetlatish
- `transfer/student-expel` - Chetlatish
- `transfer/student-remove` - Talabani o'chirish
- `transfer/academic-mobile` - Akademik mobillik
- `transfer/academic-leave` - Akademik ta'til
- `transfer/restore` - Qayta tiklash
- `transfer/return` - Qaytarish
- `transfer/graduate` - Bitiruv
- `transfer/graduate-simple` - Oddiy bitiruv
- `transfer/graduate-status` - Bitiruv holati
- `transfer/status` - Holat

**Frontend status:** ❌ YO'Q
**Priority:** 🔴 **HIGH** - Talabalar holatini boshqarish

---

### 5. **Subjects (Fanlar batafsil)** - EXISTS but INCOMPLETE ⚠️
Backend: `subjects` menu (11 ta submenu)
- `curriculum/subject-group` - Fan guruhlari
- `curriculum/subject` - Fanlar
- `teacher/subject-topics` - Fan mavzulari
- `file-resource/index` - Fayl resurslari
- `teacher/subject-tasks` - Fan topshiriqlari
- `teacher/subject-task-other` - Boshqa topshiriqlar
- `teacher/calendar-plan` - Kalendar reja
- `credit/subject-teacher` - Fan o'qituvchisi
- `credit/subject-choose` - Fan tanlash
- `teacher/subject-info` - Fan ma'lumotlari

**Frontend status:** ⚠️ Partial - faqat `curriculum/subjects` (1/11)
**Priority:** 🟡 **MEDIUM**

---

### 6. **Individual Training (Individual Ta'lim)** - MISSING ❌
Backend: `individual-training` menu (4 ta submenu)
- `individual-training/subject-teacher` - Fan o'qituvchilari
- `individual-training/subject-student` - Fan talabalari
- `individual-training/subject-schedule` - Fan jadvali
- `individual-training/subject-attendance` - Fan davomati

**Frontend status:** ❌ YO'Q
**Priority:** 🟢 **LOW**

---

### 7. **Retraining (Qayta tayyorlash/Kredit ta'lim)** - MISSING ❌
Backend: `retraining` menu (13 ta submenu)
- `retraining/retraining` - Ro'yxatga olish
- `retraining/student` - Talabalar ro'yxati
- `retraining/subject-group` - Fan guruhlari
- `retraining/student-register` - Talaba registratsiyasi
- `retraining/schedule` - Jadval
- `retraining/exam-schedule-info` - Imtihon jadvali
- `retraining/time-table` - Mening jadvalim
- `retraining/midterm-exam-table` - Oraliq imtihon
- `retraining/final-exam-table` - Yakuniy imtihon
- `retraining/other-exam-table` - Boshqa imtihonlar
- `retraining/performance` - Baholash
- `retraining/academic-record` - Akademik yozuv
- `retraining/teacher-subject` - O'qituvchi fanlari

**Frontend status:** ❌ YO'Q
**Priority:** 🟢 **LOW**

---

### 8. **Infrastructure (Infratuzilma)** - MISSING ❌
Backend: `infrastructure` menu (6 ta submenu)
- `infrastructure/building` - Binolar
- `infrastructure/auditorium` - Auditoriyalar
- `infrastructure/inventory` - Inventar
- `report/literatures` - Adabiyotlar
- `report/laboratories` - Laboratoriyalar
- `report/projectors` - Proyektorlar

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

### 9. **Science (Ilmiy faoliyat)** - MISSING ❌
Backend: `science` menu (9 ta submenu)
- `science/project` - Ilmiy loyihalar
- `science/publication-methodical` - Metodik nashrlar
- `science/publication-scientifical` - Ilmiy nashrlar
- `science/publication-property` - Mulkiy huquq
- `science/scientific-activity` - Ilmiy faoliyat
- `science/publication-methodical-check` - Metodik tekshirish
- `science/publication-scientifical-check` - Ilmiy tekshirish
- `science/publication-property-check` - Mulkiy tekshirish
- `science/scientific-activity-check` - Faoliyat tekshirish

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

### 10. **Rating (Reyting)** - MISSING ❌
Backend: `rating` menu (6 ta submenu)
- `science/criteria-template` - Mezon shablonlari
- `science/publication-criteria` - Nashr mezonlari
- `science/scientific-activity-criteria` - Faoliyat mezonlari
- `science/teacher-rating` - O'qituvchilar reytingi
- `science/department-rating` - Kafedralar reytingi
- `science/faculty-rating` - Fakultetlar reytingi

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

### 11. **Doctorate (Doktorantura)** - MISSING ❌
Backend: `doctorate` menu (2 ta submenu)
- `science/doctorate-specialty` - Doktorantura mutaxassisligi
- `science/doctorate-student` - Doktorantlar

**Frontend status:** ❌ YO'Q
**Priority:** 🟢 **LOW**

---

### 12. **Scholarship (Stipendiya)** - MISSING ❌
Backend: `scholarship` menu (8 ta submenu)
- `finance/scholarship` - Stipendiyalar
- `finance/scholarship-cancel` - Stipendiya bekor qilish
- `finance/scholarship-protocol` - Stipendiya protokoli
- `finance/scholarship-protocol-check` - Protokol tekshirish
- `decree/decree-info` - Buyruq ma'lumotlari
- `decree/decree-info-agreement` - Buyruq kelishish
- `finance/scholarship-protocol-send` - Protokol yuborish

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

### 13. **Statistical (Statistika)** - PARTIAL ⚠️
Backend: `statistical` menu (12 ta submenu)
- `dashboard/open-data` - Ochiq ma'lumotlar
- `statistical/by-student` - Talabalar bo'yicha
- `statistical/by-student-general` - Umumiy statistika
- `statistical/by-student-social` - Ijtimoiy statistika
- `statistical/by-teacher` - O'qituvchilar bo'yicha
- `file-resource/report` - Fayl resurs hisoboti
- `statistical/by-contract` - Shartnomalar bo'yicha
- `statistical/by-employment` - Bandlik bo'yicha
- `statistical/by-performance` - Baholash bo'yicha
- `statistical/load-stat` - Yuklama statistikasi
- `statistical/by-science` - Ilmiy statistika
- `statistical/by-subject-performance` - Fan bo'yicha baholash

**Frontend status:** ⚠️ Partial - faqat `Reports` (basic)
**Priority:** 🟡 **MEDIUM**

---

### 14. **Poll (So'rovnoma)** - MISSING ❌
Backend: `report/poll` submenu
- `poll/index` - So'rovnomalar
- `poll/mine` - Mening so'rovnomalarim

**Frontend status:** ❌ YO'Q
**Priority:** 🟢 **LOW**

---

### 15. **External Services (Tashqi Xizmatlar)** - MISSING ❌
Backend: `student-data` menu (9 ta submenu)
- `student-data/sync` - Sinxronizatsiya
- `student-data/grant-type` - Grant turlari
- `student-data/welfare` - Ijtimoiy yordam
- `student-data/poverty-level` - Qashshoqlik darajasi
- `student-data/women-registry` - Ayollar reestri
- `student-data/contract` - Shartnomalar
- `student-data/stipend` - Stipendiyalar
- `student-data/plagiarism` - Plagiatizm
- `student/removal-request` - O'chirish so'rovi

**Frontend status:** ❌ YO'Q
**Priority:** 🟢 **LOW**

---

### 16. **Messages (Xabarlar)** - MISSING ❌
Backend: `message` menu (3 ta submenu)
- `message/all-messages` - Barcha xabarlar
- `message/my-messages` - Mening xabarlarim
- `message/compose` - Yangi xabar

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM** - Ichki kommunikatsiya

---

### 17. **Notifications (Bildirishnomalar)** - MISSING ❌
Backend: `notification` menu
- `notification/index` - Bildirishnomalar

**Frontend status:** ❌ YO'Q
**Priority:** 🟡 **MEDIUM**

---

## 📊 Umumiy Statistika

### Backend Modullar
- **Jami asosiy menuLar:** 23 ta
- **Jami submenuLar:** ~200+ ta

### Frontend Modullar
- **Yaratilgan asosiy menuLar:** 12 ta
- **Yaratilgan submenuLar:** ~30 ta
- **To'liq qoplangan:** ~15%
- **Qisman qoplangan:** ~5%
- **Qolib ketgan:** ~80%

---

## 🎯 RIVOJLANTIRISH REJASI (Prioritet bo'yicha)

### 🔴 **PHASE 1: CRITICAL - Asosiy Modullar** (1-2 oy)

#### 1.1 Structure Module (Tuzilma) ⭐⭐⭐⭐⭐
**Pages yaratish:**
```
/structure
├── /university          - OTM haqida
├── /faculties          - Fakultetlar
├── /departments        - Kafedralar
└── /sections           - Bo'limlar
```

**Components:**
- `UniversityInfo` - OTM ma'lumotlari
- `FacultyList` - Fakultetlar ro'yxati
- `FacultyCard` - Fakultet kartasi
- `DepartmentList` - Kafedralar ro'yxati
- `DepartmentTree` - Kafedra daraxti
- `SectionManager` - Bo'limlar boshqaruvi

**API Integration:**
- `GET /api/structure/university`
- `GET /api/structure/faculties`
- `GET /api/structure/departments`
- `GET /api/structure/sections`

---

#### 1.2 Employee Module (Xodimlar) ⭐⭐⭐⭐⭐
**Pages yaratish:**
```
/employees
├── /list               - Xodimlar ro'yxati
├── /teachers          - O'qituvchilar (kengaytirilgan)
├── /academic-degrees  - Ilmiy darajalar
├── /workload          - Yuklama boshqaruvi
├── /monitoring        - Yuklama monitoringi
├── /tutor-groups      - Kurator guruhlari
└── /statistics        - Xodimlar statistikasi
```

**Components:**
- `EmployeeTable` - Xodimlar jadvali
- `EmployeeCard` - Xodim kartasi
- `TeacherProfile` - O'qituvchi profili
- `WorkloadChart` - Yuklama diagrammasi
- `AcademicDegreeManager` - Ilmiy daraja boshqaruvi
- `TutorGroupAssignment` - Kurator biriktirish

**API Integration:**
- `GET /api/employees`
- `GET /api/employees/:id`
- `GET /api/teachers`
- `GET /api/teacher-load`
- `GET /api/academic-degrees`

---

#### 1.3 Decree/Transfer Module (Buyruqlar) ⭐⭐⭐⭐⭐
**Pages yaratish:**
```
/decrees
├── /list              - Buyruqlar ro'yxati
├── /create            - Yangi buyruq
├── /templates         - Shablonlar
└── /disciplinary      - Intizomiy

/transfers
├── /group-transfer    - Guruhga ko'chirish
├── /course-transfer   - Kursga ko'chirish
├── /expulsion         - Chetlatish
├── /academic-leave    - Akademik ta'til
├── /restore           - Qayta tiklash
├── /graduation        - Bitiruv
└── /status            - Holat

```

**Components:**
- `DecreeList` - Buyruqlar ro'yxati
- `DecreeForm` - Buyruq shakli
- `DecreeTemplate` - Buyruq shabloni
- `TransferWizard` - Ko'chirish wizard
- `StudentStatusManager` - Talaba holati boshqaruvi
- `GraduationManager` - Bitiruv boshqaruvi

**API Integration:**
- `GET /api/decrees`
- `POST /api/decrees`
- `GET /api/transfers`
- `POST /api/transfers/:type`

---

### 🟡 **PHASE 2: IMPORTANT - Kengaytiruvchi Modullar** (2-3 oy)

#### 2.1 Extended Subjects Module (Fanlar - to'liq) ⭐⭐⭐⭐
**Pages yaratish:**
```
/subjects
├── /catalog           - Fanlar katalogi (mavjud)
├── /groups            - Fan guruhlari
├── /topics            - Fan mavzulari
├── /tasks             - Fan topshiriqlari
├── /calendar-plan     - Kalendar reja
├── /choose            - Fan tanlash
└── /resources         - Fayl resurslari
```

---

#### 2.2 Infrastructure Module (Infratuzilma) ⭐⭐⭐
**Pages yaratish:**
```
/infrastructure
├── /buildings         - Binolar
├── /auditoriums       - Auditoriyalar
├── /inventory         - Inventar
├── /libraries         - Kutubxonalar
└── /laboratories      - Laboratoriyalar
```

---

#### 2.3 Science Module (Ilmiy faoliyat) ⭐⭐⭐
**Pages yaratish:**
```
/science
├── /projects          - Ilmiy loyihalar
├── /publications      - Nashrlar
│   ├── /methodical    - Metodik
│   ├── /scientific    - Ilmiy
│   └── /property      - Mulkiy huquq
├── /activities        - Ilmiy faoliyat
└── /verification      - Tekshirish
```

---

#### 2.4 Scholarship Module (Stipendiya) ⭐⭐⭐
**Pages yaratish:**
```
/scholarship
├── /list              - Stipendiyalar
├── /protocols         - Protokollar
├── /verification      - Tekshirish
└── /reports           - Hisobotlar
```

---

#### 2.5 Messages & Notifications ⭐⭐⭐
**Pages yaratish:**
```
/messages
├── /inbox             - Kiruvchi
├── /sent              - Yuborilgan
├── /compose           - Yangi xabar
└── /archive           - Arxiv

/notifications
└── /list              - Bildirishnomalar
```

**Components:**
- `MessageList` - Xabarlar ro'yxati
- `MessageComposer` - Xabar yozish
- `NotificationCenter` - Bildirishnoma markazi
- Real-time notifications (WebSocket)

---

#### 2.6 Extended Statistics Module ⭐⭐⭐
**Pages yaratish:**
```
/statistics
├── /students          - Talabalar statistikasi
│   ├── /general       - Umumiy
│   ├── /social        - Ijtimoiy
│   └── /by-faculty    - Fakultet bo'yicha
├── /teachers          - O'qituvchilar statistikasi
├── /contracts         - Shartnomalar
├── /employment        - Bandlik
├── /performance       - Baholash
├── /science           - Ilmiy
└── /workload          - Yuklama
```

---

### 🟢 **PHASE 3: OPTIONAL - Qo'shimcha Modullar** (3-4 oy)

#### 3.1 Individual Training ⭐⭐
```
/individual-training
├── /teachers          - O'qituvchilar
├── /students          - Talabalar
├── /schedule          - Jadval
└── /attendance        - Davomat
```

---

#### 3.2 Retraining (Qayta tayyorlash) ⭐⭐
```
/retraining
├── /programs          - Dasturlar
├── /students          - Talabalar
├── /schedule          - Jadval
├── /exams             - Imtihonlar
└── /performance       - Baholash
```

---

#### 3.3 Doctorate ⭐
```
/doctorate
├── /specialties       - Mutaxassisliklar
└── /students          - Doktorantlar
```

---

#### 3.4 External Services ⭐
```
/external-services
├── /sync              - Sinxronizatsiya
├── /grants            - Grantlar
├── /welfare           - Ijtimoiy yordam
└── /plagiarism        - Plagiatizm
```

---

#### 3.5 E-Documents ⭐
```
/e-documents
├── /pending           - Kutilmoqda
├── /signed            - Imzolangan
└── /archive           - Arxiv
```

---

#### 3.6 Poll System ⭐
```
/polls
├── /list              - So'rovnomalar
├── /create            - Yaratish
├── /results           - Natijalar
└── /my-polls          - Mening so'rovnomalarim
```

---

## 🛠️ Texnik Rejalashtirish

### Komponentlar Arxitekturasi
```
src/
├── pages/
│   ├── structure/
│   ├── employees/
│   ├── decrees/
│   ├── transfers/
│   ├── infrastructure/
│   ├── science/
│   ├── scholarship/
│   ├── messages/
│   └── statistics/
├── components/
│   ├── shared/         - Umumiy komponentlar
│   ├── structure/
│   ├── employees/
│   ├── decrees/
│   └── ...
├── lib/
│   ├── api/
│   │   ├── structure.ts
│   │   ├── employees.ts
│   │   ├── decrees.ts
│   │   └── ...
│   ├── types/
│   │   ├── structure.ts
│   │   ├── employee.ts
│   │   ├── decree.ts
│   │   └── ...
│   └── hooks/
│       ├── useStructure.ts
│       ├── useEmployees.ts
│       └── ...
└── stores/
    ├── structureStore.ts
    ├── employeeStore.ts
    └── decreeStore.ts
```

---

### API Integration Strategy
1. **Backend API Documentation** - OpenAPI/Swagger orqali
2. **Type Generation** - Swagger → TypeScript types
3. **React Query** - Ma'lumotlarni keshlaash va sinxronlashtirish
4. **Axios Interceptors** - Autentifikatsiya va xato qayta ishlash
5. **WebSocket** - Real-time bildirishnomalar

---

### UI/UX Guidelines
1. **Consistent Design System** - Mavjud shadcn/ui komponentlaridan foydalanish
2. **Responsive** - Mobile-first yondashuv
3. **Accessibility** - WCAG 2.1 standartlari
4. **Performance** - Code splitting, lazy loading
5. **Icons** - Lucide React (education-themed)
6. **Color Palette** - Faculty-based gradients

---

## 📅 Timeline (Taxminiy)

| Phase | Muddat | Modullar | Priority |
|-------|--------|----------|----------|
| **Phase 1** | 2 oy | Structure, Employee, Decree/Transfer | 🔴 CRITICAL |
| **Phase 2** | 3 oy | Subjects, Infrastructure, Science, Scholarship, Messages, Statistics | 🟡 IMPORTANT |
| **Phase 3** | 2 oy | Individual Training, Retraining, Doctorate, External Services, E-Docs, Polls | 🟢 OPTIONAL |
| **Total** | **7 oy** | **25+ modullar** | |

---

## ✅ Qadamlar

### 1. Immediate Actions (Bir hafta)
- [ ] Backend API documentation tahlili
- [ ] TypeScript type definitions yaratish
- [ ] Menu tuzilmasini yangilash (sidebar)
- [ ] Routing struktura yaratish

### 2. Phase 1 - Week 1-2: Structure Module
- [ ] Pages yaratish
- [ ] API integration
- [ ] Components
- [ ] Testing

### 3. Phase 1 - Week 3-5: Employee Module
- [ ] Pages yaratish
- [ ] Workload management
- [ ] Academic degrees
- [ ] Testing

### 4. Phase 1 - Week 6-8: Decree/Transfer Module
- [ ] Decree management
- [ ] Transfer workflow
- [ ] Status management
- [ ] Testing

---

## 🎯 Success Metrics
1. **Coverage:** Backend funksiyalarning kamida 90% qoplanishi
2. **Performance:** Har bir sahifa 2 soniyadan kam yuklansa
3. **Mobile:** Barcha sahifalar mobile-friendly
4. **Testing:** Unit test coverage 80%+
5. **User Satisfaction:** Beta test natijalarida 4.5/5+

---

## 📝 Qo'shimcha Eslatmalar

### Qo'llab-quvvatlash Kerak Bo'lgan Texnologiyalar
- **PDF Generation** - Hujjatlar, diplomlar, ma'lumotnomalar
- **Excel Export** - Statistika, hisobotlar
- **File Upload** - Rasm, hujjat, resurslar
- **Signature Integration** - Elektron imzo (E-IMZO)
- **Real-time Updates** - WebSocket/SSE
- **Calendar Integration** - Dars jadvali, imtihonlar

### Security Considerations
- **Role-based Access Control (RBAC)** - Har bir modul uchun
- **Data Encryption** - Shaxsiy ma'lumotlar
- **Audit Logging** - Muhim amallar
- **Session Management** - JWT with refresh tokens

---

**Yaratilgan:** 2025-01-19
**Version:** 1.0
**Author:** AI Development Team

