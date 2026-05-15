import React from 'react'
import { motion } from 'framer-motion'
import { Route, Clock, CheckCircle, ThumbsUp, XCircle } from 'lucide-react'

const ROUTES = [
  {
    id: 1,
    name: 'Outer Ring Road Bypass',
    sub: 'AI-optimised path',
    status: 'Recommended',
    StatusIcon: CheckCircle,
    statusStyle: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    trafficLabel: 'Low Traffic',
    trafficColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    savings: 'Saves 22 mins',
    savingsColor: 'text-emerald-400',
    cardGrad: 'from-emerald-500/8 to-teal-500/8',
    border: 'border-emerald-500/20',
    bars: [0.18, 0.24, 0.14, 0.20, 0.10],
  },
  {
    id: 2,
    name: 'NH-44 Express Corridor',
    sub: 'Highway route',
    status: 'Viable',
    StatusIcon: ThumbsUp,
    statusStyle: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    trafficLabel: 'Moderate Traffic',
    trafficColor: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
    savings: 'Saves 8 mins',
    savingsColor: 'text-yellow-400',
    cardGrad: 'from-yellow-500/8 to-orange-500/8',
    border: 'border-yellow-500/20',
    bars: [0.42, 0.58, 0.50, 0.45, 0.55],
  },
  {
    id: 3,
    name: 'Current Route',
    sub: 'Congested zone',
    status: 'Avoid',
    StatusIcon: XCircle,
    statusStyle: 'text-red-400 bg-red-400/10 border-red-400/30',
    trafficLabel: 'Heavy Traffic',
    trafficColor: 'text-red-400',
    dotColor: 'bg-red-400',
    savings: '+12 mins delay',
    savingsColor: 'text-red-400',
    cardGrad: 'from-red-500/8 to-rose-500/8',
    border: 'border-red-500/20',
    bars: [0.88, 0.80, 0.93, 0.86, 0.90],
  },
]

export default function AlternativeRoutes() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Route className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-display font-bold text-white">Alternative Routes</h3>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">AI-ranked</span>
      </div>

      {ROUTES.map((route, i) => {
        const { StatusIcon } = route
        return (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.15 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`glass-card rounded-2xl p-4 border bg-gradient-to-br ${route.cardGrad} ${route.border} cursor-pointer transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-bold text-white truncate">{route.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{route.sub}</p>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 border text-[10px] font-mono uppercase flex-shrink-0 ${route.statusStyle}`}>
                <StatusIcon className="w-3 h-3" />
                {route.status}
              </div>
            </div>

            {/* Traffic bars */}
            <div className="flex items-end gap-1 h-6 mb-3">
              {route.bars.map((h, j) => (
                <motion.div
                  key={j}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.1 + j * 0.04 + 0.3 }}
                  className={`flex-1 rounded-sm origin-bottom ${
                    h > 0.7 ? 'bg-red-500/55' : h > 0.4 ? 'bg-yellow-500/55' : 'bg-emerald-500/55'
                  }`}
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${route.dotColor}`} />
                <span className={`text-xs font-mono ${route.trafficColor}`}>{route.trafficLabel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className={`text-xs font-bold font-mono ${route.savingsColor}`}>{route.savings}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}