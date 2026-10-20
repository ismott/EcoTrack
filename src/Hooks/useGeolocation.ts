import { useState, useEffect } from 'react'

interface Coords {
  lat: number
  lon: number
}

interface GeolocationState {
  coords: Coords | null
  error: string | null
  loading: boolean
}

export function useGeolocation(): GeolocationState {
  const isSupported = 'geolocation' in navigator
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(
    isSupported ? null : 'Geolocalização não suportada neste navegador.'
  )
  const [loading, setLoading] = useState<boolean>(isSupported)

  useEffect(() => {
    if (!isSupported) return

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lon: longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    )
  }, [])

  return { coords, error, loading }
}