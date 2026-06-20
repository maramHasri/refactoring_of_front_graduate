# QuizHub — توثيق المشروع (Frontend)

> **الغرض:** مرجع شامل لاستكمال العمل على جهاز آخر أو في محادثة Cursor جديدة.  
> **آخر تحديث:** يونيو 2026  
> **مسار المشروع:** `refactoring_exam_system/refactoring_exam_system/`  
> **Backend منفصل:** `refactoring_of_graduating_project/` (Flask على `http://127.0.0.1:5000`)

---

## 1. نظرة عامة

**QuizHub** منصة تعليمية (اختبارات، مواد، بنوك أسئلة) بواجهة **عربية RTL**.

| البند | القيمة |
|-------|--------|
| Framework | React 19 + Vite 8 |
| Routing | React Router 7 |
| State | Zustand (+ persist لـ auth) |
| HTTP | Axios |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| لغة الكود | JavaScript (JSX) — بدون TypeScript |

### مبدأ المعمارية

```
pages/        → تجميع الشاشات (composition فقط)
components/   → واجهة المستخدم
hooks/        → منطق الشاشات
services/     → استدعاءات API
store/        → حالة Zustand
lib/          → أدوات مشتركة (axios, auth, permissions, ...)
constants/    → routes, auth enums, ...
```

**قواعد ثابتة اتُّفق عليها:**
- لا تغيير Architecture بدون طلب صريح
- لا stores مكررة
- لا ملفات services مكررة
- RTL دائماً في الواجهات العربية
- لون العلامة: `#2AA8A2`
- حقول النماذج: فارغة + placeholder (لا autofill للإيميل/كلمة المرور)

---

## 2. التشغيل المحلي

```bash
cd refactoring_exam_system
npm install
npm run dev      # Vite — غالباً http://localhost:5173 أو 5174
npm run lint
npm run build
```

| متغير | الافتراضي | الوصف |
|-------|-----------|--------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:5000` | عنوان Flask API |

**ملاحظة:** بدون Backend شغّال، تظهر أخطاء شبكة عند Login/API.

---

## 3. Design System (UI Kit)

### ألوان رئيسية

| الاستخدام | Hex |
|-----------|-----|
| Brand / Primary | `#2AA8A2` |
| نص رئيسي | `#2A3433`, `#374151` |
| نص ثانوي | `#64748B`, `#94A3B8` |
| خلفية صفحة | `#F6F8F9` |
| خلفية حقول | `#EEF2F3`, `#F3F5F6` |
| حدود | `#E5E9EB`, `#EEF2F3` |
| خلفية نشط | `#E8F7F6` |

### Typography

- خطوط: `Cairo`, `Tajawal` (في `index.css`)
- عناوين: `font-extrabold`
- حقول: `text-sm`, `rounded-xl`

### أنماط حقول الإدخال المتكررة

```js
const inputClassName =
  'h-12 w-full rounded-xl bg-[#EEF2F3] px-4 text-sm text-[#374151] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2AA8A2]/40 md:w-[448px]'
```

### AuthShell

غلاف موحّد لصفحات التسجيل/الدخول:
- `contentAlign="top"` | `"center"`
- شريط QuizHub بلون `#2AA8A2` موحّد (ليس split colors)
- صورة hero على اليمين

---

## 4. هيكل المجلدات

