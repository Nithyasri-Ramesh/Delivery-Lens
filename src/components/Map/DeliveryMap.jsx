import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeColorMarker(hexColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
      <defs>
        <filter id="s" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${hexColor}" flood-opacity="0.6"/>
        </filter>
      </defs>
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z"
        fill="${hexColor}" filter="url(#s)" opacity="0.93"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.92"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [28, 40],
    iconAnchor: [14, 40],
    popupAnchor:[0, -42],
  })
}

function makeRiderIcon() {
  const html = `
    <div style="position:relative;width:40px;height:40px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(0,229,255,0.18);
        animation:riderPulse 2s ease-in-out infinite;
      "></div>
      <div style="
        position:absolute;inset:6px;border-radius:50%;
        background:rgba(0,229,255,0.32);
        animation:riderPulse 2s ease-in-out infinite 0.6s;
      "></div>
      <div style="
        position:absolute;inset:0;
        display:flex;align-items:center;justify-content:center;
        font-size:20px;
        filter:drop-shadow(0 0 7px rgba(0,229,255,0.9));
      ">🛵</div>
    </div>
    <style>
      @keyframes riderPulse {
        0%,100%{box-shadow:0 0 0 0 rgba(0,229,255,0.5);}
        50%{box-shadow:0 0 0 10px rgba(0,229,255,0);}
      }
    </style>`
  return L.divIcon({
    html,
    className: '',
    iconSize:   [40, 40],
    iconAnchor: [20, 20],
  })
}

const startIcon = makeColorMarker('#00e676')
const endIcon   = makeColorMarker('#ff1744')
const riderIcon = makeRiderIcon()

function FitBounds({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords && coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords), { padding: [56, 56] })
    }
  }, [coords, map])
  return null
}

export default function DeliveryMap({ routeCoords, startCoords, endCoords, riderPosition, isTracking }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 glow-cyan">
      {/* Status badge */}
      <div className="absolute top-3 left-3 z-[1000]">
        <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-emerald-400 blink' : 'bg-slate-600'}`} />
          <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">
            {isTracking ? 'Live Tracking' : 'Awaiting Route'}
          </span>
        </div>
      </div>

      {/* Legend */}
      {isTracking && (
        <div className="absolute bottom-5 left-3 z-[1000]">
          <div className="glass-card rounded-xl p-2.5 border border-white/10 space-y-1.5">
            {[
              { color: 'bg-emerald-400', label: 'Hub' },
              { color: 'bg-red-400',     label: 'Destination' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-[10px] font-mono text-slate-400">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">🛵</span>
              <span className="text-[10px] font-mono text-slate-400">Rider</span>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {routeCoords && routeCoords.length > 0 && (
          <>
            <FitBounds coords={routeCoords} />

            {/* Glow shadow under route */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: 'rgba(0,229,255,0.12)', weight: 12, lineCap: 'round', lineJoin: 'round' }}
            />
            {/* Main route */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#00e5ff', weight: 4, lineCap: 'round', lineJoin: 'round' }}
            />

            {startCoords && (
              <Marker position={[startCoords.lat, startCoords.lon]} icon={startIcon}>
                <Popup><strong style={{ color: '#00e676' }}>📦 Hub / Origin</strong></Popup>
              </Marker>
            )}

            {endCoords && (
              <Marker position={[endCoords.lat, endCoords.lon]} icon={endIcon}>
                <Popup><strong style={{ color: '#ff1744' }}>🏠 Delivery Point</strong></Popup>
              </Marker>
            )}

            {riderPosition && (
              <Marker position={riderPosition} icon={riderIcon}>
                <Popup><strong style={{ color: '#00e5ff' }}>🛵 Rider — In Transit</strong></Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>
  )
}