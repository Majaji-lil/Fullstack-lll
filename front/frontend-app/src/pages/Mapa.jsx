// src/pages/Mapa.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.heat'
import { API_REPORTES } from '../api/urls'

const obtenerTipo = (desc) => {
  if (!desc) return 'Reporte'
  if (desc.startsWith('[Perdida]')) return 'Perdida'
  if (desc.startsWith('[Avistada]')) return 'Avistada'
  if (desc.startsWith('[Encontrada]')) return 'Encontrada'
  return 'Reporte'
}

const limpiarDescripcion = (desc) =>
  desc ? desc.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '') : ''

const formatFecha = (f) => {
  if (!f) return ''
  try {
    return new Date(f).toLocaleString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return f }
}

const colorPorTipo = {
  Perdida: '#ef4444',
  Avistada: '#f59e0b',
  Encontrada: '#10b981',
  Reporte: '#6b7280',
}

function HeatmapLayer({ puntos }) {
  const map = useMap()

  useEffect(() => {
    if (!puntos.length) return

    const heat = L.heatLayer(puntos, {
      radius: 30,
      blur: 20,
      maxZoom: 14,
      gradient: { 0.2: '#3b82f6', 0.5: '#f59e0b', 0.8: '#ef4444' },
    }).addTo(map)

    return () => map.removeLayer(heat)
  }, [map, puntos])

  return null
}

function Mapa() {
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mostrarCalor, setMostrarCalor] = useState(true)
  const [mostrarMarcadores, setMostrarMarcadores] = useState(true)

  useEffect(() => { cargarReportes() }, [])

  const cargarReportes = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(API_REPORTES)
      setReportes(data)
      setError(null)
    } catch (err) {
      console.error('Error cargando reportes:', err)
      setError('No se pudo conectar al servicio de reportes')
    } finally {
      setLoading(false)
    }
  }

  const reportesConCoords = reportes.filter(
    r => r.latitud != null && r.longitud != null
  )

  const puntosCalor = reportesConCoords.map(r => [
    Number(r.latitud),
    Number(r.longitud),
    1,
  ])

  const centro = reportesConCoords.length
    ? [Number(reportesConCoords[0].latitud), Number(reportesConCoords[0].longitud)]
    : [-33.4489, -70.6693]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
          Mapa de actividad
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'system-ui', margin: 0 }}>
          {reportesConCoords.length} de {reportes.length} reportes con ubicación
        </p>
      </div>

      {/* Controles de capas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'system-ui', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={mostrarCalor} onChange={e => setMostrarCalor(e.target.checked)} />
          🔥 Mapa de calor
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'system-ui', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={mostrarMarcadores} onChange={e => setMostrarMarcadores(e.target.checked)} />
          📍 Marcadores individuales
        </label>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'system-ui' }}>
          Cargando mapa...
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
          borderRadius: 8, padding: '1rem', fontFamily: 'system-ui', fontSize: 14,
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && reportesConCoords.length === 0 && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8,
          padding: '1rem 1.25rem', fontFamily: 'system-ui', fontSize: 14,
          color: '#92400e', marginBottom: '1rem',
        }}>
          ⚠️ Ningún reporte tiene coordenadas todavía.
        </div>
      )}

      {!loading && (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', height: 520 }}>
          <MapContainer center={centro} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mostrarCalor && <HeatmapLayer puntos={puntosCalor} />}

            {mostrarMarcadores && reportesConCoords.map((reporte) => {
              const tipo = obtenerTipo(reporte.descripcion)
              return (
                <Marker
                  key={reporte.id}
                  position={[Number(reporte.latitud), Number(reporte.longitud)]}
                >
                  <Popup>
                    <div style={{ minWidth: 180, fontFamily: 'system-ui' }}>
                      <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>
                        🐾 {reporte.mascotaNombre || 'Mascota sin nombre'}
                      </p>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 99, marginBottom: 6,
                        background: colorPorTipo[tipo] + '22',
                        color: colorPorTipo[tipo],
                      }}>
                        {tipo}
                      </span>
                      <p style={{ fontSize: 13, margin: '0 0 4px' }}>
                        {limpiarDescripcion(reporte.descripcion)}
                      </p>
                      {reporte.usuarioNombre && (
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 2px' }}>
                          👤 Reportado por {reporte.usuarioNombre}
                        </p>
                      )}
                      {reporte.fechaHora && (
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                          📅 {formatFecha(reporte.fechaHora)}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}
    </div>
  )
}

export default Mapa