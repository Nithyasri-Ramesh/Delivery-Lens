import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [gpsLocation, setGpsLocation] = useState(null)
  const [authStep, setAuthStep]       = useState('login') // 'login' | 'otp' | 'gps' | 'done'
  const [pendingPhone, setPendingPhone] = useState('')

  // Rehydrate from localStorage on cold start
  useEffect(() => {
    const token      = localStorage.getItem('deliveriq_token')
    const phone      = localStorage.getItem('deliveriq_phone')
    const storedGps  = localStorage.getItem('deliveriq_gps')

    if (token && phone) {
      setUser({ phone, token })
      if (storedGps) {
        try { setGpsLocation(JSON.parse(storedGps)) } catch {}
      }
      setAuthStep('done')
    }
  }, [])

  const startOtp = useCallback((phone) => {
    setPendingPhone(phone)
    setAuthStep('otp')
  }, [])

  const confirmOtp = useCallback((token) => {
    const userData = { phone: pendingPhone, token }
    setUser(userData)
    localStorage.setItem('deliveriq_token', token)
    localStorage.setItem('deliveriq_phone', pendingPhone)
    setAuthStep('gps')
  }, [pendingPhone])

  const saveGps = useCallback((location) => {
    setGpsLocation(location)
    if (location) {
      localStorage.setItem('deliveriq_gps', JSON.stringify(location))
    } else {
      localStorage.removeItem('deliveriq_gps')
    }
    setAuthStep('done')
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setGpsLocation(null)
    setPendingPhone('')
    setAuthStep('login')
    localStorage.removeItem('deliveriq_token')
    localStorage.removeItem('deliveriq_phone')
    localStorage.removeItem('deliveriq_gps')
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      gpsLocation,
      authStep,
      pendingPhone,
      startOtp,
      confirmOtp,
      saveGps,
      logout,
      isAuthenticated: authStep === 'done' && !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}