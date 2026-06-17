import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SEC } from '../constants/auth'
import { PASSWORD_RESET_PURPOSE } from '../constants/passwordReset'
import { ROUTES } from '../constants/routes'
import { forgotPassword, verifyOtp } from '../services/auth.service'
import { usePasswordResetStore } from '../store/passwordResetStore'

export function usePasswordResetOtp() {
  const navigate = useNavigate()
  const email = usePasswordResetStore((s) => s.email)
  const setOtpVerified = usePasswordResetStore((s) => s.setOtpVerified)

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const otpValue = digits.join('')

  const updateDigit = (index, value) => {
    const sanitized = value.replace(/\D/g, '').slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = sanitized
      return next
    })
  }

  const verify = useCallback(async () => {
    if (otpValue.length !== OTP_LENGTH) {
      setError('يرجى إدخال رمز التحقق المكوّن من 6 أرقام')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await verifyOtp({ email, otp: otpValue })

      if (result.purpose && result.purpose !== PASSWORD_RESET_PURPOSE) {
        setError('رمز التحقق غير صالح لإعادة تعيين كلمة المرور')
        return
      }

      setOtpVerified(true)
      navigate(ROUTES.RESET_PASSWORD)
    } catch (err) {
      const match = err.message.match(/(\d+)\s*attempts?\s*remaining/i)
      if (match) {
        setError(`رمز التحقق غير صحيح — ${match[1]} محاولات متبقية`)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [email, navigate, otpValue, setOtpVerified])

  const handleResend = async () => {
    if (cooldown > 0 || !email) return

    setResendLoading(true)
    setError('')

    try {
      await forgotPassword({ email })
      setCooldown(OTP_RESEND_COOLDOWN_SEC)
      setDigits(Array(OTP_LENGTH).fill(''))
    } catch (err) {
      setError(err.message)
    } finally {
      setResendLoading(false)
    }
  }

  return {
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
  }
}
