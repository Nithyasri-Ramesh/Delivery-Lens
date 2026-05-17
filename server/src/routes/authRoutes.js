const express    = require('express')
const { handleSendOtp, handleVerifyOtp } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Public
router.post('/send-otp',   handleSendOtp)
router.post('/verify-otp', handleVerifyOtp)

// Protected — example: get current user details


module.exports = router