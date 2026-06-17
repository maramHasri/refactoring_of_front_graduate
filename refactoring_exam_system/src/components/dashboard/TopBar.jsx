import { Bell, HelpCircle, Search } from 'lucide-react'
import { getActiveMembership } from '../../lib/workspaceContext'
import { useAuthStore } from '../../store/authStore'
import UserAvatar from './UserAvatar'

const iconButtonClassName =
  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F6F8F9] hover:text-[#64748B]'

function TopBar({ searchPlaceholder = 'البحث في المواد الدراسية...' }) {
  const user = useAuthStore((s) => s.user)
  const membership = getActiveMembership()
  const workspaceName = membership?.workspace?.name || ''

  return (
    <header className="flex h-20 shrink-0 items-center border-b border-[#E5E9EB] bg-[#F8FAFC]/80">
      <div
        dir="ltr"
        className="mx-auto flex h-20 w-full max-w-[1024px] items-center justify-between px-8"
      >
        <div className="flex h-10 shrink-0 items-center gap-3">
          <div className="flex h-10 w-[154px] shrink-0 items-center gap-2 overflow-hidden">
            <UserAvatar user={user} size="sm" />
            <div dir="rtl" className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold leading-tight text-[#2AA8A2]">
                {user?.full_name || 'مستخدم'}
              </p>
              {workspaceName ? (
                <p className="mt-0.5 truncate text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#94A3B8]">
                  {workspaceName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="h-8 w-px shrink-0 bg-[#E5E9EB]" />

          <button type="button" className={iconButtonClassName} aria-label="مساعدة">
            <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </button>

          <button type="button" className={iconButtonClassName} aria-label="إشعارات">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>

        <div className="flex h-9 w-[697px] shrink-0 items-center justify-end">
          <div className="relative h-9 w-[448px] shrink-0">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="search"
              dir="rtl"
              placeholder={searchPlaceholder}
              className="h-9 w-[448px] rounded-full bg-[#F3F5F6] pr-10 pl-3 text-sm text-[#374151] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2AA8A2]/25"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
