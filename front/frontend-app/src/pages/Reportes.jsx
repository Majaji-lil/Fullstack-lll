// src/pages/Reportes.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_REPORTES, API_MASCOTAS } from '../api/urls'
import { useAuth } from '../context/AuthContext'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Reportes.css'

const COMUNAS = [
    { nombre: 'Cerrillos', latitud: -33.4908, longitud: -70.7078 },
    { nombre: 'Cerro Navia', latitud: -33.4258, longitud: -70.7373 },
    { nombre: 'Conchalí', latitud: -33.3817, longitud: -70.6603 },
    { nombre: 'El Bosque', latitud: -33.5680, longitud: -70.6683 },
    { nombre: 'Estación Central', latitud: -33.4569, longitud: -70.6900 },
    { nombre: 'Huechuraba', latitud: -33.3530, longitud: -70.6457 },
    { nombre: 'Independencia', latitud: -33.4167, longitud: -70.6560 },
    { nombre: 'La Cisterna', latitud: -33.5267, longitud: -70.6636 },
    { nombre: 'La Florida', latitud: -33.5167, longitud: -70.5833 },
    { nombre: 'La Granja', latitud: -33.5333, longitud: -70.6333 },
    { nombre: 'La Pintana', latitud: -33.5833, longitud: -70.6333 },
    { nombre: 'La Reina', latitud: -33.4500, longitud: -70.5333 },
    { nombre: 'Las Condes', latitud: -33.4110, longitud: -70.5680 },
    { nombre: 'Lo Barnechea', latitud: -33.3500, longitud: -70.5167 },
    { nombre: 'Lo Espejo', latitud: -33.5167, longitud: -70.6833 },
    { nombre: 'Lo Prado', latitud: -33.4500, longitud: -70.7167 },
    { nombre: 'Macul', latitud: -33.4833, longitud: -70.5833 },
    { nombre: 'Maipú', latitud: -33.5167, longitud: -70.7667 },
    { nombre: 'Ñuñoa', latitud: -33.4569, longitud: -70.5990 },
    { nombre: 'Pedro Aguirre Cerda', latitud: -33.5000, longitud: -70.6833 },
    { nombre: 'Peñalolén', latitud: -33.4833, longitud: -70.5333 },
    { nombre: 'Providencia', latitud: -33.4326, longitud: -70.6189 },
    { nombre: 'Pudahuel', latitud: -33.4333, longitud: -70.7667 },
    { nombre: 'Quilicura', latitud: -33.3667, longitud: -70.7333 },
    { nombre: 'Quinta Normal', latitud: -33.4333, longitud: -70.7000 },
    { nombre: 'Recoleta', latitud: -33.4000, longitud: -70.6333 },
    { nombre: 'Renca', latitud: -33.4000, longitud: -70.7167 },
    { nombre: 'San Joaquín', latitud: -33.4833, longitud: -70.6333 },
    { nombre: 'San Miguel', latitud: -33.5000, longitud: -70.6500 },
    { nombre: 'San Ramón', latitud: -33.5500, longitud: -70.6500 },
    { nombre: 'Santiago', latitud: -33.4489, longitud: -70.6693 },
    { nombre: 'Vitacura', latitud: -33.3833, longitud: -70.5833 },
]

const EMPTY_FORM = {
    descripcion: '',
    fechaHora: '',
    mascotaId: '',
    crearNuevaMascota: false,
    nuevaMascota: { nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '' },
    comuna: '',
    tipo: 'Perdida',
}

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
    return <img src={preview} alt="Preview" className="foto-preview-img" />
}

function ReporteCard({ reporte, onEdit, onDelete }) {
    const [fotoOk, setFotoOk] = useState(true)
    return (
        <div className="reporte-card">
            {reporte.mascotaId && fotoOk ? (
                <img
                    src={fotoUrl(reporte.mascotaId)}
                    alt="Mascota"
                    onError={() => setFotoOk(false)}
                    className="reporte-card__img"
                />
            ) : (
                <div className="reporte-card__placeholder">📋</div>
            )}
            <div className="reporte-card__content">
                <InfoCard
                    title={reporte.descripcion ? reporte.descripcion.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '') : ''}
                    badge={obtenerTextoBadge(reporte.descripcion, reporte.mascotaNombre)}
                    badgeColor={obtenerColorBadge(reporte.descripcion)}
                    meta={buildMeta(reporte)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    )
}

