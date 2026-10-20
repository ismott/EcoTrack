import { useState, useEffect } from 'react'

export interface BusLine {
  code: string
  destination: string
  etaSeconds: number
}

export function useBusLines() {
  const [buses, setBuses] = useState<BusLine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula uma resposta de API
    const mockBuses: BusLine[] = [
      { code: '8000-10', destination: 'Lapa', etaSeconds: 120 },
      { code: '875P-10', destination: 'Metro Ana Rosa', etaSeconds: 480 },
      { code: '857R-10', destination: 'Term. Campo Limpo', etaSeconds: 900 },
    ]

    const timer = setTimeout(() => {
      setBuses(mockBuses)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return { buses, loading }
}