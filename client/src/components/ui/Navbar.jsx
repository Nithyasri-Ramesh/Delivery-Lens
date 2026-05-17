import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Activity, Clock, TrendingUp, Radio, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ isTracking, progress }) {
  const { logout, user } = useAuth()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass-card border-b border-white/5 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 z-50 relative"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          {isTracking && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 blink" />
          )}
        </div>
        <div>
          <h1 className="font-display font-900 text-white text-lg leading-none tracking-tight">
            Deliver<span className="text-cyan-400">IQ</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase leading-none mt-0.5">
            Live AI Delay Intelligence
          </p>
        </div>
      </div>

      {/* Center badge */}
      <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5">
        <Radio className="w-3.5 h-3.5 text-cyan-400 blink" />
        <span className="text-xs font-mono text-cyan-300 tracking-widest uppercase">
          Order #DEL-12345
        </span>
      </div>

      {/* Right stats row */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Active deliveries */}
        <div className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-display font-bold text-white">
              {isTracking ? '24' : '23'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Active</span>
        </div>

        {/* On-time % */}
        <div className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-sm font-display font-bold text-white">
              {isTracking ? `${Math.min(98, 78 + Math.round(progress * 0.2))}%` : '78%'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">On-Time</span>
        </div>

        {/* Avg delay */}
        <div className="hidden lg:flex flex-col items-center px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-orange-400" />
            <span className="text-sm font-display font-bold text-white">
              {isTracking ? `${Math.max(4, 18 - Math.round(progress * 0.14))}m` : '18m'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Avg Delay</span>
        </div>

        {/* Live clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/5">
          <span className="text-xs font-mono text-slate-300">{timeStr}</span>
        </div>

        {/* Logout button — only shown when user is logged in */}
        {user && (
          <motion.button
            onClick={logout}
            title={`Logout (${user.phone})`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">Logout</span>
          </motion.button>
        )}
      </div>
    </motion.nav>
  )
}