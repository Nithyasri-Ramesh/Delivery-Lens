import React from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingDown, Award, Tag, Zap, Shield } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import { simulateDelayProbability, simulateAIConfidence } from '../../utils/simulateTraffic'

export default function AIInsights({ progress, isTracking, loyaltyPoints }) {
  const delayProb  = simulateDelayProbability(progress)
  const confidence = simulateAIConfidence(progress)
  const discount   = Math.floor(loyaltyPoints / 10)

  return (
    <div className="space-y-3">
      {/* Main AI card */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-500/15 glow-cyan">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 flex items-center justify-center border border-cyan-500/20">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-display font-bold text-white">AI Delay Intelligence</h3>
            <p className="text-[10px] text-slate-500 font-mono">Predictive analysis engine</p>
          </div>
          {isTracking && (
            <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full blink" />
              <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider">Active</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-slate-400 font-mono">Delay Probability</span>
              </div>
              <motion.span key={delayProb} initial={{ scale: 1.25 }} animate={{ scale: 1 }}
                className="text-sm font-bold font-display text-white">
                {isTracking ? `${delayProb}%` : '—'}
              </motion.span>
            </div>
            <ProgressBar value={isTracking ? delayProb : 0} color="orange" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-slate-400 font-mono">AI Confidence</span>
              </div>
              <motion.span key={confidence} initial={{ scale: 1.25 }} animate={{ scale: 1 }}
                className="text-sm font-bold font-display text-white">
                {isTracking ? `${confidence}%` : '—'}
              </motion.span>
            </div>
            <ProgressBar value={isTracking ? confidence : 0} color="cyan" />
          </div>
        </div>
      </div>

      {/* Points + Discount */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.03 }}
          className="glass-card rounded-2xl p-3.5 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <div className="flex items-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] text-slate-400 font-mono uppercase">Points</span>
          </div>
          <motion.p key={loyaltyPoints} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
            className="text-2xl font-display font-extrabold text-yellow-400">{loyaltyPoints}</motion.p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Loyalty rewards</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }}
          className="glass-card rounded-2xl p-3.5 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-mono uppercase">Discount</span>
          </div>
          <p className="text-2xl font-display font-extrabold text-emerald-400">₹{discount}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">At checkout</p>
        </motion.div>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">AI Recommendations</h4>
        </div>
        <div className="space-y-2">
          {[
            { text: 'Switch to Outer Ring Road to avoid peak traffic congestion.', icon: '✅', bg: 'bg-emerald-400/8', color: 'text-emerald-300' },
            { text: `${isTracking ? delayProb : 72}% delay risk detected near current segment.`,  icon: '⚠️', bg: 'bg-orange-400/8',  color: 'text-orange-300'  },
            { text: 'Optimal delivery window: next 25–40 minutes.',                               icon: '🎯', bg: 'bg-cyan-400/8',    color: 'text-cyan-300'    },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className={`flex items-start gap-2 ${item.bg} rounded-xl px-3 py-2`}>
              <span className="text-sm flex-shrink-0">{item.icon}</span>
              <p className={`text-[11px] ${item.color} leading-snug`}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}