import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Activity, Clock, TrendingUp, Radio } from 'lucide-react'

export default function Navbar({ isTracking, progress }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass-card border-b border-white/5 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 z-50 relative"
      style={{ minHeight: '60px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          {isTracking && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 blink" />
          )}
        </div>
        <div>
          <h1 className="font-display font-extrabold text-white text-lg leading-none tracking-tight">
            Deliver<span className="text-cyan-400">IQ</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5 hidden sm:block">
            Live AI Delay Intelligence
          </p>
        </div>
      </div>

      {/* Center order badge */}
      <div className="hidden md:flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/18 rounded-full px-4 py-1.5">
        <Radio className="w-3.5 h-3.5 text-cyan-400 blink" />
        <span className="text-xs font-mono text-cyan-300 tracking-widest uppercase">Order #DEL-12345</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-display font-bold text-white">{isTracking ? '24' : '23'}</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase">Active</span>
        </div>

        <div className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-sm font-display font-bold text-white">
              {isTracking ? `${Math.min(98, 78 + Math.round(progress * 0.2))}%` : '78%'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase">On-Time</span>
        </div>

        <div className="hidden lg:flex flex-col items-center px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span className="text-sm font-display font-bold text-white">
              {isTracking ? `${Math.max(4, 18 - Math.round(progress * 0.14))}m` : '18m'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase">Avg Delay</span>
        </div>

        <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/5">
          <span className="text-xs font-mono text-slate-300">{timeStr}</span>
        </div>
      </div>
    </motion.nav>
  )
}