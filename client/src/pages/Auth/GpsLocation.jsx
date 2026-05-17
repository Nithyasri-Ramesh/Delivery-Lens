import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, Loader2, CheckCircle2,
  AlertTriangle, ArrowRight, Zap, LocateFixed,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { reverseGeocode } from '../../services/api/geocodeService'

// phase: 'idle' | 'requesting' | 'resolving' | 'done' | 'denied' | 'error'

export default function GpsLocation() {
  const { saveGps } = useAuth()
  const [phase, setPhase]       = useState('idle')
  const [location, setLocation] = useState(null)   // { lat, lon, address }
  const [error, setError]       = useState('')

  const requestGps = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setPhase('error')
      return
    }
    setPhase('requesting')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setPhase('resolving')
        const address = await reverseGeocode(lat, lon)
        setLocation({ lat, lon, address })
        setPhase('done')
      },
      (err) => {
        if (err.code === 1 /* PERMISSION_DENIED */) {
          setPhase('denied')
        } else {
          setError('Could not retrieve location. Check your connection and try again.')
          setPhase('error')
        }
      },
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: true }
    )
  }

  const handleContinue = () => { if (location) saveGps(location) }
  const handleSkip     = () => saveGps(null)

  const phaseLabel = {
    idle:       'Enable Location Access',
    requesting: 'Requesting Permission…',
    resolving:  'Resolving Address…',
    done:       'Location Captured!',
    denied:     'Permission Denied',
    error:      'Could Not Get Location',
  }[phase]

  const phaseDesc = {
    idle:       "We'll auto-fill your current address as the delivery destination.",
    requesting: 'Waiting for your browser location permission…',
    resolving:  'Converting coordinates to a readable address…',
    done:       'Your address is captured and will be pre-filled on the tracking dashboard.',
    denied:     'Location access was denied. You can still enter your delivery address manually.',
    error:      error || 'Something went wrong while fetching your location.',
  }[phase]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-0 left-1/3 w-[520px] h-[520px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[420px] h-[420px] bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-72 h-72 bg-emerald-600/4 rounded-full blur-3xl pointer-events-none" />
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
          {/* Animated GPS icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              {/* Outer pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.15, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-cyan-500/20 border border-cyan-500/20"
              />
              {/* Middle ring */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.25, 0.6] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute inset-3 rounded-full bg-cyan-500/25 border border-cyan-400/25"
              />
              {/* Inner icon circle */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center">
                {phase === 'done'
                  ? <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  : (phase === 'requesting' || phase === 'resolving')
                  ? <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                  : <Navigation className="w-7 h-7 text-cyan-400" />
                }
              </div>
              {/* Done badge */}
              {phase === 'done' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-slate-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Label + desc */}
          <div className="text-center mb-6">
            <motion.h2 key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xl font-display font-bold text-white mb-2">
              {phaseLabel}
            </motion.h2>
            <motion.p key={phase + 'd'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-400 leading-relaxed">
              {phaseDesc}
            </motion.p>
          </div>

          {/* Location result card */}
          <AnimatePresence>
            {phase === 'done' && location && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-3.5 flex items-start gap-3"
              >
                <LocateFixed className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-emerald-400/70 font-mono uppercase tracking-widest mb-0.5">
                    Detected Location
                  </p>
                  <p className="text-sm text-white font-body leading-snug truncate">
                    {location.address}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Denied warning */}
          <AnimatePresence>
            {phase === 'denied' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2.5 text-yellow-400 text-xs bg-yellow-400/8 border border-yellow-400/20 rounded-xl px-3 py-3 mb-4">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Enable location in your browser settings and refresh, or skip and enter your address manually.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="space-y-3">
            {(phase === 'idle' || phase === 'error') && (
              <motion.button
                onClick={requestGps}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Navigation className="w-4 h-4" />
                Allow Location Access
              </motion.button>
            )}

            {(phase === 'requesting' || phase === 'resolving') && (
              <div className="w-full py-3.5 rounded-xl bg-slate-800/60 text-slate-400 text-sm flex items-center justify-center gap-2 border border-white/5 cursor-not-allowed">
                <Loader2 className="w-4 h-4 animate-spin" />
                {phase === 'requesting' ? 'Awaiting permission…' : 'Resolving address…'}
              </div>
            )}

            {phase === 'done' && (
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Continue to Dashboard
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            {/* Skip always shown when not loading / not done */}
            {phase !== 'requesting' && phase !== 'resolving' && phase !== 'done' && (
              <button
                onClick={handleSkip}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-300 font-mono uppercase tracking-widest transition-colors"
              >
                Skip &mdash; I&rsquo;ll enter my address manually
              </button>
            )}

            {phase === 'done' && (
              <button
                onClick={handleSkip}
                className="w-full py-2 text-[10px] text-slate-600 hover:text-slate-400 font-mono uppercase tracking-widest transition-colors"
              >
                Use a different address instead
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}