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
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador.')
      setLoading(false)
      return
    }

    const watcher = navigator.geolocation.watchPosition(
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

    return () => navigator.geolocation.clearWatch(watcher)
  }, [])

  return { coords, error, loading }
}