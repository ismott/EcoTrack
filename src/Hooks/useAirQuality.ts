import { useState, useEffect } from 'react'
import { weatherApi } from '../API/ky.instance'

export interface AirQualityComponents {
  co: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
}

export interface AirQualityData {
  aqi: number
  label: string
  color: string
  description: string
  temp: number
  humidity?: number
  windSpeed?: number
  pressure?: number
  components?: AirQualityComponents
}

function getAqiMetadata(aqi: number) {
  switch (aqi) {
    case 1:
      return {
        label: 'Boa',
        color: '#2E7D32',
        description: 'Qualidade do ar considerada satisfatória e com pouco ou nenhum risco.',
      }
    case 2:
      return {
        label: 'Moderada',
        color: '#F9A825',
        description: 'Pessoas de grupos sensíveis podem sentir desconforto leve.',
      }
    case 3:
      return {
        label: 'Ruim',
        color: '#E65100',
        description: 'Membros de grupos sensíveis podem ter efeitos na saúde.',
      }
    case 4:
      return {
        label: 'Muito Ruim',
        color: '#C62828',
        description: 'Alerta de saúde: todos podem começar a sentir efeitos.',
      }
    case 5:
      return {
        label: 'Péssima',
        color: '#6A1B9A',
        description: 'Condição de emergência para toda a população.',
      }
    default:
      return {
        label: 'Desconhecida',
        color: '#757575',
        description: 'Sem dados suficientes.',
      }
  }
}

export function useAirQuality(lat: number | null, lon: number | null) {
  const [data, setData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    // 1. Garante que se lat ou lon forem nulos, não faz a requisição
    if (lat === null || lon === null) return

    // 2. Cria variáveis locais garantidas como number para o TypeScript
    const validLat = lat
    const validLon = lon

    async function fetchAirAndWeather() {
      setLoading(true)
      setError(false)

      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

        // Requisição 1: Poluição do Ar
        const airRes: any = await weatherApi
          .get('data/2.5/air_pollution', {
            searchParams: { lat: validLat, lon: validLon, appid: apiKey },
          })
          .json()

        // Requisição 2: Clima/Tempo Atual
        const weatherRes: any = await weatherApi
          .get('data/2.5/weather', {
            searchParams: { lat: validLat, lon: validLon, units: 'metric', appid: apiKey },
          })
          .json()

        const aqi = airRes.list[0].main.aqi
        const meta = getAqiMetadata(aqi)

        setData({
          aqi,
          label: meta.label,
          color: meta.color,
          description: meta.description,
          temp: Math.round(weatherRes.main.temp),
          humidity: weatherRes.main.humidity,
          windSpeed: weatherRes.wind.speed,
          pressure: weatherRes.main.pressure,
          components: airRes.list[0].components,
        })
      } catch (err) {
        console.error('Erro ao buscar qualidade do ar:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAirAndWeather()
  }, [lat, lon])

  return { data, loading, error }
}