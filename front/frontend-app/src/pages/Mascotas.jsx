// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'
import { useAuth } from '../context/AuthContext'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Mascotas.css'

const EMPTY = { nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '', estado: 'Perdida' }

const fotoUrl = (id) => `${import.meta.env.VITE_API_BASE || 'http://localhost:8090'}/api/mascotas/${id}/foto`

function FotoPreview({ file }) {
    const [preview, setPreview] = useState(null)
    useEffect(() => {
        if (!file) { setPreview(null); return }
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    if (!preview) return null
    return <img src={preview} alt="Preview" className="mascota-foto-preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', marginTop: '10px' }} />
}

// Subcomponente independiente con Zoom incorporado
function MascotaCard({ m, cacheBuster, puedeEditarMascota, openEdit, eliminar }) {
    const [fotoOk, setFotoOk] = useState(true)
    const [zoomActivo, setZoomActivo] = useState(false) // Estado para el zoom

    useEffect(() => {
        setFotoOk(true)
    }, [cacheBuster, m.id])

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
    const urlImagenCompleta = `${fotoUrl(m.id)}?t=${cacheBuster}`

    return (
        <div className="mascota-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '8px', border: '1px solid #eee' }}>
            {fotoOk ? (
                <img
                    src={urlImagenCompleta}
                    alt={m.nombre}
                    className="mascota-card__img"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                    onError={() => setFotoOk(false)}
                    onClick={() => setZoomActivo(true)} // Activa zoom al hacer click
                />
            ) : (
                <div className="mascota-card__placeholder" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontSize: '2rem' }}>🐾</div>
            )}
            <div className="mascota-card__content" style={{ padding: '1rem', flexGrow: 1 }}>
                <InfoCard
                    title={m.nombre || 'Sin nombre'}
                    badge={textoBadge}
                    badgeColor={colorBadge}
                    description={m.especie && `${m.especie}${m.raza ? ` · ${m.raza}` : ''}`}
                    meta={[
                        colorMostrar && `🎨 ${colorMostrar}`,
                        m.tamano && `📏 ${m.tamano}`,
                    ].filter(Boolean).join('  ·  ')}
                    onEdit={puedeEditarMascota(m) ? () => openEdit(m) : undefined}
                    onDelete={puedeEditarMascota(m) ? () => eliminar(m.id) : undefined}
                />
            </div>

            {/* Modal de Zoom */}
            {zoomActivo && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10000, cursor: 'zoom-out'
                    }}
                    onClick={() => setZoomActivo(false)} // Cierra zoom al hacer click
                >
                    <img
                        src={urlImagenCompleta}
                        alt="Zoom de Mascota"
                        style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    />
                </div>
            )}
        </div>
    )
}

export default function Mascotas() {
    const [mascotas, setMascotas] = useState([])
    const [cacheBuster, setCacheBuster] = useState(Date.now())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [fotoFile, setFotoFile] = useState(null)
    const [filtroActual, setFiltroActual] = useState('Todas')
    const { usuario, isAdmin } = useAuth()

    const cargar = () => {
        setLoading(true)
        axios.get(API_MASCOTAS)
            .then(r => {
                setMascotas(r.data)
                setCacheBuster(Date.now())
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
        setFotoFile(null)
        setModal(true)
    }

    const openEdit = (m) => {
        setFotoFile(null)
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

    const closeModal = () => {
        setModal(false)
        setFotoFile(null)
    }

    const puedeEditarMascota = (mascota) => {
        if (!usuario) return false
        if (isAdmin) return true
        return mascota.usuarioId === usuario.id
    }

    const guardar = () => {
        if (!usuario) {
            alert('Debes iniciar sesión para guardar una mascota.')
            return
        }

        const payload = {
            nombre: form.nombre.trim(),
            especie: form.especie.trim(),
            raza: form.raza.trim() || null,
            colorCaracteristica: `[${form.estado}] ${form.colorCaracteristica.trim()}`.trim(),
            tamano: form.tamano.trim() || null,
            usuarioId: editando ? editando.usuarioId : usuario.id,
            usuarioNombre: editando ? editando.usuarioNombre : (usuario.nombres || null)
        }

        const req = editando
            ? axios.put(`${API_MASCOTAS}/${editando.id}`, payload)
            : axios.post(API_MASCOTAS, payload)

        req.then(async (res) => {
            const mascotaId = editando ? editando.id : res.data.id

            if (fotoFile && mascotaId) {
                const formData = new FormData()
                formData.append('archivo', fotoFile)
                try {
                    await axios.post(`${API_MASCOTAS}/${mascotaId}/foto`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                } catch (imgErr) {
                    console.error('Error subiendo la foto:', imgErr)
                }
            }

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
                {mascotasFiltradas.map(m => (
                    <MascotaCard
                        key={m.id}
                        m={m}
                        cacheBuster={cacheBuster}
                        puedeEditarMascota={puedeEditarMascota}
                        openEdit={openEdit}
                        eliminar={eliminar}
                    />
                ))}
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

                    <div className="mascota-upload-section" style={{ marginTop: '1rem' }}>
                        <label className="mascota-upload-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Foto de la mascota</label>
                        <FotoPreview file={fotoFile} />
                        <input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files[0] || null)} style={{ marginTop: '5px' }} />
                    </div>
                </Modal>
            )}
        </div>
    )
}