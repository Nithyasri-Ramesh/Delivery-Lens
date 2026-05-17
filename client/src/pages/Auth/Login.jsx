import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ArrowRight, Loader2, Zap, Shield, Truck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { sendOtp } from '../../services/api/authService'

const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', label: 'IN' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+44',  flag: '🇬🇧', label: 'GB' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+65',  flag: '🇸🇬', label: 'SG' },
  { code: '+61',  flag: '🇦🇺', label: 'AU' },
]

export default function Login() {
  const { startOtp } = useAuth()
  const [phone, setPhone]           = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const digits   = phone.replace(/\D/g, '')
  const fullPhone = `${countryCode}${digits}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (digits.length < 10) { setError('Enter a valid 10-digit mobile number.'); return }
    setError('')
    setLoading(true)
    try {
      await sendOtp(fullPhone)
      startOtp(fullPhone)
    } catch (err) {
      // In DEV skip server and proceed directly so you can work offline
      if (import.meta.env.DEV) {
        console.warn('Server unreachable in DEV — proceeding with mock OTP flow')
        startOtp(fullPhone)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/3 w-[520px] h-[520px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[420px] h-[420px] bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -translate-y-1/2 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(0,229,255,0.2)', '0 0 40px rgba(0,229,255,0.5)', '0 0 20px rgba(0,229,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-4"
          >
            <Zap className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Deliver<span className="text-cyan-400">IQ</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1.5">
            AI-Powered Delivery Intelligence
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8 border border-white/8 shadow-2xl shadow-black/50"
          style={{ backdropFilter: 'blur(28px)' }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter your mobile number to access live tracking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2 block">
                Mobile Number
              </label>
              <div className="flex gap-2">
                {/* Country code */}
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl px-3 py-3 focus:outline-none focus:border-cyan-400/50 transition-all cursor-pointer flex-shrink-0"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code} className="bg-slate-900">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                {/* Phone number */}
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setError('') }}
                    placeholder="98765 43210"
                    maxLength={13}
                    disabled={loading}
                    autoFocus
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-3 py-2.5"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* CTA */}
            <motion.button
              type="submit"
              disabled={loading || digits.length < 10}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP&hellip;</>
                : <><span>Get OTP</span><ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          {import.meta.env.DEV && (
            <p className="text-center text-[10px] text-slate-600 font-mono mt-5">
              DEV MODE &mdash; OTP will always be{' '}
              <span className="text-cyan-500 font-bold">123456</span>
            </p>
          )}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-8 mt-6"
        >
          {[
            { icon: Shield, label: 'Secure OTP' },
            { icon: Truck,  label: 'Live Tracking' },
            { icon: Zap,    label: 'AI Powered' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-slate-600">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}