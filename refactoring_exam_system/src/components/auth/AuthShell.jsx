import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import AuthHeroPanel from './AuthHeroPanel'

function AuthShell({
  children,
  heroImage,
  heroAlt = '',
  heroImagePosition = 'center',
  contentAlign = 'center',
}) {
  const contentClassName =
    contentAlign === 'top'
      ? 'justify-start pt-8 md:pt-10 lg:pt-14'
      : 'justify-center'

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8F9] px-4 py-6 font-sans text-[#1F2533] md:px-8">
      <header dir="ltr" className="mx-auto flex w-full max-w-[1240px] items-center justify-between">
        <p className="text-sm text-[#6B7280]">ملاذك الأكاديمي</p>
        <Link to={ROUTES.HOME} className="text-[28px] font-extrabold leading-none text-[#2AA8A2]">
          QuizHub
        </Link>
      </header>

      <section className="mx-auto mt-8 w-full max-w-[1240px]">
        <div
          dir="ltr"
          className="mx-auto flex w-full max-w-[1152px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:h-[700px] lg:flex-row"
        >
          <div
            dir="rtl"
            className={`flex w-full flex-col p-8 md:px-10 md:py-10 lg:h-[700px] lg:w-[576px] lg:overflow-y-auto lg:py-12 ${contentClassName}`}
          >
            {children}
          </div>

          {/* شق الصورة — يمين */}
          <AuthHeroPanel image={heroImage} alt={heroAlt} imagePosition={heroImagePosition} />
        </div>
      </section>

      <footer
        dir="ltr"
        className="mx-auto mt-10 flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 text-xs text-[#6B7280]"
      >
        <p>© 2024 إدو أسيس. جميع الحقوق محفوظة.</p>
        <div className="flex flex-wrap items-center gap-6">
          <a href="#">تواصل مع الدعم</a>
          <a href="#">ملفات التعريف</a>
          <a href="#">شروط الخدمة</a>
          <a href="#">سياسة الخصوصية</a>
        </div>
      </footer>
    </main>
  )
}

export default AuthShell
