import ky from 'ky'

// Instância para a OpenWeatherMap — chamada direta (suporta CORS)
export const weatherApi = ky.create({
  prefix: 'https://api.openweathermap.org',
  timeout: 10000,
  retry: { limit: 2, methods: ['get'], statusCodes: [408, 503, 504] },
})

// Instância para a SPTrans — passa pelo proxy local (resolve CORS + oculta token)
// Em dev: http://localhost:3001 | Em produção: sua Vercel Serverless Function
export const sptransApi = ky.create({
  prefix: import.meta.env.VITE_PROXY_URL ?? 'http://localhost:5173/',
  timeout: 10000,
  retry: { limit: 2, methods: ['get'], statusCodes: [408, 503, 504] },
})