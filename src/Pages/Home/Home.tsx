import {
  MdDirectionsBus,
  MdWarning,
  MdWbSunny,
  MdCheckCircle,
  MdErrorOutline,
  MdShield,
} from 'react-icons/md'
import { useGeolocation } from '../../Hooks/useGeolocation'
import { useAirQuality } from '../../Hooks/useAirQuality'
import { useBusLines } from '../../Hooks/useBusLines'
import { useFloodAlerts } from '../../Hooks/useFloodAlerts'
import './Home.css'

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

function Home() {
  const { coords, loading: geoLoading, error: geoError } = useGeolocation()
  const { data: air, loading: airLoading } = useAirQuality(
    coords?.lat ?? null,
    coords?.lon ?? null,
  )
  const { buses, loading: busLoading } = useBusLines()
  const { alert: floodAlert, loading: floodLoading } = useFloodAlerts()

  return (
    <div className="home">
      {/* ── Card: Qualidade do Ar ── */}
      <section className="card card--air">
        <h2 className="card__title">Qualidade do Ar</h2>

        {geoLoading || airLoading ? (
          <div className="skeleton-row">
            <div className="skeleton skeleton--circle" />
            <div className="skeleton skeleton--temp" />
          </div>
        ) : geoError ? (
          <p className="card__error">
            ⚠️ Permita a localização para ver a Qualidade do Ar.
          </p>
        ) : air ? (
          <>
            <div className="aqi-row">
              <div className="aqi-badge" style={{ backgroundColor: air.color }}>
                <span className="aqi-badge__label">{air.label}</span>
                <span className="aqi-badge__sub">IQA {air.aqi}</span>
              </div>
              <div className="aqi-temp">
                <span className="aqi-temp__value">{air.temp}°C</span>
                <MdWbSunny size={38} color="#F59E0B" className="aqi-temp__icon" />
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
          <MdDirectionsBus size={22} color="#FFFFFF" />
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
                <div className="bus-item__icon-wrapper">
                  <MdDirectionsBus size={22} color="#FFFFFF" />
                </div>
                <div className="bus-item__info">
                  <span className="bus-item__code">{bus.code}</span>
                  <span className="bus-item__destination">
                    {bus.destination}
                  </span>
                </div>
                <div className="bus-item__eta-badge">
                  <span
                    className="bus-item__dot"
                    style={{ backgroundColor: etaColor(bus.etaSeconds) }}
                  />
                  <strong style={{ color: etaColor(bus.etaSeconds) }}>
                    {etaLabel(bus.etaSeconds)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Card: Alertas de Alagamento ── */}
      <section className={`card card--flood ${floodAlert ? `card--flood-${floodAlert.status}` : ''}`}>
        <div className="flood-header">
          <h2 className="card__title">Alertas de Alagamento</h2>
          <MdShield size={20} className="flood-header__icon" />
        </div>

        {floodLoading ? (
          <div className="skeleton-row skeleton-row--center">
            <div className="skeleton skeleton--alert" />
          </div>
        ) : floodAlert ? (
          <div className={`alert-box alert-box--${floodAlert.status}`}>
            <div className="alert-box__icon-wrapper">
              {floodAlert.status === 'safe' && (
                <MdCheckCircle size={44} className="alert-box__icon alert-box__icon--safe" />
              )}
              {floodAlert.status === 'warning' && (
                <MdWarning size={44} className="alert-box__icon alert-box__icon--warning" />
              )}
              {floodAlert.status === 'danger' && (
                <MdErrorOutline size={44} className="alert-box__icon alert-box__icon--danger" />
              )}
            </div>

            <div className="alert-box__content">
              <h3 className="alert-box__title">{floodAlert.title}</h3>
              <p className="alert-box__text">{floodAlert.description}</p>
              <div className="alert-box__footer">
                <span className="alert-box__location">{floodAlert.location}</span>
                <span className="alert-box__updated">{floodAlert.lastUpdated}</span>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Home