const formatFecha = (f) => {
    if (!f) return null
    try {
        return new Date(f).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })
    } catch { return f }
}

const buildMeta = (r) => {
    const partes = []
    if (r.mascotaNombre) partes.push('🐾 ' + r.mascotaNombre)
    if (r.fechaHora) partes.push('📅 ' + formatFecha(r.fechaHora))
    if (r.usuarioNombre) partes.push('👤 ' + r.usuarioNombre)
    return partes.join('  ·  ')
}

const formatearFechaParaJava = (fechaStr) => {
    if (!fechaStr) return null
    return fechaStr.length === 16 ? fechaStr + ':00' : fechaStr
}

const formatearFechaParaInput = (fechaStr) => {
    if (!fechaStr) return ''
    return fechaStr.substring(0, 16)
}

const obtenerColorBadge = (desc) => {
    if (desc && desc.includes('[Perdida]')) return 'red'
    if (desc && desc.includes('[Avistada]')) return 'orange'
    return 'green'
}

const obtenerTextoBadge = (desc, defecto) => {
    if (desc && desc.startsWith('[Perdida]')) return 'Perdida'
    if (desc && desc.startsWith('[Avistada]')) return 'Avistada'
    if (desc && desc.startsWith('[Encontrada]')) return 'Encontrada'
    return defecto || 'Reporte'
}

const buscarComunaPorCoords = (lat, lng) => {
    if (lat == null || lng == null) return null
    let masCercana = null
    let menorDistancia = Infinity
    for (const c of COMUNAS) {
        const d = Math.sqrt((c.latitud - lat) ** 2 + (c.longitud - lng) ** 2)
        if (d < menorDistancia) { menorDistancia = d; masCercana = c.nombre }
    }
    return masCercana
}

