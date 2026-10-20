import { MdAir, MdWbSunny, MdWaterDrop, MdCompress, MdVisibility, MdLocationOn } from 'react-icons/md'
import { useGeolocation } from '../../Hooks/useGeolocation'
import { useAirQuality } from '../../Hooks/useAirQuality'
import './AirQuality.css'

function AirQuality() {
  const { coords, loading: geoLoading, error: geoError } = useGeolocation()
  const { data: air, loading: airLoading, error: airError } = useAirQuality(
    coords?.lat ?? null,
    coords?.lon ?? null,
  )

  const isLoading = geoLoading || airLoading

  return (
    <div className="air-page">
      {/* ── Topo: Cabeçalho do Local ── */}
      <div className="air-page__header">
        <MdLocationOn size={22} className="air-page__location-icon" />
        <h2 style={{color: 'black', margin: '0'}}>{coords ? 'Sua Localização Atual' : 'Obtendo localização...'}</h2>
      </div>

      {isLoading ? (
        <div className="air-page__loading">
          <div className="skeleton skeleton--banner" />
          <div className="skeleton skeleton--grid" />
        </div>
      ) : geoError || airError ? (
        <div className="card air-page__error">
          <p>⚠️ Não foi possível carregar os dados de qualidade do ar.</p>
          <small>Verifique se permitiu a localização e se a API Key do OpenWeather é válida.</small>
        </div>
      ) : air ? (
        <>
          {/* ── Banner Principal: IQA Geral ── */}
          <section className="card air-banner" style={{ borderTop: `6px solid ${air.color}` }}>
            <div className="air-banner__badge" style={{ backgroundColor: air.color }}>
              <span className="air-banner__iq-number">{air.aqi}</span>
              <span className="air-banner__iq-max">/5</span>
            </div>
            <div className="air-banner__info">
              <span className="air-banner__status" style={{ color: air.color }}>
                {air.label}
              </span>
              <h3 className="air-banner__title">Qualidade do Ar</h3>
              <p className="air-banner__desc">{air.description}</p>
            </div>
          </section>

          {/* ── Card: Condições Climáticas Complementares ── */}
          <section className="card">
            <h3 className="section-title">
              <MdWbSunny size={20} color="#F59E0B" /> Clima & Ambiente
            </h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-item__label">Temperatura</span>
                <span className="metric-item__value">{air.temp}°C</span>
              </div>
              <div className="metric-item">
                <span className="metric-item__label">
                  <MdWaterDrop size={14} color="#0284C7" /> Umidade
                </span>
                <span className="metric-item__value">{air.humidity ?? '--'}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-item__label">Vento</span>
                <span className="metric-item__value">{air.windSpeed ?? '--'} m/s</span>
              </div>
              <div className="metric-item">
                <span className="metric-item__label">
                  <MdCompress size={14} /> Pressão
                </span>
                <span className="metric-item__value">{air.pressure ?? '--'} hPa</span>
              </div>
            </div>
          </section>

          {/* ── Card: Componentes de Poluentes do Ar ── */}
          <section className="card">
            <h3 className="section-title">
              <MdAir size={20} color="#2E7D32" /> Poluentes do Ar (µg/m³)
            </h3>
            <p className="section-subtitle">Concentração dos principais gases e partículas</p>

            <div className="pollutants-grid">
              <div className="pollutant-card">
                <span className="pollutant-card__code">PM2.5</span>
                <span className="pollutant-card__name">Partículas Finas</span>
                <strong className="pollutant-card__value">{air.components?.pm2_5 ?? '--'}</strong>
              </div>

              <div className="pollutant-card">
                <span className="pollutant-card__code">PM10</span>
                <span className="pollutant-card__name">Partículas Inaláveis</span>
                <strong className="pollutant-card__value">{air.components?.pm10 ?? '--'}</strong>
              </div>

              <div className="pollutant-card">
                <span className="pollutant-card__code">O₃</span>
                <span className="pollutant-card__name">Ozônio</span>
                <strong className="pollutant-card__value">{air.components?.o3 ?? '--'}</strong>
              </div>

              <div className="pollutant-card">
                <span className="pollutant-card__code">NO₂</span>
                <span className="pollutant-card__name">Dióxido de Nitrogênio</span>
                <strong className="pollutant-card__value">{air.components?.no2 ?? '--'}</strong>
              </div>

              <div className="pollutant-card">
                <span className="pollutant-card__code">SO₂</span>
                <span className="pollutant-card__name">Dióxido de Enxofre</span>
                <strong className="pollutant-card__value">{air.components?.so2 ?? '--'}</strong>
              </div>

              <div className="pollutant-card">
                <span className="pollutant-card__code">CO</span>
                <span className="pollutant-card__name">Monóxido de Carbono</span>
                <strong className="pollutant-card__value">{air.components?.co ?? '--'}</strong>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default AirQuality