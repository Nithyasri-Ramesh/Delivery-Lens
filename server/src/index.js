const express    = require('express')
const cors       = require('cors')
const dotenv     = require('dotenv')
const mongoose   = require('mongoose')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'DeliverIQ API' }))

// 404
app.use((_, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

// Connect to MongoDB then listen
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected')
    app.listen(PORT, () =>
      console.log(`🚀  DeliverIQ server → http://localhost:${PORT}`)
    )
  })
  .catch((err) => {
    console.warn('⚠️   MongoDB unavailable —', err.message)
    console.log('💡  Running in memory-only mode (OTP still works)')
    app.listen(PORT, () =>
      console.log(`🚀  DeliverIQ server → http://localhost:${PORT}  [no DB]`)
    )
  })