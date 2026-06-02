import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

// SVG inline do pin no estilo Hora Dourada. Evita o bug do marker default
// do Leaflet que não carrega os assets em projetos Vite.
const PIN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
       fill="#F9A03F" stroke="#0B1B3D" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3" fill="#0B1B3D"/>
  </svg>
`

const cityPin = L.divIcon({
  html: PIN_SVG,
  className: 'skytime-marker', // remove o background quadrado default do divIcon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// Pequeno helper interno: quando location muda, recentra o mapa sem recriar.
function RecenterOnChange({ position }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true })
  }, [map, position[0], position[1]])
  return null
}

/**
 * Mapa de localização da cidade — Zona 3 da jornada.
 * Tiles do CartoDB Dark Matter pra combinar com o fundo graphite editorial.
 *
 * Props:
 *   latitude, longitude: coordenadas do centro/pin
 *   cityName: usado em aria-label (não tem balão visível)
 */
export default function CityMap({ latitude, longitude, cityName }) {
  const position = useMemo(() => [latitude, longitude], [latitude, longitude])
  const mapRef = useRef(null)

  return (
    <div
      className="rounded-3xl overflow-hidden border border-cream/10 shadow-md h-64 lg:h-full min-h-[16rem]"
      aria-label={`Mapa de ${cityName}`}
    >
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        zoomControl={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={cityPin} />
        <RecenterOnChange position={position} />
      </MapContainer>
    </div>
  )
}
