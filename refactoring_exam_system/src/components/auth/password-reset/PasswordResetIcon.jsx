import { Lock, RotateCcw } from 'lucide-react'

function PasswordResetIcon() {
  return (
    <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F7F6] text-[#2AA8A2]">
      <div className="relative flex items-center justify-center">
        <Lock className="h-6 w-6" strokeWidth={2.2} />
        <RotateCcw className="absolute -right-2.5 -top-2.5 h-4 w-4" strokeWidth={2.4} />
      </div>
    </div>
  )
}

export default PasswordResetIcon
