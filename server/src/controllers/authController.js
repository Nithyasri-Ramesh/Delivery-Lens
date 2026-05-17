const { sendOtp, verifyOtp } = require('../services/otpService')
const { generateToken }      = require('../utils/generateToken')

// Graceful: User model may not be available if MongoDB is down
let User = null
try { User = require('../models/User') } catch {}

/**
 * POST /api/auth/send-otp
 * Body: { phone: string }
 */
async function handleSendOtp(req, res) {
  try {
    const { phone } = req.body
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required.' })
    }

    const cleaned = String(phone).replace(/\s/g, '')
    if (cleaned.length < 8) {
      return res.status(400).json({ message: 'Invalid phone number format.' })
    }

    await sendOtp(cleaned)
    return res.json({ success: true, message: 'OTP sent successfully.' })
  } catch (err) {
    console.error('[sendOtp]', err)
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' })
  }
}

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string, otp: string }
 */
async function handleVerifyOtp(req, res) {
  try {
    const { phone, otp } = req.body
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required.' })
    }

    const cleaned = String(phone).replace(/\s/g, '')
    const result  = verifyOtp(cleaned, otp)

    if (!result.valid) {
      return res.status(400).json({ message: result.reason })
    }

    // Upsert user record if DB is available
    let dbUser = { phone: cleaned }
    if (User) {
      try {
        dbUser = await User.findOneAndUpdate(
          { phone: cleaned },
          { isVerified: true, lastLogin: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      } catch (dbErr) {
        // Non-fatal — continue without DB record
        console.warn('[verifyOtp] DB upsert skipped:', dbErr.message)
      }
    }

    const token = generateToken({
      phone: cleaned,
      userId: dbUser._id ? dbUser._id.toString() : cleaned,
    })

    return res.json({
      success: true,
      token,
      user: { phone: cleaned, isVerified: true },
      message: 'OTP verified successfully.',
    })
  } catch (err) {
    console.error('[verifyOtp]', err)
    return res.status(500).json({ message: 'Verification failed. Please try again.' })
  }
}

module.exports = { handleSendOtp, handleVerifyOtp }