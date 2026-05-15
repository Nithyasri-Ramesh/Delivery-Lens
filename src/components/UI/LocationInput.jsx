import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ArrowRight, Loader2, AlertCircle, Locate } from 'lucide-react'

const EXAMPLES = [
  { hub: 'Connaught Place, Delhi',    dest: 'Lajpat Nagar, Delhi'       },
  { hub: 'Bandra, Mumbai',            dest: 'Powai, Mumbai'              },
  { hub: 'Koramangala, Bangalore',    dest: 'Electronic City, Bangalore' },
]

export default function LocationInput({ onTrack, isLoading, error }) {
  const [hub, setHub]               = useState('')
  const [destination, setDestination] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hub.trim() && destination.trim() && !isLoading) {
      onTrack(hub.trim(), destination.trim())
    }
  }

  return (
    <div className="glass-card rounded-2xl p-4 border border-white/5 glow-cyan">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/18 flex items-center justify-center">
          <Locate className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-white">Route Configuration</h3>
          <p className="text-[10px] text-slate-500 font-mono">Set origin and destination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Hub */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
          </div>
          <input
            type="text" value={hub} onChange={e => setHub(e.target.value)}
            placeholder="Hub / Warehouse location…" disabled={isLoading}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-8 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/50 transition-all disabled:opacity-50"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex flex-col gap-0.5">
            {[0,1,2].map(n => <div key={n} className="w-0.5 h-1 bg-slate-700 rounded" />)}
          </div>
          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">via OSRM Routing</span>
        </div>

        {/* Destination */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-400/30" />
          </div>
          <input
            type="text" value={destination} onChange={e => setDestination(e.target.value)}
            placeholder="Delivery address…" disabled={isLoading}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-8 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-400/50 transition-all disabled:opacity-50"
          />
          <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-red-400 transition-colors" />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-red-400 text-xs bg-red-400/8 border border-red-400/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!hub.trim() || !destination.trim() || isLoading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating Route…</>
            : <><span>Track Delivery</span><ArrowRight className="w-4 h-4" /></>
          }
        </motion.button>
      </form>

      {/* Quick examples */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mb-2">Quick Examples</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex, i) => (
            <button key={i} disabled={isLoading}
              onClick={() => { setHub(ex.hub); setDestination(ex.dest) }}
              className="text-[10px] text-slate-500 hover:text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-lg px-2 py-1 transition-all font-mono disabled:opacity-40">
              {ex.hub.split(',')[0]} → {ex.dest.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}