import { weatherApi } from './ky.instance'

const KEY = import.meta.env.VITE_OPENWEATHER_KEY

// ── Tipos da resposta da API ─────────────────────────────────────────────
export interface AirPollutionResponse {
  list: Array<{
    main: { aqi: number }           // 1=Boa 2=Regular 3=Ruim 4=Muito Ruim 5=Péssima
    components: {
      co: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
    }
  }>
}

export interface WeatherResponse {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{ description: string; icon: string }>
}

// ── Chamadas ─────────────────────────────────────────────────────────────
export async function fetchAirQuality(
  lat: number,
  lon: number,
): Promise<AirPollutionResponse> {
  return weatherApi
    .get('data/2.5/air_pollution', {
      searchParams: { lat: String(lat), lon: String(lon), appid: KEY },
    })
    .json<AirPollutionResponse>()
}

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<WeatherResponse> {
  return weatherApi
    .get('data/2.5/weather', {
      searchParams: { lat: String(lat), lon: String(lon), appid: KEY, units: 'metric', lang: 'pt_br' },
    })
    .json<WeatherResponse>()
}

// ── Helpers de apresentação ──────────────────────────────────────────────
export const AQI_INFO: Record<
  number,
  { label: string; color: string; description: string }
> = {
  1: {
    label: 'BOA',
    color: '#2E7D32',
    description:
      'Concentração de poluentes dentro do limite recomendado para atividades ao ar livre.',
  },
  2: {
    label: 'REGULAR',
    color: '#F9A825',
    description:
      'Qualidade aceitável. Grupos sensíveis podem sentir leve desconforto.',
  },
  3: {
    label: 'RUIM',
    color: '#E65100',
    description:
      'Grupos sensíveis devem evitar atividades ao ar livre por períodos prolongados.',
  },
  4: {
    label: 'MUITO RUIM',
    color: '#C62828',
    description:
      'Toda a população pode apresentar efeitos à saúde. Evite exposição prolongada.',
  },
  5: {
    label: 'PÉSSIMA',
    color: '#4A148C',
    description:
      'Alerta de emergência. Evite qualquer atividade ao ar livre.',
  },
}