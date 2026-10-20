import { MdDirectionsBus, MdWarning, MdWbSunny, MdCheckCircle } from 'react-icons/md'
import { useGeolocation } from '../../Hooks/useGeolocation'
import { useAirQuality } from '../../Hooks/useAirQuality'
import { useBusLines } from '../../Hooks/useBusLines'
import './Home.css'

// ── helpers ──────────────────────────────────────────────────────────────
function etaColor(seconds: number): string {
  if (seconds < 0) return '#9E9E9E'
  if (seconds <= 180) return '#2E7D32'
  if (seconds <= 600) return '#F9A825'
  return '#C62828'
}

function etaLabel(seconds: number): string {
  if (seconds < 0) return 'Sem dados'
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}min`
}

// ── componente ───────────────────────────────────────────────────────────
function Home() {
  const { coords, loading: geoLoading, error: geoError } = useGeolocation()
  const { data: air, loading: airLoading } = useAirQuality(
    coords?.lat ?? null,
    coords?.lon ?? null,
  )
  const { buses, loading: busLoading } = useBusLines()

  return (
    <div className="home">

      {/* ── Card: Qualidade do Ar ── */}
      <section className="card">
        <h2 className="card__title">Qualidade do Ar</h2>

        {geoLoading || airLoading ? (
          <div className="skeleton-row">
            <div className="skeleton skeleton--circle" />
            <div className="skeleton skeleton--temp" />
          </div>
        ) : geoError ? (
          <p className="card__error">⚠️ Permita a localização para ver o IQA.</p>
        ) : air ? (
          <>
            <div className="aqi-row">
              <div className="aqi-badge" style={{ backgroundColor: air.color }}>
                <span className="aqi-badge__label">{air.label}</span>
                <span className="aqi-badge__sub">(IQA {air.aqi})</span>
              </div>
              <div className="aqi-temp">
                <span className="aqi-temp__value">{air.temp}°C</span>
                <MdWbSunny size={36} color="#F9A825" />
              </div>
            </div>
            <p className="aqi-description">{air.description}</p>
          </>
        ) : null}
      </section>

      {/* ── Card: Ônibus Favoritos ── */}
      <section className="card card--blue">
        <div className="bus-header">
          <h2 className="card__title card__title--white">Ônibus Favoritos</h2>
          <MdDirectionsBus size={22} color="white" />
        </div>

        {busLoading ? (
          <div className="bus-list">
            <div className="skeleton skeleton--bus" />
            <div className="skeleton skeleton--bus" />
          </div>
        ) : (
          <div className="bus-list">
            {buses.map((bus) => (
              <div key={bus.code} className="bus-item">
                <MdDirectionsBus size={28} color="white" className="bus-item__bus-icon" />
                <div className="bus-item__info">
                  <span className="bus-item__code">{bus.code}</span>
                  <span className="bus-item__destination">
                    {bus.destination} — Chegando em&nbsp;
                    <strong style={{ color: etaColor(bus.etaSeconds) }}>
                      {etaLabel(bus.etaSeconds)}
                    </strong>
                  </span>
                </div>
                <span
                  className="bus-item__dot"
                  style={{ backgroundColor: etaColor(bus.etaSeconds) }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Card: Alertas de Alagamento ── */}
      <section className="card">
        <h2 className="card__title">Alertas de Alagamento</h2>
        <div className="alert-safe">
          <MdWarning size={48} color="#E65100" />
          <p className="alert-safe__text">
            Nenhum alagamento ativo<br />no seu raio de 5 km
          </p>
          <div className="alert-safe__status">
            <MdCheckCircle size={16} color="var(--color-primary)" />
            <span>Seguro</span>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home