```
src/
├── main.jsx                 # bootstrap auth + render
├── App.jsx                  # كل المسارات
├── index.css                # Tailwind + fonts
│
├── constants/
│   ├── routes.js            # كل ROUTES
│   ├── auth.js              # WORKSPACE_KIND, flows, OTP, password rules
│   └── passwordReset.js
│
├── store/
│   ├── authStore.js         # tokens, user, memberships (persist)
│   ├── registrationStore.js # flow التسجيل متعدد الخطوات
│   ├── passwordResetStore.js
│   └── toastStore.js
│
├── lib/
│   ├── axios.js             # interceptors + token refresh
│   ├── authSession.js       # bootstrap, schedule refresh, queue
│   ├── token.js             # JWT expiry helpers
│   ├── richText.js          # محرر نص السؤال
│   ├── apiError.js          # parseApiError + رسائل عربية
│   ├── workspaceContext.js  # صلاحيات + active membership
│   ├── workspaceTeachers.js # normalize teachers API
│   ├── questionBanks.js     # tabs, filters, labels
│   ├── subjectDisplay.js    # teacher names, avatars
│   ├── postLoginNavigation.js
│   └── membershipLabel.js
│
├── services/
│   ├── auth.service.js
│   ├── subjects.service.js
│   ├── questionBanks.service.js
│   ├── workspaces.service.js
│   └── join.service.js
│
├── hooks/
│   ├── useRegisterFlow.js
│   ├── useStudentRegisterFlow.js
│   ├── useForgotPassword.js
│   ├── usePasswordResetOtp.js
│   ├── useResetPassword.js
│   ├── useOtpVerification.js
│   ├── usePasswordValidation.js
│   ├── useInstitutionApprovalPolling.js
│   ├── subjects/
│   │   ├── useSubjects.js
│   │   └── useSubjectDetails.js
│   └── question-banks/
│       └── useQuestionBanks.js
│
├── pages/                   # صفحات كاملة
├── components/              # مكونات UI
└── assets/                  # صور auth, landing
```

---

## 5. المسارات (Routes)

| المسار | الصفحة | محمي؟ |
|--------|--------|-------|
| `/` | LandingPage | لا |
| `/login` | LoginPage | لا |
| `/welcome` | WelcomePage | لا |
| `/forgot-password` | ForgotPasswordPage | لا |
| `/forgot-password/otp` | ForgotPasswordOtpPage | لا |
| `/reset-password` | ResetPasswordPage | لا |
| `/reset-password/success` | ResetPasswordSuccessPage | لا |
| `/register/*` | تدفق التسجيل | لا |
| `/student/register` | StudentRegisterPage | لا |
| `/student/join-code` | StudentJoinCodePage | لا |
| `/join` | JoinPage | يحتاج token |
| `/path-selection` | PathSelectionPage | يحتاج token |
| `/dashboard` | DashboardPage | DashboardGuard |
| `/subjects` | SubjectsPage | DashboardGuard |
| `/subjects/:id` | SubjectDetailsPage | DashboardGuard |
| `/question-banks` | QuestionBanksPage | DashboardGuard |
| `/question-banks/:id/editor` | QuestionBankEditorPage | DashboardGuard |

**DashboardGuard** (`components/dashboard/DashboardGuard.jsx`):
1. لا `access_token` → `/login`
2. عدة memberships بدون اختيار → `/path-selection`
3. `role === STUDENT` → `/` (via `canAccessDashboard()`)

---

## 6. إدارة الحالة (Stores)

### `authStore` — `quizhub-auth` في localStorage

```js
{
  access_token,
  refresh_token,
  user,              // { id, full_name, email, avatar_url, is_superadmin, ... }
  memberships,       // [{ membership_id, role, workspace, is_owner, ... }]
  selected_membership_id,
  requires_workspace_selection,
}
```

| Action | الاستخدام |
|--------|-----------|
| `setAuth(payload)` | بعد login/register — يضبط كل شيء |
| `setTokens({ access_token, refresh_token, user })` | بعد refresh |
| `setSelectedMembership(id)` | اختيار workspace |
| `clearAuth()` | logout |

### `registrationStore`

يحمل بيانات التسجيل عبر الخطوات (غير persist):
`registration_flow`, `welcome_selection`, `workspace_kind`, `full_name`, `email`, `phone_number`, `workspace_name`, `password`, `join_code`, ...

### `passwordResetStore`

