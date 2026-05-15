import React from 'react'
import { motion } from 'framer-motion'
import { Gauge, User, Navigation, MapPin, Clock, Activity } from 'lucide-react'
import { formatDistance } from '../../utils/calculateETA'
import { getRiderStatus } from '../../utils/simulateTraffic'

export default function LiveTrackingStats({ speed, progress, distanceKm, distanceRemainingKm, eta, isTracking }) {
  const riderStatus    = getRiderStatus(isTracking ? progress : 0)
  const coveredKm      = Math.max(0, (parseFloat(distanceKm) || 0) - (parseFloat(distanceRemainingKm) || 0))

  const stats = [
    { label: 'Current Speed',    value: isTracking ? `${speed} km/h`              : '— km/h', icon: Gauge,      color: 'text-cyan-400',    border: 'border-cyan-400/20',    bg: 'bg-cyan-400/8'    },
    { label: 'Rider Status',     value: riderStatus,                                            icon: User,       color: 'text-blue-400',    border: 'border-blue-400/20',    bg: 'bg-blue-400/8'    },
    { label: 'Distance Covered', value: isTracking ? formatDistance(coveredKm)    : '—',       icon: Activity,   color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/8' },
    { label: 'Distance Left',    value: isTracking ? formatDistance(distanceRemainingKm) : '—',icon: Navigation, color: 'text-orange-400',  border: 'border-orange-400/20',  bg: 'bg-orange-400/8'  },
    { label: 'Est. Delivery',    value: isTracking ? eta                          : '--:--',   icon: Clock,      color: 'text-purple-400',  border: 'border-purple-400/20',  bg: 'bg-purple-400/8'  },
    { label: 'Total Route',      value: isTracking ? `${distanceKm} km`           : '—',       icon: MapPin,     color: 'text-yellow-400',  border: 'border-yellow-400/20',  bg: 'bg-yellow-400/8'  },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-display font-bold text-white">Live Tracking Stats</h3>
        {isTracking && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full blink" />
            <span className="text-[10px] text-emerald-400 font-mono uppercase">Live</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 + 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`glass-card rounded-2xl p-3.5 border ${s.border} ${s.bg} transition-all duration-300`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider truncate">{s.label}</span>
              </div>
              <motion.p
                key={s.value}
                initial={{ opacity: 0.5, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-display font-bold ${isTracking ? s.color : 'text-slate-600'}`}
              >
                {s.value}
              </motion.p>
            </motion.div>
          )
        })}
      </div>

      {isTracking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-3 border border-cyan-500/15 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full blink flex-shrink-0" />
            <p className="text-[11px] text-cyan-300 font-mono">
              Rider is <strong>{riderStatus.toLowerCase()}</strong> — updating every second via live GPS
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}