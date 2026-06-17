import OtpInput from '../../components/auth/OtpInput'
import BackToLoginLink from '../../components/auth/password-reset/BackToLoginLink'
import PasswordResetDescription from '../../components/auth/password-reset/PasswordResetDescription'
import PasswordResetIcon from '../../components/auth/password-reset/PasswordResetIcon'
import PasswordResetShell from '../../components/auth/password-reset/PasswordResetShell'
import PasswordResetTitle from '../../components/auth/password-reset/PasswordResetTitle'
import { usePasswordResetOtp } from '../../hooks/usePasswordResetOtp'

const buttonClassName =
  'h-12 w-full rounded-xl bg-[#2AA8A2] text-base font-bold text-white shadow-[0_12px_24px_rgba(42,168,162,0.24)] transition hover:opacity-95 disabled:opacity-70'

function ForgotPasswordOtpPage() {
  const {
    email,
    digits,
    loading,
    resendLoading,
    error,
    cooldown,
    otpValue,
    updateDigit,
    verify,
    handleResend,
  } = usePasswordResetOtp()

  return (
    <PasswordResetShell>
      <PasswordResetIcon />
      <PasswordResetTitle>إعادة تعيين كلمة المرور</PasswordResetTitle>
      <PasswordResetDescription>
        قمنا بإرسال كود مكون من 6 خانات على العنوان
        <span className="mt-2 block text-base font-semibold text-[#2AA8A2]">{email}</span>
      </PasswordResetDescription>

      <div className="mt-10 space-y-4">
        <label className="block text-center text-sm font-semibold text-[#374151]">رمز التحقق</label>
        <OtpInput digits={digits} onChange={updateDigit} disabled={loading} variant="password-reset" />
      </div>

      {error ? <p className="mt-5 text-center text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={verify}
        disabled={loading || otpValue.length !== 6}
        className={`mt-10 ${buttonClassName}`}
      >
        {loading ? 'جاري التحقق...' : 'تحقق'}
      </button>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || cooldown > 0}
          className="text-sm font-semibold text-[#2AA8A2] disabled:text-[#94A3B8]"
        >
          {resendLoading
            ? 'جاري الإرسال...'
            : cooldown > 0
              ? `إعادة الإرسال خلال ${cooldown} ثانية`
              : 'إعادة إرسال الرمز'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <BackToLoginLink />
      </div>
    </PasswordResetShell>
  )
}

export default ForgotPasswordOtpPage
