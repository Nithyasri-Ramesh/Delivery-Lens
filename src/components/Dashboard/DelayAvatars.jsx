import React from 'react'
import { motion } from 'framer-motion'
import { Users, Star } from 'lucide-react'
import { delayAvatars } from '../../data/delayAvatars'

export default function DelayAvatars({ onAvatarClick, selectedAvatar, totalPoints }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-display font-bold text-white">Delay Avatars</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-400 font-mono">{totalPoints} pts</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
          Click an avatar to assign a delay reason and earn loyalty points.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {delayAvatars.map((avatar, i) => {
          const isSelected = selectedAvatar === avatar.id
          return (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 + 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAvatarClick(avatar)}
              className={`
                cursor-pointer rounded-2xl p-3.5 border transition-all duration-300
                bg-gradient-to-br ${avatar.color} ${avatar.border}
                ${isSelected ? 'ring-2 ring-cyan-400/50' : ''}
              `}
              style={isSelected ? { boxShadow: `0 0 22px ${avatar.glowColor}` } : {}}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{avatar.emoji}</span>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                    <span className="text-[10px] text-slate-900 font-bold">✓</span>
                  </motion.div>
                )}
              </div>

              <p className="text-xs font-display font-bold text-white leading-tight mb-1">{avatar.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight mb-2">{avatar.reason}</p>

              <div className={`inline-flex items-center rounded-full px-2 py-0.5 border text-[9px] font-mono uppercase tracking-wider ${avatar.categoryBg} ${avatar.categoryColor}`}>
                {avatar.category}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-yellow-400 font-mono font-bold">+{avatar.points}</span>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">{avatar.delay}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}