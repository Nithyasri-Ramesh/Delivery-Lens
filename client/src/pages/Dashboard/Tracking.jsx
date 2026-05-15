import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Brain, Users } from 'lucide-react'
import ETAWidget from '../../components/tracking/ETAWidget'
import LiveTrackingStats from '../../components/analytics/LiveTrackingStats'
import DeliveryTimeline from '../../components/tracking/DeliveryTimeline'
import AIInsights from '../../components/analytics/AIInsights'
import AlternativeRoutes from '../../components/analytics/AlternativeRoutes'
import DelayAvatars from '../../components/tracking/DelayAvatars'

const TABS = [
  { id: 'tracking', label: 'Live Tracking', icon: Radio },
  { id: 'insights', label: 'AI Insights',   icon: Brain },
  { id: 'avatars',  label: 'Delay Avatars', icon: Users },
]

export default function Tracking({
  progress, eta, distanceKm, distanceRemainingKm,
  speed, isTracking, onAvatarClick, selectedAvatar, loyaltyPoints,
}) {
  const [activeTab, setActiveTab] = useState('tracking')

  return (
    <div className="flex flex-col h-full gap-3 min-h-0">
      <ETAWidget
        eta={eta} progress={progress}
        distanceRemainingKm={distanceRemainingKm}
        speed={speed} isTracking={isTracking}
      />

      {/* Tab bar */}
      <div className="glass-card rounded-2xl border border-white/5 flex-shrink-0 overflow-hidden">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-3 px-1
                  text-[10px] font-mono uppercase tracking-wider transition-all duration-200 relative
                  ${active ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline truncate">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
                {active && (
                  <motion.div
                    layoutId="tab-bar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'tracking' && (
            <motion.div key="tracking"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}
              className="space-y-3 pb-3"
            >
              <LiveTrackingStats
                speed={speed} progress={progress}
                distanceKm={distanceKm} distanceRemainingKm={distanceRemainingKm}
                eta={eta} isTracking={isTracking}
              />
              <DeliveryTimeline progress={progress} isTracking={isTracking} />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div key="insights"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}
              className="space-y-3 pb-3"
            >
              <AIInsights progress={progress} isTracking={isTracking} loyaltyPoints={loyaltyPoints} />
              <AlternativeRoutes />
            </motion.div>
          )}

          {activeTab === 'avatars' && (
            <motion.div key="avatars"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}
              className="pb-3"
            >
              <DelayAvatars
                onAvatarClick={onAvatarClick}
                selectedAvatar={selectedAvatar}
                totalPoints={loyaltyPoints}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}