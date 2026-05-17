import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { verifyOtp, sendOtp } from '../../services/api/authService'

const OTP_LENGTH = 6

export default function VerifyOtp() {
  const { pendingPhone, confirmOtp, startOtp } = useAuth()
  const [digits, setDigits]     = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef([])

  // Auto-focus first box on mount
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  // Countdown for resend button
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const focusAt = (idx) => inputRefs.current[idx]?.focus()

  const handleChange = (idx, val) => {
    const ch = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = ch
    setDigits(next)
    setError('')
    if (ch && idx < OTP_LENGTH - 1) focusAt(idx + 1)
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits]; next[idx] = ''; setDigits(next)
      } else if (idx > 0) {
        focusAt(idx - 1)
      }
    }
    if (e.key === 'ArrowLeft'  && idx > 0)             focusAt(idx - 1)
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) focusAt(idx + 1)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      setDigits(pasted.split(''))
      focusAt(OTP_LENGTH - 1)
    }
  }

  const otp = digits.join('')

  const handleVerify = useCallback(async () => {
    if (otp.length < OTP_LENGTH || loading || success) return
    setError('')
    setLoading(true)
    try {
      let token
      if (import.meta.env.DEV && otp === '123456') {
        // Mock token in dev — no server required
        await new Promise(r => setTimeout(r, 600))
        token = `dev_jwt_${Date.now()}`
      } else {
        const res = await verifyOtp(pendingPhone, otp)
        token = res.token
      }
      setSuccess(true)
      setTimeout(() => confirmOtp(token), 700)
    } catch (err) {
      setError(err.message)
      setDigits(Array(OTP_LENGTH).fill(''))
      setTimeout(() => focusAt(0), 50)
    } finally {
      setLoading(false)
    }
  }, [otp, pendingPhone, confirmOtp, loading, success])

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !loading && !success) {
      handleVerify()
    }
  }, [otp]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    if (countdown > 0 || resending) return
    setResending(true)
    setError('')
    setDigits(Array(OTP_LENGTH).fill(''))
    try {
      await sendOtp(pendingPhone)
    } catch {
      // DEV: just reset countdown
    } finally {
      setCountdown(30)
      setResending(false)
      setTimeout(() => focusAt(0), 50)
    }
  }

  const maskedPhone = pendingPhone.replace(/(\+\d{1,3})(\d{3})(\d+)/, '$1 $2 *****')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-0 left-1/3 w-[520px] h-[520px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[420px] h-[420px] bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/30 mb-4">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Deliver<span className="text-cyan-400">IQ</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8 border border-white/8 shadow-2xl shadow-black/50"
          style={{ backdropFilter: 'blur(28px)' }}
        >
          {/* Back */}
          <button
            onClick={() => startOtp('')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-mono mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-white mb-1">Verify your number</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We sent a 6-digit OTP to{' '}
              <span className="text-cyan-400 font-mono">{maskedPhone}</span>
            </p>
          </div>

          {/* OTP input boxes */}
          <div className="flex gap-2.5 justify-between mb-5" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <motion.input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                disabled={loading || success}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.055 + 0.25 }}
                className={`
                  w-12 h-14 text-center text-xl font-display font-bold rounded-xl border-2
                  outline-none bg-slate-900/80 transition-all duration-200 select-none
                  ${success
                    ? 'border-emerald-400/80 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : error
                    ? 'border-red-400/50 text-white'
                    : d
                    ? 'border-cyan-400/70 text-white shadow-md shadow-cyan-500/20'
                    : 'border-white/10 text-slate-400'
                  }
                  focus:border-cyan-400/80 focus:shadow-md focus:shadow-cyan-500/25
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div key="ok"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-400 text-sm mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-display font-semibold">Verified! Redirecting&hellip;</span>
              </motion.div>
            )}
            {error && !success && (
              <motion.p key="err"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-3 py-2.5 mb-4 text-center">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Verify button */}
          <motion.button
            onClick={handleVerify}
            disabled={otp.length < OTP_LENGTH || loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all mb-4"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying&hellip;</>
              : success
              ? <><CheckCircle2 className="w-4 h-4" /> Verified!</>
              : 'Verify OTP'
            }
          </motion.button>

          {/* Resend */}
          <div className="text-center">
            {countdown > 0
              ? <p className="text-xs text-slate-500 font-mono">
                  Resend in <span className="text-cyan-400 font-bold">{countdown}s</span>
                </p>
              : <button onClick={handleResend} disabled={resending}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors disabled:opacity-40">
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Sending&hellip;' : 'Resend OTP'}
                </button>
            }
          </div>

          {import.meta.env.DEV && (
            <p className="text-center text-[10px] text-slate-600 font-mono mt-4">
              DEV &mdash; use <span className="text-cyan-500 font-bold">123456</span>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}