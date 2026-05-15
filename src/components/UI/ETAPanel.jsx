import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Gauge, Navigation, Wifi, Package } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getTrafficStatus } from '../../utils/simulateTraffic'
import { formatDistance } from '../../utils/calculateETA'

export default function ETAPanel({ eta, progress, distanceRemainingKm, speed, isTracking }) {
  const traffic = getTrafficStatus(progress)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 border border-white/5 flex-shrink-0"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Estimated Arrival</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">
              {isTracking ? eta : '--:--'}
            </span>
            {isTracking && progress < 100 && (
              <span className="text-[10px] text-emerald-400 font-mono blink">LIVE</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-mono">Delivery Progress</span>
          <span className="text-white font-bold font-mono">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} color="cyan" height="h-2.5" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Navigation, color: 'text-orange-400', label: 'Distance Left', value: isTracking ? formatDistance(distanceRemainingKm) : '—' },
          { icon: Gauge,      color: 'text-blue-400',   label: 'Speed',          value: isTracking ? `${speed} km/h` : '—' },
          { icon: Wifi,       color: 'text-emerald-400',label: 'Traffic',        value: isTracking ? <span className={traffic.color}>{traffic.label}</span> : '—' },
          { icon: Package,    color: 'text-purple-400', label: 'Status',         value: isTracking ? (progress >= 100 ? <span className="text-emerald-400">Delivered</span> : <span className="text-cyan-400">In Transit</span>) : 'Standby' },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-slate-900/50 rounded-xl p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`w-3 h-3 ${color}`} />
              <span className="text-[9px] text-slate-500 font-mono uppercase">{label}</span>
            </div>
            <p className="text-sm font-bold font-display text-white">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}