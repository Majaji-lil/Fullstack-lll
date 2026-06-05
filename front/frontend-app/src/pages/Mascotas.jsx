// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Mascotas.css'

const EMPTY = { nombre: '', especie: '', raza: '', color_caracteristica: '', tamano: '', estado: 'Perdida' }

function Mascotas() {
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const [filtroActual, setFiltroActual] = useState('Todas')

    const cargar = () => {
        setLoading(true)
        axios.get(API_MASCOTAS)
            .then(r => { setMascotas(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de mascotas'))
            .finally(() => setLoading(false))
    }
    useEffect(() => { cargar() }, [])

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm({ ...form, [key]: e.target.value }),
    })

    const openCreate = () => { setForm(EMPTY); setEditando(null); setModal(true) }

    const openEdit = (m) => {
        const esEncontrada = m.color_caracteristica?.startsWith('[Encontrada]')
        const esAvistada = m.color_caracteristica?.startsWith('[Avistada]')
        const esPerdida = m.color_caracteristica?.startsWith('[Perdida]')

        let estadoDetectado = 'Perdida'
        let colorLimpio = m.color_caracteristica || ''

        if (esEncontrada) {
            estadoDetectado = 'Encontrada'
            colorLimpio = m.color_caracteristica.replace(/^\[Encontrada\]\s*/, '')
        } else if (esAvistada) {
            estadoDetectado = 'Avistada'
            colorLimpio = m.color_caracteristica.replace(/^\[Avistada\]\s*/, '')
        } else if (esPerdida) {
            estadoDetectado = 'Perdida'
            colorLimpio = m.color_caracteristica.replace(/^\[Perdida\]\s*/, '')
        }

        setForm({
            nombre: m.nombre || '',
            especie: m.especie || '',
            raza: m.raza || '',
            color_caracteristica: colorLimpio,
            tamano: m.tamano || '',
            estado: estadoDetectado
        })
        setEditando(m)
        setModal(true)
    }

    const closeModal = () => setModal(false)

    const guardar = () => {
        const payload = {
            nombre: form.nombre,
            especie: form.especie,
            raza: form.raza,
            color_caracteristica: `[${form.estado}] ${form.color_caracteristica}`.trim(),
            tamano: form.tamano
        }

        const req = editando
            ? axios.put(`${API_MASCOTAS}/${editando.id}`, payload)
            : axios.post(API_MASCOTAS, payload)

        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`).then(cargar)
    }

    // Filtros ampliados en la vista de Mascotas
    const mascotasFiltradas = mascotas.filter(m => {
        if (filtroActual === 'Todas') return true
        if (filtroActual === 'Perdidas') {
            return m.color_caracteristica?.startsWith('[Perdida]') || !m.color_caracteristica?.startsWith('[')
        }
        if (filtroActual === 'Avistadas') {
            return m.color_caracteristica?.startsWith('[Avistada]')
        }
        if (filtroActual === 'Encontradas') {
            return m.color_caracteristica?.startsWith('[Encontrada]')
        }
        return true
    })

    return (
        <div className="mascotas-page">

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Mascotas registradas</h1>
                    <p>{mascotasFiltradas.length} mascota{mascotasFiltradas.length !== 1 ? 's' : ''} en pantalla</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Registrar mascota</Button>
            </div>

            {/* FILTROS CON LA OPCIÓN AVISTADAS INCORPORADA */}
            <div className="mascotas-filtros-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: filtroActual === 'Todas' ? '#4f46e5' : '#fff', color: filtroActual === 'Todas' ? '#fff' : '#000', fontWeight: '500' }}
                    onClick={() => setFiltroActual('Todas')}
                >
                    Todas
                </button>
                <button
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: filtroActual === 'Perdidas' ? '#ef4444' : '#fff', color: filtroActual === 'Perdidas' ? '#fff' : '#000', fontWeight: '500' }}
                    onClick={() => setFiltroActual('Perdidas')}
                >
                    ⚠️ Perdidas
                </button>
                <button
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: filtroActual === 'Avistadas' ? '#f59e0b' : '#fff', color: filtroActual === 'Avistadas' ? '#fff' : '#000', fontWeight: '500' }}
                    onClick={() => setFiltroActual('Avistadas')}
                >
                    👀 Avistadas
                </button>
                <button
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: filtroActual === 'Encontradas' ? '#10b981' : '#fff', color: filtroActual === 'Encontradas' ? '#fff' : '#000', fontWeight: '500' }}
                    onClick={() => setFiltroActual('Encontradas')}
                >
                    ✅ Encontradas
                </button>
            </div>

            {loading && <p className="mascotas-loading">Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && mascotasFiltradas.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">🐾</div>
                    <p>No hay mascotas para este filtro.</p>
                </div>
            )}

            <div className="card-grid">
                {mascotasFiltradas.map(m => {
                    const esEncontrada = m.color_caracteristica?.startsWith('[Encontrada]')
                    const esAvistada = m.color_caracteristica?.startsWith('[Avistada]')

                    let textoBadge = "Perdida"
                    let colorBadge = "red"

                    if (esEncontrada) { textoBadge = "Encontrada"; colorBadge = "green" }
                    else if (esAvistada) { textoBadge = "Avistada"; colorBadge = "orange" }

                    const colorMostrar = m.color_caracteristica?.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '') || 'Sin especificar'

                    return (
                        <InfoCard
                            key={m.id}
                            title={m.nombre || 'Sin nombre'}
                            badge={textoBadge}
                            badgeColor={colorBadge}
                            description={m.especie && `${m.especie}${m.raza ? ` · ${m.raza}` : ''}`}
                            meta={[
                                colorMostrar && `🎨 ${colorMostrar}`,
                                m.tamano && `📏 ${m.tamano}`,
                            ].filter(Boolean).join('  ·  ')}
                            onEdit={() => openEdit(m)}
                            onDelete={() => eliminar(m.id)}
                        />
                    )
                })}
            </div>

            {modal && (
                <Modal
                    title={editando ? 'Editar mascota' : 'Registrar mascota'}
                    onClose={closeModal}
                    onSave={guardar}
                >
                    <div style={{ marginBottom: '15px' }}>
                        <label className="reportes-select-label" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Estado de la Mascota *</label>
                        <select
                            className="reportes-select"
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={form.estado}
                            onChange={e => setForm({ ...form, estado: e.target.value })}
                        >
                            <option value="Perdida">Mascota Perdida ⚠️</option>
                            <option value="Avistada">Mascota Avistada 👀</option>
                            <option value="Encontrada">Mascota Encontrada ✅</option>
                        </select>
                    </div>

                    <Input label="Nombre" placeholder="Ej: Firulais"         {...field('nombre')} />
                    <Input label="Especie" placeholder="Ej: Perro, Gato"      {...field('especie')} />
                    <Input label="Raza" placeholder="Ej: Labrador"         {...field('raza')} />
                    <Input label="Color / característica" placeholder="Ej: Café con blanco" {...field('color_caracteristica')} />
                    <Input label="Tamaño" placeholder="Ej: Mediano"          {...field('tamano')} />
                </Modal>
            )}
        </div>
    )
}

export default Mascotas