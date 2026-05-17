import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function NotFound() {
  const { isAuthenticated, authStep, startOtp } = useAuth()

  const handleHome = () => {
    if (isAuthenticated) {
      // Force reload to root — App will render dashboard
      window.location.href = '/'
    } else {
      startOtp('')   // reset to login step
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block mb-6"
        >
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto" />
        </motion.div>
        <h1 className="text-7xl font-display font-extrabold text-white mb-2 tracking-tight">
          4<span className="text-cyan-400">0</span>4
        </h1>
        <p className="text-slate-400 text-sm mb-8 font-body">
          This page doesn&rsquo;t exist or was moved.
        </p>
        <motion.button
          onClick={handleHome}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-display font-bold text-sm shadow-lg shadow-cyan-500/20"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  )
}