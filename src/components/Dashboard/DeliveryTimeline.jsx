import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, ClipboardList, Package, Truck, MapPin, Home } from 'lucide-react'

const STEPS = [
  { id: 0, label: 'Order Placed', icon: ClipboardList, threshold: 0   },
  { id: 1, label: 'Picked Up',    icon: Package,       threshold: 5   },
  { id: 2, label: 'In Transit',   icon: Truck,         threshold: 30  },
  { id: 3, label: 'Nearby',       icon: MapPin,        threshold: 80  },
  { id: 4, label: 'Delivered',    icon: Home,          threshold: 100 },
]

export default function DeliveryTimeline({ progress, isTracking }) {
  const activeStep = isTracking
    ? STEPS.reduce((acc, s) => (progress >= s.threshold ? s.id : acc), -1)
    : -1

  return (
    <div className="glass-card rounded-2xl p-4 border border-white/5">
      <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4">
        Delivery Timeline
      </h3>

      <div className="relative">
        {/* Track line */}
        <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-800" />
        {/* Progress fill */}
        <motion.div
          className="absolute left-5 top-5 w-px bg-gradient-to-b from-cyan-400 to-blue-600 origin-top"
          animate={{ scaleY: isTracking && activeStep >= 0 ? activeStep / (STEPS.length - 1) : 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: 'calc(100% - 40px)' }}
        />

        <div className="space-y-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const done   = activeStep > step.id
            const active = activeStep === step.id
            const pending= activeStep < step.id

            return (
              <motion.div key={step.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
                className="flex items-center gap-4 py-2 relative z-10"
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500
                  ${done   ? 'bg-cyan-500/20 border-cyan-400' : ''}
                  ${active ? 'bg-cyan-500/30 border-cyan-400 shadow-md shadow-cyan-400/30' : ''}
                  ${pending? 'bg-slate-900 border-slate-700' : ''}
                `}>
                  {done   ? <CheckCircle2 className="w-5 h-5 text-cyan-400" /> :
                   active ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> :
                             <Icon className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-display font-semibold truncate transition-colors duration-300
                    ${done ? 'text-cyan-400' : active ? 'text-white' : 'text-slate-600'}`}>
                    {step.label}
                  </p>
                  {active && (
                    <p className="text-[10px] text-cyan-400/70 font-mono mt-0.5 blink">In progress...</p>
                  )}
                  {done && (
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">Completed</p>
                  )}
                </div>

                {(done || active) && (
                  <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
                    active ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 blink'
                           : 'bg-slate-800 text-slate-500'
                  }`}>
                    {active ? 'NOW' : '✓'}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}