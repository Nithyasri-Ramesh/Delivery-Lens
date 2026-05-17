import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE })

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deliveriq_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * POST /api/auth/send-otp
 * Sends OTP to the given phone number.
 * In dev mode the server always issues 123456.
 */
export async function sendOtp(phone) {
  try {
    const { data } = await api.post('/auth/send-otp', { phone })
    return { success: true, message: data.message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.'
    throw new Error(msg)
  }
}

/**
 * POST /api/auth/verify-otp
 * Verifies OTP and returns a JWT token.
 */
export async function verifyOtp(phone, otp) {
  try {
    const { data } = await api.post('/auth/verify-otp', { phone, otp })
    return { success: true, token: data.token, user: data.user }
  } catch (err) {
    const msg = err.response?.data?.message || 'Invalid OTP. Please try again.'
    throw new Error(msg)
  }
}