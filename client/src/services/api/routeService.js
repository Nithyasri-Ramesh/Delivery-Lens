import axios from 'axios'

const BASE = 'https://router.project-osrm.org/route/v1/driving'

export async function fetchRoute(startCoords, endCoords) {
  const url = `${BASE}/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}`

  const response = await axios.get(url, {
    params: { overview: 'full', geometries: 'geojson', steps: false },
  })

  if (!response.data?.routes?.length) {
    throw new Error('No route found between these locations.')
  }

  const route = response.data.routes[0]
  // OSRM returns [lon, lat] — flip to [lat, lon] for Leaflet
  const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon])

  return {
    coordinates,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    distanceKm: (route.distance / 1000).toFixed(2),
    durationMinutes: Math.round(route.duration / 60),
  }
}