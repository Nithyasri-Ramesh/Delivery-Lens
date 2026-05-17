const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'deliveriq_dev_secret_key'

function generateToken(payload, expiresIn = '30d') {
  return jwt.sign(payload, SECRET, { expiresIn })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

module.exports = { generateToken, verifyToken }