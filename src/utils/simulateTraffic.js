export function getTrafficStatus(progress) {
  if (progress < 20) return { label: 'Heavy',    color: 'text-red-400',     dot: 'bg-red-400'     }
  if (progress < 50) return { label: 'Moderate', color: 'text-yellow-400',  dot: 'bg-yellow-400'  }
  if (progress < 80) return { label: 'Light',    color: 'text-emerald-400', dot: 'bg-emerald-400' }
  return               { label: 'Clear',    color: 'text-cyan-400',    dot: 'bg-cyan-400'    }
}

export function simulateDelayProbability(progress) {
  return Math.max(4, Math.round(74 - progress * 0.68))
}

export function simulateAIConfidence(progress) {
  return Math.min(98, Math.round(66 + progress * 0.30))
}

export function simulateSpeed(progress) {
  if (progress < 10) return Math.floor(Math.random() * 8)  + 6
  if (progress < 35) return Math.floor(Math.random() * 12) + 22
  if (progress < 65) return Math.floor(Math.random() * 18) + 32
  return               Math.floor(Math.random() * 10) + 38
}

export function getRiderStatus(progress) {
  if (progress === 0)   return 'Standby'
  if (progress < 5)     return 'Departing'
  if (progress < 30)    return 'En Route'
  if (progress < 65)    return 'In Transit'
  if (progress < 85)    return 'Approaching'
  if (progress < 100)   return 'Nearby'
  return                       'Delivered'
}