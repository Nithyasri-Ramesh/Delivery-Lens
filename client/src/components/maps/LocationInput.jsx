import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ArrowRight, Loader2, AlertCircle, Locate } from 'lucide-react'

const EXAMPLES = [
  { hub: 'Connaught Place, Delhi',    dest: 'Lajpat Nagar, Delhi'       },
  { hub: 'Bandra, Mumbai',            dest: 'Powai, Mumbai'              },
  { hub: 'Koramangala, Bangalore',    dest: 'Electronic City, Bangalore' },
]

/**
 * MODIFICATION from original:
 *   • Added `defaultDestination` prop (string)
 *   • useEffect auto-fills destination when GPS address is provided
 *   • GPS badge shown when destination matches the GPS address
 * Everything else (onTrack, isLoading, error, examples) is unchanged.
 */
export default function LocationInput({ onTrack, isLoading, error, defaultDestination = '' }) {
  const [hub, setHub]               = useState('')
  const [destination, setDestination] = useState('')

  // Auto-fill destination once when a GPS address arrives from GpsLocation screen
  useEffect(() => {
    if (defaultDestination && !destination) {
      setDestination(defaultDestination)
    }
  }, [defaultDestination]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hub.trim() && destination.trim() && !isLoading) {
      onTrack(hub.trim(), destination.trim())
    }
  }

  const examples = [
    { hub: 'Connaught Place, Delhi', dest: 'Lajpat Nagar, Delhi' },
    { hub: 'Bandra, Mumbai', dest: 'Powai, Mumbai' },
    { hub: 'Koramangala, Bangalore', dest: 'Electronic City, Bangalore' },
  ]

  const fillExample = (ex) => {
    setHub(ex.hub)
    setDestination(ex.dest)
  }

  const isGpsFilled = defaultDestination && destination === defaultDestination

  return (
    <div className="glass-card rounded-2xl p-4 border border-white/5 glow-cyan">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <Locate className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-white">Route Configuration</h3>
          <p className="text-[10px] text-slate-500 font-mono">Set origin and destination</p>
        </div>
        {/* GPS auto-fill badge */}
        {isGpsFilled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto flex items-center gap-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5"
          >
            <MapPin className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">GPS</span>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Hub Input */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-emerald-400/50" />
          </div>
          <input
            type="text"
            value={hub}
            onChange={(e) => setHub(e.target.value)}
            placeholder="Hub / Warehouse location..."
            disabled={isLoading}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 focus:bg-slate-900/80 transition-all duration-200 font-body disabled:opacity-50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MapPin className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Route connector */}
        <div className="flex items-center gap-2 px-3">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-1 bg-slate-600" />
            <div className="w-0.5 h-1 bg-slate-600" />
            <div className="w-0.5 h-1 bg-slate-600" />
          </div>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">via OSRM Route</span>
        </div>

        {/* Destination Input */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 border-2 border-red-400/50" />
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => { setDestination(e.target.value) }}
            placeholder="Delivery address..."
            disabled={isLoading}
            className={`w-full bg-slate-900/60 border rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-200 font-body disabled:opacity-50 focus:bg-slate-900/80
              ${isGpsFilled
                ? 'border-emerald-400/30 focus:border-emerald-400/50'
                : 'border-white/10 focus:border-red-400/50'
              }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Navigation className="w-3.5 h-3.5 text-slate-600 group-focus-within:text-red-400 transition-colors" />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!hub.trim() || !destination.trim() || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
          style={{ boxShadow: '0 0 20px rgba(0,229,255,0.2)' }}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Calculating Route...</span></>
          ) : (
            <><span>Track Delivery</span><ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>

      {/* Quick examples */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider mb-2">Quick Examples</p>
        <div className="flex flex-wrap gap-1.5">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => fillExample(ex)}
              disabled={isLoading}
              className="text-[10px] text-slate-500 bg-slate-800/60 hover:bg-slate-700/60 hover:text-slate-300 border border-white/5 rounded-lg px-2 py-1 transition-all duration-150 font-mono disabled:opacity-40"
            >
              {ex.hub.split(',')[0]} → {ex.dest.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}