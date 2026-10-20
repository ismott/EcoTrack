import { useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MdDirectionsBus, MdAccessTime, MdPlace, MdDirections } from 'react-icons/md'
import 'leaflet/dist/leaflet.css'
import './Transport.css'

// Ícone personalizado para o ônibus e paradas
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const stopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
  popupAnchor: [0, -22],
})

interface RouteData {
  id: string
  code: string
  name: string
  etaMinutes: number
  color: string
  path: [number, number][]
  busPosition: [number, number]
  stops: { name: string; coords: [number, number] }[]
}

const MOCK_ROUTES: RouteData[] = [
  {
    id: '8000-10',
    code: '8000-10',
    name: 'Term. Lapa ↔ Praça Ramos',
    etaMinutes: 3,
    color: '#1565C0',
    busPosition: [-23.5505, -46.6333],
    path: [
      [-23.542, -46.645],
      [-23.548, -46.639],
      [-23.5505, -46.6333],
      [-23.555, -46.628],
    ],
    stops: [
      { name: 'Estação Lapa', coords: [-23.542, -46.645] },
      { name: 'Parada República', coords: [-23.548, -46.639] },
      { name: 'Ponto Central (Atual)', coords: [-23.5505, -46.6333] },
      { name: 'Praça Ramos', coords: [-23.555, -46.628] },
    ],
  },
  {
    id: '875P-10',
    code: '875P-10',
    name: 'Metro Ana Rosa ↔ Lapa',
    etaMinutes: 8,
    color: '#2E7D32',
    busPosition: [-23.58, -46.638],
    path: [
      [-23.56, -46.655],
      [-23.57, -46.648],
      [-23.58, -46.638],
      [-23.59, -46.63],
    ],
    stops: [
      { name: 'Av. Paulista / Consolação', coords: [-23.56, -46.655] },
      { name: 'MASP', coords: [-23.57, -46.648] },
      { name: 'Estação Ana Rosa', coords: [-23.58, -46.638] },
      { name: 'Vila Mariana', coords: [-23.59, -46.63] },
    ],
  },
  {
    id: '5110-10',
    code: '5110-10',
    name: 'Term. São Mateus ↔ Term. Mercado',
    etaMinutes: 14,
    color: '#E65100',
    busPosition: [-23.565, -46.62],
    path: [
      [-23.545, -46.628],
      [-23.555, -46.624],
      [-23.565, -46.62],
      [-23.575, -46.612],
    ],
    stops: [
      { name: 'Term. Mercado', coords: [-23.545, -46.628] },
      { name: 'Parada Dom Pedro', coords: [-23.555, -46.624] },
      { name: 'Av. Estado', coords: [-23.565, -46.62] },
      { name: 'Ipiranga / Tamanduateí', coords: [-23.575, -46.612] },
    ],
  },
]

function Transport() {
  const [selectedRoute, setSelectedRoute] = useState<RouteData>(MOCK_ROUTES[0])

  return (
    <div className="transport-page">
      {/* ── Seletor de Linhas ── */}
      <div className="routes-selector">
        <h2 className="routes-selector__title">
          <MdDirectionsBus size={22} color="var(--color-primary)" /> Linhas de Ônibus Ativas
        </h2>
        <div className="routes-selector__list">
          {MOCK_ROUTES.map((route) => (
            <button
              key={route.id}
              className={`route-tab ${
                selectedRoute.id === route.id ? 'route-tab--active' : ''
              }`}
              onClick={() => setSelectedRoute(route)}
              style={{
                borderLeftColor: route.color,
              }}
            >
              <div className="route-tab__header">
                <span className="route-tab__code" style={{ backgroundColor: route.color }}>
                  {route.code}
                </span>
                <span className="route-tab__eta">
                  <MdAccessTime size={13} /> {route.etaMinutes} min
                </span>
              </div>
              <span className="route-tab__name">{route.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Container do Mapa Interativo ── */}
      <section className="card map-wrapper">
        <div className="map-wrapper__info">
          <div className="map-wrapper__title">
            <MdDirections size={18} color={selectedRoute.color} />
            <span>Exibindo rota: <strong>{selectedRoute.code}</strong></span>
          </div>
          <span className="map-wrapper__badge" style={{ backgroundColor: selectedRoute.color }}>
            Em movimento
          </span>
        </div>

        <div className="map-container-box">
          <MapContainer
            key={selectedRoute.id}
            center={selectedRoute.busPosition}
            zoom={13}
            scrollWheelZoom={false}
            className="leaflet-map"
          >
            {/* TileLayer oficial gratuito e sem marca d'água */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Traçado da Rota selecionada */}
            <Polyline
              positions={selectedRoute.path}
              pathOptions={{ color: selectedRoute.color, weight: 6, opacity: 0.85 }}
            />

            {/* Marcador do Ônibus em Tempo Real */}
            <Marker position={selectedRoute.busPosition} icon={busIcon}>
              <Popup>
                <strong>Ônibus {selectedRoute.code}</strong> <br />
                A caminho da próxima parada em ~{selectedRoute.etaMinutes} min.
              </Popup>
            </Marker>

            {/* Marcadores das Paradas */}
            {selectedRoute.stops.map((stop, idx) => (
              <Marker key={idx} position={stop.coords} icon={stopIcon}>
                <Popup>
                  <MdPlace color={selectedRoute.color} /> {stop.name}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  )
}

export default Transport