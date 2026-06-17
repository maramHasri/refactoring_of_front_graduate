import { Eye, EyeOff } from 'lucide-react'
import BackToLoginLink from '../../components/auth/password-reset/BackToLoginLink'
import PasswordResetIcon from '../../components/auth/password-reset/PasswordResetIcon'
import PasswordResetShell from '../../components/auth/password-reset/PasswordResetShell'
import PasswordResetTitle from '../../components/auth/password-reset/PasswordResetTitle'
import { useResetPassword } from '../../hooks/useResetPassword'

const inputClassName =
  'h-12 w-full rounded-xl bg-[#EEF2F3] px-4 text-sm text-[#374151] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2AA8A2]/35'

const buttonClassName =
  'h-12 w-full rounded-xl bg-[#2AA8A2] text-base font-bold text-white shadow-[0_12px_24px_rgba(42,168,162,0.24)] transition hover:opacity-95 disabled:opacity-70'

function ResetPasswordPage() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    submit,
  } = useResetPassword()

  return (
    <PasswordResetShell>
      <PasswordResetIcon />
      <PasswordResetTitle>إعادة تعيين كلمة المرور</PasswordResetTitle>

      <form className="mt-10 space-y-6" onSubmit={submit} autoComplete="off">
        <div className="space-y-2.5">
          <label className="block text-sm font-semibold text-[#374151]">كلمة المرور الجديدة</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              autoComplete="new-password"
              className={`${inputClassName} pl-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="block text-sm font-semibold text-[#374151]">تأكيد كلمة المرور</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              className={`${inputClassName} pl-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" disabled={loading} className={buttonClassName}>
          {loading ? 'جاري الحفظ...' : 'الذهاب'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <BackToLoginLink />
      </div>
    </PasswordResetShell>
  )
}

export default ResetPasswordPage