function Reportes() {
    const [reportes, setReportes] = useState([])
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [fotoFile, setFotoFile] = useState(null)
    const [formError, setFormError] = useState('')
    const [guardando, setGuardando] = useState(false)
    const [filtroActual, setFiltroActual] = useState('Todas')
    const { usuario, isAdmin } = useAuth()

    const cargar = () => {
        setLoading(true)
        Promise.all([axios.get(API_REPORTES), axios.get(API_MASCOTAS)])
            .then(([rR, rM]) => {
                setReportes(rR.data)
                setMascotas(rM.data)
                setError(null)
            })
            .catch(() => setError('No se pudo conectar con el servidor'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => {
        setForm(EMPTY_FORM)
        setEditando(null)
        setFotoFile(null)
        setFormError('')
        setModal(true)
    }

    const openEdit = (reporte) => {
        setFormError('')
        setEditando(reporte)
        setFotoFile(null)

        const rawDesc = reporte.descripcion || ''
        let tipoDetectado = 'Perdida'
        let descLimpia = rawDesc

        if (rawDesc.startsWith('[Encontrada]')) {
            tipoDetectado = 'Encontrada'
            descLimpia = rawDesc.replace(/^\[Encontrada\]\s*/, '')
        } else if (rawDesc.startsWith('[Avistada]')) {
            tipoDetectado = 'Avistada'
            descLimpia = rawDesc.replace(/^\[Avistada\]\s*/, '')
        } else if (rawDesc.startsWith('[Perdida]')) {
            tipoDetectado = 'Perdida'
            descLimpia = rawDesc.replace(/^\[Perdida\]\s*/, '')
        }

        const comunaDetectada = buscarComunaPorCoords(reporte.latitud, reporte.longitud) || ''

        setForm({
            descripcion: descLimpia,
            fechaHora: formatearFechaParaInput(reporte.fechaHora),
            mascotaId: reporte.mascotaId ? String(reporte.mascotaId) : '',
            crearNuevaMascota: false,
            nuevaMascota: { nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '' },
            comuna: comunaDetectada,
            tipo: tipoDetectado,
        })
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
        setEditando(null)
        setFotoFile(null)
        setFormError('')
    }

    const handleMascotaNuevaChange = (campo, valor) =>
        setForm(prev => ({ ...prev, nuevaMascota: { ...prev.nuevaMascota, [campo]: valor } }))

    const puedeEditar = (reporte) => {
        if (!usuario) return true // En desarrollo permitimos editar siempre
        if (isAdmin) return true
        return reporte.usuarioId === usuario.id
    }

    const guardar = async () => {
        setFormError('')
        const f = form

        if (!f.descripcion.trim()) { setFormError('La descripción es obligatoria'); return }
        if (!f.comuna) { setFormError('Debes seleccionar una comuna'); return }
        if (!f.fechaHora) { setFormError('La fecha y hora son obligatorias'); return }

        if (!editando && !f.crearNuevaMascota && !f.mascotaId) {
            setFormError('Selecciona una mascota o registra una nueva')
            return
        }

        setGuardando(true)
        let mascotaCreadaId = null

        try {
            let mascotaIdFinal = f.mascotaId ? Number(f.mascotaId) : (editando ? editando.mascotaId : null)

            if (!editando && f.crearNuevaMascota) {
                const payloadMascotaNueva = {
                    nombre: f.nuevaMascota.nombre.trim(),
                    especie: f.nuevaMascota.especie.trim(),
                    raza: f.nuevaMascota.raza.trim() || null,
                    colorCaracteristica: `[${f.tipo}] ${f.nuevaMascota.colorCaracteristica.trim()}`.trim(),
                    tamano: f.nuevaMascota.tamano.trim() || null,
                    usuarioId: usuario?.id || null,
                    usuarioNombre: usuario?.nombres || null,
                }

                const { data: mascotaGuardada } = await axios.post(API_MASCOTAS, payloadMascotaNueva)
                mascotaIdFinal = mascotaGuardada.id
                mascotaCreadaId = mascotaGuardada.id

                if (fotoFile && mascotaIdFinal) {
                    const formData = new FormData()
                    formData.append('archivo', fotoFile)
                    await axios.post(`${API_MASCOTAS}/${mascotaIdFinal}/foto`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                }
            }

            const comunaData = COMUNAS.find(c => c.nombre === f.comuna)
            const payloadReporte = {
                descripcion: '[' + f.tipo + '] ' + f.descripcion.trim(),
                fechaHora: formatearFechaParaJava(f.fechaHora),
                mascotaId: mascotaIdFinal,
                longitud: comunaData ? comunaData.longitud : null,
                latitud: comunaData ? comunaData.latitud : null,
                usuarioId: usuario?.id || null,
            }

            if (editando) {
                await axios.put(`${API_REPORTES}/${editando.id}`, payloadReporte)
            } else {
                await axios.post(API_REPORTES, payloadReporte)
            }

            closeModal()
            cargar()
        } catch (err) {
            if (mascotaCreadaId) {
                try { await axios.delete(`${API_MASCOTAS}/${mascotaCreadaId}`) } catch { }
            }
            setFormError('Error crítico al guardar el reporte.')
        } finally {
            setGuardando(false)
        }
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar este reporte?')) return
        axios.delete(`${API_REPORTES}/${id}`).then(() => cargar())
    }

    const reportesFiltrados = reportes.filter(r => {
        if (filtroActual === 'Todas') return true
        return r.descripcion && r.descripcion.startsWith(`[${filtroActual.slice(0, -1)}]`)
    })

    return (
        <div className="reportes-page">
            <div className="page-header">
                <div>
                    <h1>Reportes</h1>
                    <p>{reportesFiltrados.length} activos</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            <div className="reportes-filtros-bar">
                {['Todas', 'Perdidas', 'Avistadas', 'Encontradas'].map(t => (
                    <button
                        key={t}
                        className={`filtro-btn ${filtroActual === t ? 'activo-' + t.toLowerCase() : ''}`}
                        onClick={() => setFiltroActual(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="card-grid">
                {reportesFiltrados.map(r => (
                    <ReporteCard
                        key={r.id}
                        reporte={r}
                        onEdit={puedeEditar(r) ? () => openEdit(r) : undefined}
                        onDelete={puedeEditar(r) ? () => eliminar(r.id) : undefined}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    title={editando ? 'Editar reporte' : 'Nuevo reporte'}
                    onClose={closeModal}
                    onSave={guardar}
                    saveLabel={guardando ? 'Guardando...' : 'Publicar'}
                >
                    <div className="reportes-form-group">
                        <label className="reportes-select-label">Estado del Reporte *</label>
                        <select className="reportes-select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                            <option value="Perdida">Mascota Perdida</option>
                            <option value="Avistada">Mascota Avistada</option>
                            <option value="Encontrada">Mascota Encontrada</option>
                        </select>
                    </div>

                    <Input label="Descripción *" textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                    <Input label="Fecha y hora *" type="datetime-local" value={form.fechaHora} onChange={e => setForm({ ...form, fechaHora: e.target.value })} />

                    {!editando && (
                        <>
                            <hr className="reportes-form-divider" />
                            <div className="reportes-mascota-section">
                                <label className="checkbox-nueva-mascota-label">
                                    <input type="checkbox" checked={form.crearNuevaMascota} onChange={e => setForm(prev => ({ ...prev, crearNuevaMascota: e.target.checked, mascotaId: '' }))} />
                                    <span>La mascota no está en la lista (registrar ahora)</span>
                                </label>

                                {!form.crearNuevaMascota ? (
                                    <div className="reportes-select-wrapper">
                                        <label className="reportes-select-label">Mascota *</label>
                                        <select className="reportes-select" value={form.mascotaId} onChange={e => setForm({ ...form, mascotaId: e.target.value })}>
                                            <option value="">Selecciona una mascota...</option>
                                            {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="nueva-mascota-subform">
                                        <p className="subform-title">Datos de la nueva mascota</p>
                                        <div className="subform-grid">
                                            <Input label="Nombre *" value={form.nuevaMascota.nombre} onChange={e => handleMascotaNuevaChange('nombre', e.target.value)} />
                                            <Input label="Especie *" value={form.nuevaMascota.especie} onChange={e => handleMascotaNuevaChange('especie', e.target.value)} />
                                            <Input label="Raza" value={form.nuevaMascota.raza} onChange={e => handleMascotaNuevaChange('raza', e.target.value)} />
                                            <Input label="Características" value={form.nuevaMascota.colorCaracteristica} onChange={e => handleMascotaNuevaChange('colorCaracteristica', e.target.value)} />
                                            <Input label="Tamaño" value={form.nuevaMascota.tamano} onChange={e => handleMascotaNuevaChange('tamano', e.target.value)} />
                                        </div>

                                        {/* SECCIÓN DE LA FOTO VINCULADA NATIVAMENTE AL CSS */}
                                        <div className="form-foto-section">
                                            <label className="form-foto-label">Foto de la mascota (opcional)</label>
                                            <FotoPreview file={fotoFile} />
                                            <label className="form-foto-picker">
                                                <span>📷</span>
                                                <span>{fotoFile ? fotoFile.name : 'Elegir foto...'}</span>
                                                <input type="file" accept="image/*" className="form-foto-input-hidden" onChange={e => setFotoFile(e.target.files[0] || null)} />
                                            </label>
                                            {fotoFile && <button type="button" onClick={() => setFotoFile(null)} className="form-foto-remove">× Quitar</button>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <hr className="reportes-form-divider" />
                    <div className="reportes-ubicacion-section">
                        <label className="reportes-select-label">Comuna *</label>
                        <select className="reportes-select" value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })}>
                            <option value="">-- Selecciona --</option>
                            {COMUNAS.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                        </select>
                    </div>
                    {formError && <div className="reportes-form-error">⚠️ {formError}</div>}
                </Modal>
            )}
        </div>
    )
}