function PasswordResetDescription({ children, className = '' }) {
  return (
    <p className={`mt-4 text-center text-sm leading-7 text-[#6B7280] md:text-[15px] ${className}`}>
      {children}
    </p>
  )
}

export default PasswordResetDescription
