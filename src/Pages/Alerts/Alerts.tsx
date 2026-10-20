import { useState } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import {
  MdWarning,
  MdCheckCircle,
  MdErrorOutline,
  MdShield,
  MdLocationOn,
  MdRefresh,
} from 'react-icons/md'
import 'leaflet/dist/leaflet.css'
import './Alerts.css'

// Ícone personalizado para os pontos de monitoramento
const sensorIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

interface RegionAlert {
  id: string
  name: string
  status: 'safe' | 'warning' | 'danger'
  title: string
  description: string
  riverLevel: string
  rainProbability: string
  lastUpdated: string
  center: [number, number]
  radiusMeters: number
}

const MOCK_REGIONS: RegionAlert[] = [
  {
    id: 'ipiranga',
    name: 'Ipiranga / Tamanduateí',
    status: 'safe',
    title: 'Sem Risco no Momento',
    description: 'Nenhum ponto de alagamento ativo no raio de monitoramento da ONG.',
    riverLevel: 'Normal (1.2m)',
    rainProbability: '15%',
    lastUpdated: 'Atualizado há 5 min',
    center: [-23.575, -46.612],
    radiusMeters: 1800,
  },
  {
    id: 'marginal-tiete',
    name: 'Marginal Tietê / Cumbica',
    status: 'warning',
    title: 'Atenção — Risco Moderado',
    description: 'Elevação rápida do nível do rio devido às chuvas na cabeceira.',
    riverLevel: 'Atenção (3.4m)',
    rainProbability: '70%',
    lastUpdated: 'Atualizado há 2 min',
    center: [-23.518, -46.622],
    radiusMeters: 2200,
  },
  {
    id: 'anhangabau',
    name: 'Vale do Anhangabaú',
    status: 'danger',
    title: 'Alerta Vermelho — Alagamento Ativo',
    description: 'Ponto de alagamento com acúmulo de água registrado na via.',
    riverLevel: 'Crítico (4.1m)',
    rainProbability: '90%',
    lastUpdated: 'Atualizado agora',
    center: [-23.546, -46.638],
    radiusMeters: 1200,
  },
]

function getStatusTheme(status: 'safe' | 'warning' | 'danger') {
  switch (status) {
    case 'safe':
      return {
        color: '#2E7D32',
        bgColor: '#E8F5E9',
        icon: <MdCheckCircle size={40} className="alert-badge__icon alert-badge__icon--safe" />,
        badgeText: 'Seguro',
      }
    case 'warning':
      return {
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        icon: <MdWarning size={40} className="alert-badge__icon alert-badge__icon--warning" />,
        badgeText: 'Atenção',
      }
    case 'danger':
      return {
        color: '#C62828',
        bgColor: '#FFEBEE',
        icon: <MdErrorOutline size={40} className="alert-badge__icon alert-badge__icon--danger" />,
        badgeText: 'Perigo',
      }
  }
}

function Alerts() {
  const [selectedRegion, setSelectedRegion] = useState<RegionAlert>(MOCK_REGIONS[0])
  const theme = getStatusTheme(selectedRegion.status)

  return (
    <div className="alerts-page">
      {/* ── Seletor de Regiões ── */}
      <div className="region-selector">
        <h2 className="region-selector__title">
          <MdShield size={22} color="var(--color-primary)" /> Monitoramento de Zonas
        </h2>
        <div className="region-selector__tabs">
          {MOCK_REGIONS.map((region) => (
            <button
              key={region.id}
              className={`region-tab ${
                selectedRegion.id === region.id ? 'region-tab--active' : ''
              }`}
              onClick={() => setSelectedRegion(region)}
            >
              <MdLocationOn size={16} />
              <span>{region.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Banner de Alerta Principal ── */}
      <section className="card alert-banner" style={{ borderLeft: `6px solid ${theme.color}` }}>
        <div className="alert-banner__top">
          <div className="alert-banner__icon-box">{theme.icon}</div>
          <div className="alert-banner__header">
            <span
              className="alert-banner__status-pill"
              style={{ backgroundColor: theme.bgColor, color: theme.color }}
            >
              {theme.badgeText}
            </span>
            <h3 className="alert-banner__title">{selectedRegion.title}</h3>
          </div>
        </div>

        <p className="alert-banner__desc">{selectedRegion.description}</p>

        <div className="alert-banner__metrics">
          <div className="alert-metric">
            <span className="alert-metric__label">Nível do Rio</span>
            <strong className="alert-metric__value">{selectedRegion.riverLevel}</strong>
          </div>
          <div className="alert-metric">
            <span className="alert-metric__label">Chance de Chuva</span>
            <strong className="alert-metric__value">{selectedRegion.rainProbability}</strong>
          </div>
        </div>

        <div className="alert-banner__footer">
          <span>{selectedRegion.name}</span>
          <span className="alert-banner__update">
            <MdRefresh size={14} /> {selectedRegion.lastUpdated}
          </span>
        </div>
      </section>

      {/* ── Mapa do Raio de Alagamento ── */}
      <section className="card alert-map-card">
        <div className="alert-map-card__header">
          <h3>Mapa de Raio de Risco</h3>
          <span className="alert-map-card__sub">Área monitorada em tempo real</span>
        </div>

        <div className="alert-map-box">
          <MapContainer
            key={selectedRegion.id}
            center={selectedRegion.center}
            zoom={13}
            scrollWheelZoom={false}
            className="leaflet-map"
          >
            {/* TileLayer oficial gratuito e sem marca d'água */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Demarcação do raio de alerta */}
            <Circle
              center={selectedRegion.center}
              radius={selectedRegion.radiusMeters}
              pathOptions={{
                color: theme.color,
                fillColor: theme.color,
                fillOpacity: 0.25,
                weight: 2,
              }}
            />

            {/* Marcador do Sensor de Monitoramento */}
            <Marker position={selectedRegion.center} icon={sensorIcon}>
              <Popup>
                <strong>Estação {selectedRegion.name}</strong> <br />
                Status: {selectedRegion.title}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </div>
  )
}

export default Alerts