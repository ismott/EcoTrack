import { useState, useEffect } from 'react'

export interface FloodAlert {
  id: string
  location: string
  status: 'safe' | 'warning' | 'danger'
  title: string
  description: string
  lastUpdated: string
}

const STATIC_FLOOD_DATA: FloodAlert = {
  id: 'alert-01',
  location: 'Ipiranga / Raio de 5 km',
  status: 'safe',
  title: 'Nenhum alagamento ativo',
  description: 'Monitoramento CGE/Defesa Civil indica vias liberadas na sua região.',
  lastUpdated: 'Atualizado há pouco',
}

export function useFloodAlerts() {
  const [alert, setAlert] = useState<FloodAlert | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simula o carregamento dos dados estáticos
    const timer = setTimeout(() => {
      setAlert(STATIC_FLOOD_DATA)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return { alert, loading }
}