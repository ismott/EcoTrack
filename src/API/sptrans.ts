import { sptransApi } from './ky.instance'

// ── Tipos ────────────────────────────────────────────────────────────────
export interface BusLine {
  cl: number       // código da linha
  lt0: string      // letreiro principal
  lt1: string      // letreiro secundário
  sl: number       // sentido
  tp: string       // tipo de serviço
  ts: string       // nome do destino
}

export interface BusStop {
  cp: number       // código da parada
  np: string       // nome da parada
  ed: string       // endereço
  py: number       // latitude
  px: number       // longitude
}

export interface ETAResponse {
  hr: string       // horário da resposta
  ps: Array<{
    cp: number     // código da parada
    np: string     // nome da parada
    py: number
    px: number
    l: Array<{
      c: string    // código da linha
      cl: number
      sl: number
      lt0: string
      lt1: string
      qv: number   // quantidade de veículos
      vs: Array<{
        p: string  // prefixo do veículo
        a: boolean // acessível
        t: string  // horário previsto de chegada (ex: "14:32")
        py: number
        px: number
      }>
    }>
  }>
}

// ── Chamadas (roteadas pelo proxy) ───────────────────────────────────────
export async function searchLines(term: string): Promise<BusLine[]> {
  return sptransApi
    .get('sptrans/Linha/Buscar', { searchParams: { termosBusca: term } })
    .json<BusLine[]>()
}

export async function getStopsByLine(lineCode: number): Promise<BusStop[]> {
  return sptransApi
    .get('sptrans/Parada/BuscarParadasPorLinha', {
      searchParams: { codigoLinha: lineCode },
    })
    .json<BusStop[]>()
}

export async function getETAByLine(lineCode: number): Promise<ETAResponse> {
  return sptransApi
    .get('sptrans/Previsao/Linha', { searchParams: { codigoLinha: lineCode } })
    .json<ETAResponse>()
}

// ── Calcula segundos até chegada a partir do horário da API ──────────────
export function calcEtaSeconds(arrivalTime: string): number {
  const [h, m] = arrivalTime.split(':').map(Number)
  const now = new Date()
  const arrival = new Date()
  arrival.setHours(h, m, 0, 0)
  return Math.max(0, Math.floor((arrival.getTime() - now.getTime()) / 1000))
}