import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import WelcomeOptionSelector from '../components/auth/WelcomeOptionSelector'
import { REGISTRATION_FLOW, WELCOME_SELECTION } from '../constants/auth'
import { ROUTES } from '../constants/routes'
import { useRegistrationStore } from '../store/registrationStore'
import valuePropSide from '../assets/auth/value-prop-side.png'

function WelcomePage() {
  const navigate = useNavigate()
  const welcome_selection = useRegistrationStore((s) => s.welcome_selection)
  const setWelcomeSelection = useRegistrationStore((s) => s.setWelcomeSelection)
  const setRegistrationFlow = useRegistrationStore((s) => s.setRegistrationFlow)
  const reset = useRegistrationStore((s) => s.reset)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!welcome_selection) {
      setError('يرجى اختيار أحد الخيارين')
      return
    }

    const selection = welcome_selection
    reset()
    setWelcomeSelection(selection)

    if (selection === WELCOME_SELECTION.CREATE_SPACE) {
      setRegistrationFlow(REGISTRATION_FLOW.INSTITUTION)
      navigate(ROUTES.REGISTER_SELECT_ROLE)
      return
    }

    setRegistrationFlow(REGISTRATION_FLOW.STUDENT)
    navigate(ROUTES.STUDENT_REGISTER)
  }

  return (
    <AuthShell
      heroImage={valuePropSide}
      heroAlt="مساحتك التعليمية الخاصة"
      heroImagePosition="center"
      contentAlign="top"
    >
      <div className="flex flex-1 flex-col lg:min-h-full">
        <div>
          <h1 className="text-right text-[32px] font-extrabold leading-[1.2] text-[#2A3433] md:text-[34px]">
            أهلا بك في كويزهاب
          </h1>
          <p className="mt-2 text-right text-sm leading-7 text-[#6B7280] md:text-[15px]">هل تريد ...</p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-6">
          <WelcomeOptionSelector selected={welcome_selection} onSelect={setWelcomeSelection} />
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <p className="mt-7 text-right text-sm text-[#6B7280]">
            لديك حساب بالفعل؟{' '}
            <Link to={ROUTES.LOGIN} className="font-bold text-[#2AA8A2]">
              تسجيل دخول
            </Link>
          </p>
        </div>

        <div className="mb-5 w-full md:w-[448px]">
          <button
            type="button"
            onClick={handleNext}
            className="h-12 w-full rounded-xl bg-[#2AA8A2] text-base font-bold text-white shadow-[0_12px_20px_rgba(42,168,162,0.22)] transition hover:opacity-95"
          >
            التالي
          </button>
        </div>
      </div>
    </AuthShell>
  )
}

export default WelcomePage
