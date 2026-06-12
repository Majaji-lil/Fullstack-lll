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

const EMPTY = { nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '', estado: 'Perdida' }

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
            .then(r => { 
                setMascotas(r.data)
                setError(null) 
            })
            .catch(() => setError('No se pudo conectar al servicio de mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm({ ...form, [key]: e.target.value }),
    })

    const openCreate = () => { 
        setForm(EMPTY)
        setEditando(null)
        setModal(true) 
    }

    const openEdit = (m) => {
        const rawColor = m.colorCaracteristica || m.color_caracteristica || ''
        
        const esEncontrada = rawColor.startsWith('[Encontrada]')
        const esAvistada = rawColor.startsWith('[Avistada]')
        const esPerdida = rawColor.startsWith('[Perdida]')

        let estadoDetectado = 'Perdida'
        let colorLimpio = rawColor

        if (esEncontrada) {
            estadoDetectado = 'Encontrada'
            colorLimpio = rawColor.replace(/^\[Encontrada\]\s*/, '')
        } else if (esAvistada) {
            estadoDetectado = 'Avistada'
            colorLimpio = rawColor.replace(/^\[Avistada\]\s*/, '')
        } else if (esPerdida) {
            estadoDetectado = 'Perdida'
            colorLimpio = rawColor.replace(/^\[Perdida\]\s*/, '')
        }

        setForm({
            nombre: m.nombre || '',
            especie: m.especie || '',
            raza: m.raza || '',
            colorCaracteristica: colorLimpio, 
            tamano: m.tamano || '',
            estado: estadoDetectado
        })
        setEditando(m)
        setModal(true)
    }

    const closeModal = () => setModal(false)

    const guardar = () => {
        const payload = {
            nombre: form.nombre.trim(),
            especie: form.especie.trim(),
            raza: form.raza.trim() || null,
            colorCaracteristica: `[${form.estado}] ${form.colorCaracteristica.trim()}`.trim(),
            tamano: form.tamano.trim() || null
        }

        const req = editando
            ? axios.put(`${API_MASCOTAS}/${editando.id}`, payload)
            : axios.post(API_MASCOTAS, payload)

        req.then(() => { 
            closeModal()
            cargar() 
        }).catch(() => alert('Error al guardar la mascota'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`).then(cargar)
    }

    const mascotasFiltradas = mascotas.filter(m => {
        const rawColor = m.colorCaracteristica || m.color_caracteristica || ''
        if (filtroActual === 'Todas') return true
        if (filtroActual === 'Perdidas') {
            return rawColor.startsWith('[Perdida]') || !rawColor.startsWith('[')
        }
        if (filtroActual === 'Avistadas') {
            return rawColor.startsWith('[Avistada]')
        }
        if (filtroActual === 'Encontradas') {
            return rawColor.startsWith('[Encontrada]')
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

            <div className="mascotas-filtros-bar">
                <button 
                    className={`m-filtro-btn m-btn-todas ${filtroActual === 'Todas' ? 'activo' : ''}`} 
                    onClick={() => setFiltroActual('Todas')}
                >
                    Todas
                </button>
                <button 
                    className={`m-filtro-btn m-btn-perdidas ${filtroActual === 'Perdidas' ? 'activo' : ''}`} 
                    onClick={() => setFiltroActual('Perdidas')}
                >
                    ⚠️ Perdidas
                </button>
                <button 
                    className={`m-filtro-btn m-btn-avistadas ${filtroActual === 'Avistadas' ? 'activo' : ''}`} 
                    onClick={() => setFiltroActual('Avistadas')}
                >
                    👀 Avistadas
                </button>
                <button 
                    className={`m-filtro-btn m-btn-encontradas ${filtroActual === 'Encontradas' ? 'activo' : ''}`} 
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
                    const rawColor = m.colorCaracteristica || m.color_caracteristica || ''
                    const esEncontrada = rawColor.startsWith('[Encontrada]')
                    const esAvistada = rawColor.startsWith('[Avistada]')

                    let textoBadge = "Perdida"
                    let colorBadge = "red"

                    if (esEncontrada) { 
                        textoBadge = "Encontrada"; colorBadge = "green" 
                    } else if (esAvistada) { 
                        textoBadge = "Avistada"; colorBadge = "orange" 
                    }

                    const colorMostrar = rawColor.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '') || 'Sin especificar'

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
                    <div className="mascotas-form-group">
                        <label className="mascotas-select-label">Estado de la Mascota *</label>
                        <select
                            className="mascotas-select"
                            value={form.estado}
                            onChange={e => setForm({ ...form, estado: e.target.value })}
                        >
                            <option value="Perdida">Mascota Perdida ⚠️</option>
                            <option value="Avistada">Mascota Avistada 👀</option>
                            <option value="Encontrada">Mascota Encontrada ✅</option>
                        </select>
                    </div>

                    <Input label="Nombre" placeholder="Ej: Firulais" {...field('nombre')} />
                    <Input label="Especie" placeholder="Ej: Perro, Gato" {...field('especie')} />
                    <Input label="Raza" placeholder="Ej: Labrador" {...field('raza')} />
                    <Input label="Color / característica" placeholder="Ej: Café con blanco" {...field('colorCaracteristica')} />
                    <Input label="Tamaño" placeholder="Ej: Mediano" {...field('tamano')} />
                </Modal>
            )}
        </div>
    )
}

export default Mascotas;