`email`, `otpVerified`, `resetCompleted` — لتدفق نسيان كلمة المرور.

### `toastStore`

إشعارات UI عبر `components/common/Toast.jsx` في DashboardLayout.

---

## 7. المصادقة وتجديد التوكن

### تدفق Login

1. `POST /auth/login` → `setAuth(data)`
2. `resolvePostLoginRoute()`:
   - memberships > 1 → `/path-selection`
   - membership واحد → `/dashboard`
3. حقول Login: `autoComplete="off"`, placeholder عربي، password `autoComplete="new-password"`

### تجديد Access Token (شفاف للمستخدم)

**الملفات:** `lib/authSession.js`, `lib/axios.js`, `lib/token.js`, `services/auth.service.js`

```
main.jsx:
  waitForAuthHydration() → bootstrapAuth() → initAuthSession()

bootstrapAuth:
  إذا refresh_token موجود و access منتهي → POST /auth/refresh

initAuthSession:
  - setTimeout قبل انتهاء access بـ 60 ثانية
  - visibilitychange → refresh عند العودة للتبويب
  - subscribe على authStore → إعادة جدولة

axios request interceptor:
  ensureValidAccessToken() قبل كل طلب (ما عدا auth routes)

axios response interceptor:
  401 → enqueueTokenRefresh() → إعادة الطلب مرة واحدة
  فشل refresh → redirect /login

enqueueTokenRefresh:
  queue للطلبات المتزامنة — refresh واحد فقط
```

**مهم:** `refreshAccessToken` يستخدم `axios` مباشرة (ليس `api` instance) لتجنب حلقة interceptors.

**Response refresh:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "user": { ... }
}
```

### Headers على كل طلب API

```
Authorization: Bearer {access_token}
X-Workspace-Id: {selected workspace id}
```

---

## 8. تدفقات التسجيل

### A. إنشاء مساحة تعليمية (Institution)

```
/welcome
  → اختيار "إنشاء مساحة تعليمية"
/register/select-role
  → INSTITUTION | SOLO + الاسم + البريد + الهاتف
/register/password
  → اسم المؤسسة (INSTITUTION) + كلمة مرور + تأكيد
/register/otp
  → POST /auth/verify-otp
