import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/ui/Navbar'
import LocationInput from '../components/maps/LocationInput'
import DeliveryMap from '../components/maps/DeliveryMap'
import Tracking from '../pages/Dashboard/Tracking'
import { geocodeLocation } from '../services/api/geocodeService'
import { fetchRoute } from '../services/api/routeService'
import { calculateETA } from '../utils/calculateETA'
import { simulateSpeed } from '../utils/simulateTraffic'// AUTH
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Auth/Login'
import VerifyOtp from '../pages/Auth/VerifyOtp'
import GpsLocation from '../pages/Auth/GpsLocation'




// Toast component — unchanged from original
function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-card border border-cyan-500/20 rounded-2xl px-4 py-3 flex items-start gap-3 max-w-sm shadow-xl shadow-cyan-500/10"
    >
      <div className="text-2xl flex-shrink-0">{toast.emoji}</div>
      <div>
        <p className="text-sm font-display font-bold text-white">{toast.title}</p>
        <p className="text-xs text-slate-400 font-body mt-0.5">{toast.message}</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  // ── Auth gate ─────────────────────────────────────────────────────────────
  // Read auth state — renders the appropriate auth screen before the dashboard.
  // The tracking system below is NEVER mounted until authStep === 'done'.
  const { authStep, gpsLocation } = useAuth()


  // authStep === 'done' → fall through to full dashboard
  // ─────────────────────────────────────────────────────────────────────────

  // GPS address captured in GpsLocation screen — passed to LocationInput
  const gpsAddress = gpsLocation?.address || ''

  // ── All tracking state below is 100% unchanged from the original ──────────
  const [routeCoords, setRouteCoords] = useState(null)
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [riderPosition, setRiderPosition] = useState(null)
  const [progress, setProgress] = useState(0)
  const [distanceKm, setDistanceKm] = useState('0')
  const [distanceRemainingKm, setDistanceRemainingKm] = useState('0')
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [eta, setEta] = useState('--:--')
  const [speed, setSpeed] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [toasts, setToasts] = useState([])

  const animFrameRef = useRef(null)
  const stepRef = useRef(0)
  const routeRef = useRef(null)

  const addToast = useCallback((toast) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Animate rider along route — unchanged
  const startAnimation = useCallback((coords, totalDuration) => {
    routeRef.current = coords
    stepRef.current = 0

    const totalSteps = coords.length
    const intervalMs = Math.max(100, (totalDuration * 1000) / totalSteps)
    const demoInterval = Math.max(50, intervalMs / 60)

    let currentStep = 0

    const animate = () => {
      if (currentStep >= totalSteps) {
        setProgress(100)
        setDistanceRemainingKm('0')
        setEta('Delivered!')
        addToast({
          emoji: '🎉',
          title: 'Package Delivered!',
          message: 'Your order has been successfully delivered.',
        })
        return
      }

      const pos = coords[currentStep]
      setRiderPosition(pos)

      const pct = (currentStep / (totalSteps - 1)) * 100
      setProgress(pct)

      const remaining = totalDuration * (1 - pct / 100)
      setEta(calculateETA(totalDuration, pct))
      setSpeed(simulateSpeed(pct))

      stepRef.current = currentStep
      currentStep++

      animFrameRef.current = setTimeout(animate, demoInterval)
    }

    animate()
  }, [addToast])

  // Stop animation on unmount — unchanged
  useEffect(() => {
    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current)
    }
  }, [])

  // Update distance remaining as progress changes — unchanged
  useEffect(() => {
    const remaining = parseFloat(distanceKm) * (1 - progress / 100)
    setDistanceRemainingKm(remaining.toFixed(2))
  }, [progress, distanceKm])

  const handleTrack = async (hub, destination) => {
    setError('')
    setIsLoading(true)
    setIsTracking(false)
    setProgress(0)
    setRiderPosition(null)
    setRouteCoords(null)

    if (animFrameRef.current) clearTimeout(animFrameRef.current)

    try {
      const [start, end] = await Promise.all([
        geocodeLocation(hub),
        geocodeLocation(destination),
         
      ])
     
      console.log(start)
         console.log(end)   
      setStartCoords(start)
      setEndCoords(end)

      const route = await fetchRoute(start, end)

      setRouteCoords(route.coordinates)
      setDistanceKm(route.distanceKm)
      setDurationSeconds(route.durationSeconds)
      setDistanceRemainingKm(route.distanceKm)
      setEta(calculateETA(route.durationSeconds, 0))
      setSpeed(simulateSpeed(0))
      setIsTracking(true)

      addToast({
        emoji: '🛵',
        title: 'Rider Dispatched!',
        message: `Route: ${route.distanceKm} km • ~${route.durationMinutes} min`,
      })

      setTimeout(() => {
        startAnimation(route.coordinates, route.durationSeconds)
      }, 800)
    } catch (err) {
      setError(err.message || 'Failed to fetch route. Please try different locations.')
      setIsTracking(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = useCallback((avatar) => {
    setSelectedAvatar(avatar.id)
    setLoyaltyPoints(prev => prev + avatar.points)
    addToast({
      emoji: avatar.emoji,
      title: `${avatar.name} — ${avatar.reason}`,
      message: `+${avatar.points} loyalty points earned! Discount updated.`,
    })
  }, [addToast])
    if (authStep === 'login') return <Login />
  if (authStep === 'otp')   return <VerifyOtp />
  if (authStep === 'gps')   return <GpsLocation />

  // ── Dashboard render — layout unchanged ───────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black grid-bg relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-10 w-64 h-64 bg-orange-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar — now receives logout from AuthContext internally */}
      <Navbar isTracking={isTracking} progress={progress} />

      {/* Main layout — unchanged */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] gap-3 p-3 overflow-hidden">
        {/* Left: Map + Input */}
        <div className="flex flex-col gap-3 lg:flex-1 min-h-0">
          <div className="flex-shrink-0">
            {/* defaultDestination is the only new prop — GPS address pre-fill */}
            <LocationInput
              onTrack={handleTrack}
              isLoading={isLoading}
              error={error}
              defaultDestination={gpsAddress}
            />
          </div>

          <div className="flex-1 min-h-[300px] lg:min-h-0">
            <DeliveryMap
              routeCoords={routeCoords}
              startCoords={startCoords}
              endCoords={endCoords}
              riderPosition={riderPosition}
              isTracking={isTracking}
            />
          </div>
        </div>

        {/* Right: Dashboard sidebar — completely unchanged */}
        <div className="lg:w-[380px] xl:w-[420px] flex-shrink-0 min-h-0 overflow-hidden">
          <Tracking
            progress={progress}
            eta={eta}
            distanceKm={distanceKm}
            distanceRemainingKm={distanceRemainingKm}
            speed={speed}
            isTracking={isTracking}
            onAvatarClick={handleAvatarClick}
            selectedAvatar={selectedAvatar}
            loyaltyPoints={loyaltyPoints}
          />
        </div>
      </div>

      {/* Toast container — unchanged */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}