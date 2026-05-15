import React from 'react'
import { motion } from 'framer-motion'

const COLORS = {
  cyan:    { bar: 'from-cyan-500 to-blue-500',     glow: 'rgba(0,229,255,0.55)'    },
  orange:  { bar: 'from-orange-500 to-red-500',    glow: 'rgba(255,107,26,0.55)'   },
  emerald: { bar: 'from-emerald-500 to-teal-500',  glow: 'rgba(0,230,118,0.55)'    },
  blue:    { bar: 'from-blue-500 to-indigo-500',   glow: 'rgba(41,121,255,0.55)'   },
  purple:  { bar: 'from-purple-500 to-pink-500',   glow: 'rgba(168,85,247,0.55)'   },
  yellow:  { bar: 'from-yellow-500 to-orange-500', glow: 'rgba(234,179,8,0.55)'    },
}

export default function ProgressBar({ value = 0, color = 'cyan', height = 'h-2' }) {
  const { bar, glow } = COLORS[color] || COLORS.cyan
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full ${height} bg-slate-800/60 rounded-full overflow-hidden relative`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${bar} rounded-full relative overflow-hidden`}
        initial={{ width: '0%' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        style={{ boxShadow: `0 0 10px ${glow}` }}
      >
        <div className="absolute inset-0 shimmer-bar" />
      </motion.div>
    </div>
  )
}