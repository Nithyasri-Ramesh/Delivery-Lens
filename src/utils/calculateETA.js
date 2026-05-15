export function calculateETA(durationSeconds, progress) {
  const remainingSeconds = durationSeconds * (1 - progress / 100)
  const eta = new Date(Date.now() + remainingSeconds * 1000)
  const h = eta.getHours()
  const m = eta.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${m} ${ampm}`
}

export function formatDistance(km) {
  const v = parseFloat(km)
  if (isNaN(v) || v <= 0) return '0 m'
  if (v < 1) return `${(v * 1000).toFixed(0)} m`
  return `${v.toFixed(1)} km`
}

export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`
}