/register/success
```

### B. الانضمام كطالب

```
/welcome → "الانضمام كطالب"
/student/register → بيانات + كلمة مرور
/student/join-code → كود الانضمام
```

### حقول النماذج

- `autoComplete="off"` على النماذج
- `autoComplete="new-password"` على حقول كلمة المرور
- placeholders عربية بدل autofill

---

## 9. نسيان كلمة المرور

| الخطوة | Route | API |
|--------|-------|-----|
| 1 | `/forgot-password` | `POST /auth/forgot-password` |
| 2 | `/forgot-password/otp` | `POST /auth/verify-otp` |
| 3 | `/reset-password` | `POST /auth/reset-password` |
| 4 | `/reset-password/success` | — |

**Hooks:** `useForgotPassword`, `usePasswordResetOtp`, `useResetPassword`  
**Components:** `components/auth/password-reset/*`  
**Shell:** `PasswordResetShell.jsx`

---

## 10. Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ TopBar (h-80, max-w-1024, bg #F8FAFC/80)               │
├──────────────┬──────────────────────────────────────────┤
│ Sidebar      │ Main content (Outlet)                    │
│ w-260px      │ p-6, bg #F6F8F9                          │
│              │                                          │
│ QuizHub logo │                                          │
│ Nav items    │                                          │
│ Logout       │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### TopBar (`components/dashboard/TopBar.jsx`)

**ترتيب LTR داخل container (محاذاة Figma):**

| الجانب | المحتوى | الأبعاد |
|--------|---------|---------|
| يسار | صورة + اسم + مؤسسة + \| + مساعدة + إشعارات | user block: 154×40 |
| يمين | حقل بحث | area: 697×36, input: 448×36 |

- `justify-between`, `px-8` (32px padding)
- `UserAvatar`: صورة أو أول حرف من `user.full_name`
- البحث: placeholder فقط — **غير موصول بـ API بعد**

### Sidebar (`components/dashboard/Sidebar.jsx`)

- عرض: `260px`
- ارتفاع header الشعار: `h-20` (80px) — متوافق مع TopBar
- spacing محسّن (py-8, space-y-2, py-3.5 للعناصر)

**عناصر القائمة:**

| Label | Route | ملاحظات |
|-------|-------|---------|
| لوحة التحكم | `/dashboard` | |
| إدارة المواد | `/subjects` | `canAccessSubjectsModule()` |
| بنوك الأسئلة | `/question-banks` | `canAccessQuestionBanks()` |
| الامتحانات | `#` | disabled |
| الإحصائيات | `#` | disabled |
| الإعدادات | `#` | disabled |
| تسجيل الخروج | — | `clearAuth()` |

---

## 11. الصلاحيات (`lib/workspaceContext.js`)

| Function | من يرى؟ |
|----------|---------|
| `canAccessDashboard()` | ليس STUDENT |
| `canAccessSubjectsModule()` | ليس STUDENT؛ TEACHER في INSTITUTION → ❌ |
| `canAccessQuestionBanks()` | ليس STUDENT؛ superadmin → ❌ |
| `canCreateSubject()` | SOLO: ✅؛ INSTITUTION: owner/admin فقط |
| `canEditSubject()` | = canCreateSubject |
| `canAssignTeachers()` | INSTITUTION + owner/admin |
| `canManageQuestionBank(bank)` | منشئ البنك أو owner/admin |
| `isInstitutionWorkspace()` | workspace.kind === INSTITUTION |

**Active membership:** `getActiveMembership()` من `selected_membership_id` أو أول membership.

---

## 12. إدارة المواد (Subjects)

### قائمة المواد — `/subjects`

**Page:** `pages/subjects/SubjectsPage.jsx`  
**Hook:** `hooks/subjects/useSubjects.js`  
**API:** `GET /subjects`

| ميزة | API | صلاحية |
|------|-----|--------|
| عرض جدول | GET /subjects | canAccessSubjectsModule |
| إنشاء | POST /subjects | canCreateSubject |
| تعديل | PATCH /subjects/:id | canEditSubject |
| تفاصيل | navigate `/subjects/:id` | — |

**Components:**
- `SubjectStatsCards` — إحصائيات (بعضها placeholder `—`)
- `SubjectsTable`
- `CreateSubjectModal`, `EditSubjectModal`

### تفاصيل المادة — `/subjects/:id`

**Page:** `pages/subjects/SubjectDetailsPage.jsx`  
**Hook:** `hooks/subjects/useSubjectDetails.js`

**APIs متوازية:**
```
GET /subjects/:id
GET /subjects/:id/teachers
GET /subjects/:id/question-banks
GET /subjects/:id/students
```

**4 Tabs:**

| Tab | Component | حالة |
|-----|-----------|------|
| نظرة عامة | SubjectOverviewTab | ✅ |
| المعلمون | SubjectTeachersTab | ✅ إزالة معلم |
| بنوك الأسئلة | SubjectQuestionBanksTab | ✅ عرض فقط |
| الاختبارات | SubjectExamsTab | ⚠️ placeholder وهمي |

**إسناد معلم:**
- `AssignTeacherModal` → `GET /workspaces/teachers` → `POST /subjects/:id/teachers`
- body: `{ membership_id }` — **Backend أُصلح** لإرجاع `membership_id`
- normalize في `lib/workspaceTeachers.js`

**إزالة معلم:** `DELETE /subjects/:id/teachers/:membershipId`

---

## 13. بنوك الأسئلة (Question Banks)

### قائمة البنوك — `/question-banks`

**Page:** `pages/question-banks/QuestionBanksPage.jsx`  
**Hook:** `hooks/question-banks/useQuestionBanks.js`

**3 Tabs:**

| Tab | ID | API | فلتر |
|-----|-----|-----|------|
| بنوكي | `my` | GET /question-banks/my | PRIVATE فقط |
| بنوك ضمن المؤسسة | `workspace` | /my + /workspace | WORKSPACE — **مخفي لـ SOLO** |
| مجتمع | `community` | GET /question-banks/community | — |

**إجراءات:**
| Action | API |
|--------|-----|
| إنشاء | POST /question-banks |
| تعديل | PATCH /question-banks/:id |
| أرشفة | DELETE /question-banks/:id |
| فتح محرر | navigate `/:id/editor` |

**Visibility:** `PRIVATE` | `WORKSPACE` | `COMMUNITY`

### محرر البنك — `/question-banks/:id/editor`

**Page:** `pages/question-banks/QuestionBankEditorPage.jsx`

**Flow:**
1. تحميل البنك + أسئلته
2. بناء أسئلة محلياً (`localQuestions`)
3. نشر: PATCH visibility + POST questions

**أنواع الأسئلة:**
- `MCQ` — اختيار واحد
- `TRUE_FALSE` — صح/خطأ
- `MULTI_SELECT` — متعدد الخيارات
- `ESSAY` — مقالي

**Components:**
- `QuestionBuilderForm` — نوع، صعوبة، علامة، خيارات
- `QuestionBodyEditor` — محرر نص غني
- `QuestionsList`, `PreviewQuestionsModal`
- `PublishQuestionBankModal`
- `TopicsPlaceholder` — ⚠️ غير مربوط

### محرر نص السؤال (`QuestionBodyEditor.jsx`)

**Toolbar:**

| الرمز | الوظيفة | حالة نشطة |
|-------|---------|-----------|
| U | Underline | ✅ |
| B | Bold | ✅ |
| I | Italic | ✅ |
| List | قائمة نقطية | ✅ |
| Σ | إدراج رمز Σ | — |
| ¶→ | اتجاه فقرة RTL | ✅ |
| ¶← | اتجاه فقرة LTR | ✅ |

- `contentEditable` — body يُحفظ كـ **HTML**
- `lib/richText.js`: `applyParagraphDirection`, `getRichTextActiveFormats`
- dropdown "الموضوع" — **disabled** (ينتظر API topics)
- dropdown نوع السؤال — منقول للـ toolbar

**Validation:** `isRichTextEmpty()` في `QuestionBankEditorPage`

---

## 14. ملخص APIs

### Auth
```
POST /auth/login
POST /auth/register
POST /auth/verify-otp
POST /auth/resend-otp
POST /auth/refresh          ← body: { refresh_token }
POST /auth/forgot-password
POST /auth/reset-password
```

### Subjects
```
GET|POST        /subjects
GET|PATCH       /subjects/:id
GET             /subjects/:id/teachers
POST            /subjects/:id/teachers     { membership_id }
DELETE          /subjects/:id/teachers/:membershipId
GET             /subjects/:id/question-banks
GET             /subjects/:id/students
```

### Question Banks
```
POST            /question-banks
GET             /question-banks/my
GET             /question-banks/workspace
GET             /question-banks/community
PATCH           /question-banks/:id
DELETE          /question-banks/:id        (archive)
GET             /question-banks/:id/questions
POST            /question-banks/:id/questions   { questions: [...] }
```

### Workspaces
```
GET             /workspaces/teachers
```

---

## 15. ما لم يُنفَّذ بعد (TODO)

| الميزة | الموقع | ملاحظة |
|--------|--------|--------|
| بحث TopBar | TopBar.jsx | UI فقط |
| إشعارات / مساعدة | TopBar | أزرار بدون logic |
| الامتحانات | Sidebar + SubjectExamsTab | disabled / placeholder |
| الإحصائيات | Sidebar | disabled |
| الإعدادات | Sidebar | disabled |
| Topics في محرر البنك | TopicsPlaceholder | ينتظر API |
| dropdown الموضوع في toolbar | QuestionBodyEditor | disabled |
| Pagination بنوك الأسئلة | QuestionBanksPage | — |
| إحصائيات المواد في الجدول | SubjectsTable | أعمدة `—` |
| Route guard TEACHER مؤسسة على `/subjects` URL مباشر | — | مذكور سابقاً |
| Pagination tabs بنوك | — | — |
| Admin يرى PRIVATE banks في "بنوكي" | — | لا API |

---

## 16. Backend (مستودع منفصل)

**المسار:** `c:\Users\Lenovo\refactoring_of_graduating_project`

**تعديل مهم سابق:**
- `workspace_service.py` — `_serialize_workspace_teacher` أُضيف له `membership_id` (لإسناد المعلم)

**تشغيل Backend:**
```bash
# حسب إعداد المشروع Flask
python app.py  # أو flask run
```

---

## 17. أخطاء شائعة

| المشكلة | السبب | الحل |
|---------|-------|------|
| Network Error | Backend متوقف | شغّل Flask على :5000 |
| 401 متكرر | refresh_token منتهي | login من جديد |
| Assign teacher فاشل | membership_id ناقص | تأكد Backend محدّث |
| CORS | origin غير مسموح | Backend CORS config |

**رسائل الأخطاء:** `lib/apiError.js` — `parseApiError()` يترجم للعربية.

---

## 18. Welcome Page — تخطيط (مرجع UI)

**ملف:** `pages/WelcomePage.jsx`

- 3 مناطق: عنوان أعلى | خيارات + login في الوسط | زر التالي أسفل
- `WelcomeOptionSelector`: `space-y-7`, `-mt-3` على "إنشاء مساحة تعليمية"
- `AuthShell contentAlign="top"`

---

## 19. كيف تستكمل على جهاز آخر

1. **Clone** المستودع (frontend + backend)
2. `npm install` في `refactoring_exam_system/`
3. أنشئ `.env` إذا لزم:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```
4. شغّل Backend ثم `npm run dev`
5. **اقرأ هذا الملف** + افتح `App.jsx` + `lib/workspaceContext.js`
6. في Cursor جديد، أرفق هذا الملف أو قل: "اقرأ PROJECT_DOCUMENTATION.md"

### ملفات حرجة — لا تكسرها

```
lib/axios.js
lib/authSession.js
lib/workspaceContext.js
store/authStore.js
components/dashboard/DashboardLayout.jsx
components/dashboard/TopBar.jsx
components/dashboard/Sidebar.jsx
```

---

## 20. Git / Commits

- لا commits تلقائية — فقط عند طلب المستخدم
- `lint` و `build` يمرّان قبل أي PR

---

## 21. خريطة المكونات حسب الميزة

```
Auth & Register
├── pages/LoginPage.jsx
├── pages/WelcomePage.jsx
├── pages/register/*
├── pages/student/*
├── pages/auth/*                    (forgot password)
├── components/auth/*
└── hooks/useRegisterFlow.js

Dashboard Shell
├── components/dashboard/DashboardLayout.jsx
├── components/dashboard/TopBar.jsx
├── components/dashboard/Sidebar.jsx
├── components/dashboard/UserAvatar.jsx
└── components/dashboard/DashboardGuard.jsx

Subjects
├── pages/subjects/*
├── components/subjects/*
├── hooks/subjects/*
└── services/subjects.service.js

Question Banks
├── pages/question-banks/*
├── components/question-banks/*
├── components/question-banks/editor/*
├── hooks/question-banks/*
├── services/questionBanks.service.js
└── lib/richText.js
```

---

*نهاية التوثيق — QuizHub Frontend*
