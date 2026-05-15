import axios from 'axios'

const BASE = 'https://nominatim.openstreetmap.org/search'

export async function geocodeLocation(query) {
  const response = await axios.get(BASE, {
    params: { format: 'json', q: query, limit: 1, addressdetails: 1 },
    headers: { 'Accept-Language': 'en' },
  })

  if (!response.data || response.data.length === 0) {
    throw new Error(`Location not found: "${query}". Try a more specific address.`)
  }

  const r = response.data[0]
  return {
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    displayName: r.display_name,
  }
}