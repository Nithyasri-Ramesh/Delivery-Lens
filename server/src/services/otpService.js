// In-memory OTP store: phone → { otp, expiresAt }
// Replace with Redis in production for multi-instance deployments.
const otpStore = new Map()

const DEV_OTP   = process.env.DEV_OTP || '123456'
const OTP_TTL   = 5 * 60 * 1000 // 5 minutes

function generateOtp() {
  if (process.env.NODE_ENV !== 'production') return DEV_OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOtp(phone) {
  const otp = generateOtp()
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_TTL })

  if (process.env.NODE_ENV === 'production' && process.env.TWILIO_ACCOUNT_SID) {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
    await twilio.messages.create({
      body: `Your DeliverIQ OTP is: ${otp}. Valid for 5 minutes. Do not share it.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    console.log(`📱  OTP sent via Twilio → ${phone}`)
  } else {
    // Dev: print to console — frontend hardcodes 123456
    console.log(`🔑  DEV OTP for ${phone}: ${otp}`)
  }

  return otp
}

function verifyOtp(phone, inputOtp) {
  const record = otpStore.get(phone)

  if (!record) {
    return { valid: false, reason: 'OTP not found. Please request a new one.' }
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone)
    return { valid: false, reason: 'OTP has expired. Please request a new one.' }
  }
  if (record.otp !== String(inputOtp).trim()) {
    return { valid: false, reason: 'Invalid OTP. Please try again.' }
  }

  otpStore.delete(phone) // consumed — one-time use
  return { valid: true }
}

module.exports = { sendOtp, verifyOtp }