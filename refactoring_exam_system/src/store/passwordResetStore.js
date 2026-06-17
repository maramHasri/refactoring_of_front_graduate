import { create } from 'zustand'

const initialState = {
  email: '',
  otpVerified: false,
  resetCompleted: false,
}

export const usePasswordResetStore = create((set) => ({
  ...initialState,

  setEmail: (email) => set({ email }),
  setOtpVerified: (otpVerified) => set({ otpVerified }),
  setResetCompleted: (resetCompleted) => set({ resetCompleted }),
  reset: () => set(initialState),
}))
