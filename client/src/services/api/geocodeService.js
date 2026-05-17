import axios from 'axios'

// Re-export the existing forward geocoder so new import paths work


/**
 * Reverse geocode lat/lon → short human-readable address string via Nominatim.
 * Used by GpsLocation.jsx after browser geolocation resolves.
 */
export async function geocodeLocation(place) {
  try {
    const { data } = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: place,
          format: 'json',
          limit: 1,
        },
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'DeliverIQ/1.0'
        },
      }
    )

    if (!data || data.length === 0) {
      throw new Error('Location not found')
    }

    return [
      parseFloat(data[0].lat),
      parseFloat(data[0].lon),
    ]
  } catch (error) {
    throw new Error('Failed to geocode location')
  }
}
export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat, lon, zoom: 16, addressdetails: 1 },
      headers: { 'Accept-Language': 'en','User-Agent': 'DeliverIQ/1.0' },
    })

    if (data && data.display_name) {
      const a = data.address || {}
      // Build a short, human-friendly label
      const parts = [
        a.road || a.pedestrian || a.footway,
        a.suburb || a.neighbourhood || a.quarter || a.village,
        a.city || a.town || a.county,
      ].filter(Boolean).slice(0, 2)

      return parts.length > 0
        ? parts.join(', ')
        : data.display_name.split(',').slice(0, 2).join(',').trim()
    }

    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }
}