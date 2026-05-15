import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/UI/Navbar'
import LocationInput from './components/UI/LocationInput'
import DeliveryMap from './components/Map/DeliveryMap'
import TrackingDashboard from './components/Dashboard/TrackingDashboard'
import { geocodeLocation } from './services/geocodeService'
import { fetchRoute } from './services/routeService'
import { calculateETA } from './utils/calculateETA'
import { simulateSpeed } from './utils/simulateTraffic'

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3600)
    return () => clearTimeout(t)
  }, [toast.id, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, x: 110, scale: 0.88 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 110, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="glass-card border border-cyan-500/20 rounded-2xl px-4 py-3 flex items-start gap-3 max-w-xs shadow-xl shadow-black/40"
    >
      <span className="text-2xl flex-shrink-0">{toast.emoji}</span>
      <div>
        <p className="text-sm font-display font-bold text-white leading-tight">{toast.title}</p>
        <p className="text-xs text-slate-400 font-body mt-0.5 leading-snug">{toast.message}</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [routeCoords, setRouteCoords]             = useState(null)
  const [startCoords, setStartCoords]             = useState(null)
  const [endCoords, setEndCoords]                 = useState(null)
  const [riderPosition, setRiderPosition]         = useState(null)
  const [progress, setProgress]                   = useState(0)
  const [distanceKm, setDistanceKm]               = useState('0')
  const [distanceRemainingKm, setDistanceRemainingKm] = useState('0')
  const [durationSeconds, setDurationSeconds]     = useState(0)
  const [eta, setEta]                             = useState('--:--')
  const [speed, setSpeed]                         = useState(0)
  const [isTracking, setIsTracking]               = useState(false)
  const [isLoading, setIsLoading]                 = useState(false)
  const [error, setError]                         = useState('')
  const [selectedAvatar, setSelectedAvatar]       = useState(null)
  const [loyaltyPoints, setLoyaltyPoints]         = useState(0)
  const [toasts, setToasts]                       = useState([])

  const timerRef = useRef(null)

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev, { ...toast, id: Date.now() + Math.random() }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const startAnimation = useCallback((coords, totalDuration) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const totalSteps = coords.length
    // Demo speed: traverse route in ~30s regardless of real duration
    const intervalMs = Math.max(40, 30000 / totalSteps)
    let step = 0

    const tick = () => {
      if (step >= totalSteps) {
        setProgress(100)
        setDistanceRemainingKm('0')
        setEta('Delivered! 🎉')
        addToast({ emoji: '🎉', title: 'Package Delivered!', message: 'Your order arrived successfully.' })
        return
      }
      setRiderPosition(coords[step])
      const pct = (step / Math.max(totalSteps - 1, 1)) * 100
      setProgress(pct)
      setEta(calculateETA(totalDuration, pct))
      setSpeed(simulateSpeed(pct))
      step++
      timerRef.current = setTimeout(tick, intervalMs)
    }
    tick()
  }, [addToast])

  // Keep distanceRemaining in sync with progress
  useEffect(() => {
    const total = parseFloat(distanceKm) || 0
    setDistanceRemainingKm((total * (1 - progress / 100)).toFixed(2))
  }, [progress, distanceKm])

  const handleTrack = async (hub, destination) => {
    setError('')
    setIsLoading(true)
    setIsTracking(false)
    setProgress(0)
    setRiderPosition(null)
    setRouteCoords(null)
    if (timerRef.current) clearTimeout(timerRef.current)

    try {
      const [start, end] = await Promise.all([
        geocodeLocation(hub),
        geocodeLocation(destination),
      ])
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
        message: `${route.distanceKm} km route • ~${route.durationMinutes} min`,
      })

      setTimeout(() => startAnimation(route.coordinates, route.durationSeconds), 900)
    } catch (err) {
      setError(err.message || 'Could not fetch route. Try different locations.')
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
      message: `+${avatar.points} loyalty points earned!`,
    })
  }, [addToast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black grid-bg relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed top-32 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-8 w-64 h-64 bg-orange-500/3 rounded-full blur-3xl pointer-events-none" />

      <Navbar isTracking={isTracking} progress={progress} />

      <div className="flex flex-col lg:flex-row gap-3 p-3" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left column: input + map */}
        <div className="flex flex-col gap-3 lg:flex-1 min-h-0">
          <div className="flex-shrink-0">
            <LocationInput onTrack={handleTrack} isLoading={isLoading} error={error} />
          </div>
          <div className="flex-1 min-h-[320px] lg:min-h-0">
            <DeliveryMap
              routeCoords={routeCoords}
              startCoords={startCoords}
              endCoords={endCoords}
              riderPosition={riderPosition}
              isTracking={isTracking}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:w-[390px] xl:w-[420px] flex-shrink-0 min-h-0 overflow-hidden">
          <TrackingDashboard
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

      {/* Toasts */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <Toast toast={t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}