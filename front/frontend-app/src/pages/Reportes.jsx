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

const formatFecha = (f) => {
    if (!f) return null
    try {
        return new Date(f).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    } catch { return f }
}

const buildMeta = (r) => {
    const partes = []
    if (r.mascotaNombre) partes.push('🐾 ' + r.mascotaNombre)
    if (r.fechaHora) partes.push('📅 ' + formatFecha(r.fechaHora))
    if (r.ubicacion && r.ubicacion.comuna) partes.push('📍 ' + r.ubicacion.comuna)
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

function Reportes() {
    const [reportes, setReportes] = useState([])
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [formError, setFormError] = useState('')
    const [guardando, setGuardando] = useState(false)
    const [filtroActual, setFiltroActual] = useState('Todas')
    const { usuario } = useAuth()

    const cargar = () => {
        setLoading(true)
        Promise.all([axios.get(API_REPORTES), axios.get(API_MASCOTAS)])
            .then(([rR, rM]) => {
                setReportes(rR.data)
                setMascotas(rM.data)
                setError(null)
            })
            .catch(() => setError('No se pudo conectar al servicio de reportes o mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => {
        setForm(EMPTY_FORM)
        setEditando(null)
        setFormError('')
        setModal(true)
    }

    const openEdit = (reporte) => {
        setFormError('')
        setEditando(reporte)

        const rawDesc = reporte.descripcion || ''
        const esEncontrada = rawDesc.startsWith('[Encontrada]')
        const esAvistada = rawDesc.startsWith('[Avistada]')
        const esPerdida = rawDesc.startsWith('[Perdida]')

        let tipoDetectado = 'Perdida'
        let descLimpia = rawDesc

        if (esEncontrada) {
            tipoDetectado = 'Encontrada'
            descLimpia = rawDesc.replace(/^\[Encontrada\]\s*/, '')
        } else if (esAvistada) {
            tipoDetectado = 'Avistada'
            descLimpia = rawDesc.replace(/^\[Avistada\]\s*/, '')
        } else if (esPerdida) {
            tipoDetectado = 'Perdida'
            descLimpia = rawDesc.replace(/^\[Perdida\]\s*/, '')
        }

        setForm({
            descripcion: descLimpia,
            fechaHora: formatearFechaParaInput(reporte.fechaHora),
            mascotaId: reporte.mascotaId ? String(reporte.mascotaId) : '',
            crearNuevaMascota: false,
            nuevaMascota: { nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '' },
            comuna: reporte.ubicacion?.comuna || '',
            tipo: tipoDetectado,
        })
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
        setEditando(null)
        setFormError('')
    }

    const handleMascotaNuevaChange = (campo, valor) =>
        setForm(prev => ({ ...prev, nuevaMascota: { ...prev.nuevaMascota, [campo]: valor } }))

    const guardar = async () => {
        setFormError('')
        const f = form

        if (!f.descripcion.trim()) { setFormError('La descripción es obligatoria'); return }
        if (!f.comuna) { setFormError('Debes seleccionar una comuna'); return }
        if (!f.fechaHora) { setFormError('La fecha y hora del suceso son obligatorias'); return }

        if (!editando && !f.crearNuevaMascota && !f.mascotaId) {
            setFormError('Selecciona una mascota o marca la opción de registrar una nueva')
            return
        }
        if (!editando && f.crearNuevaMascota && (!f.nuevaMascota.nombre.trim() || !f.nuevaMascota.especie.trim())) {
            setFormError('Nombre y especie de la mascota son obligatorios')
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
                    colorCaracteristica: f.nuevaMascota.colorCaracteristica.trim() || null,
                    tamano: f.nuevaMascota.tamano.trim() || null
                }

                const { data: mascotaGuardada } = await axios.post(API_MASCOTAS, payloadMascotaNueva)
                mascotaIdFinal = mascotaGuardada.id
                mascotaCreadaId = mascotaGuardada.id
            }

            const payloadReporte = {
                descripcion: '[' + f.tipo + '] ' + f.descripcion.trim(),
                fechaHora: formatearFechaParaJava(f.fechaHora),
                mascotaId: mascotaIdFinal,
                ubicacion: editando ? editando.ubicacion : null
            }

            let reporteId = null

            if (editando) {
                await axios.put(`${API_REPORTES}/${editando.id}`, payloadReporte)
                reporteId = editando.id
            } else {
                const { data: reporteCreado } = await axios.post(API_REPORTES, payloadReporte)
                reporteId = reporteCreado.id
            }

            if (reporteId) {
                const comunaData = COMUNAS.find(c => c.nombre === f.comuna)
                const payloadUbicacion = {
                    id: editando?.ubicacion?.id || null,
                    //direccion: editando?.ubicacion?.direccion || 'No especificada',
                    //  ciudad: 'Santiago',
                    comuna: f.comuna,
                    //pais: 'Chile',
                    latitud: comunaData ? comunaData.latitud : null,
                    longitud: comunaData ? comunaData.longitud : null,
                }

                await axios.put(`${API_REPORTES}/${reporteId}/ubicacion`, payloadUbicacion)
            }

            closeModal()
            cargar()

        } catch (err) {
            if (mascotaCreadaId) {
                try {
                    await axios.delete(`${API_MASCOTAS}/${mascotaCreadaId}`)
                } catch (delErr) {
                    console.error('Falló la limpieza de la mascota huérfana:', delErr.message)
                }
            }

            const msgError = (err.response && err.response.data && err.response.data.message)
                ? err.response.data.message
                : 'Error crítico al procesar el flujo del reporte.'
            setFormError(msgError)
        } finally {
            setGuardando(false)
        }
    }

    const eliminar = (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.')) return
        axios.delete(`${API_REPORTES}/${id}`)
            .then(() => cargar())
            .catch(() => alert('No se pudo eliminar el reporte seleccionado.'))
    }

    const reportesFiltrados = reportes.filter(r => {
        if (filtroActual === 'Todas') return true
        if (filtroActual === 'Perdidas') return r.descripcion && r.descripcion.startsWith('[Perdida]')
        if (filtroActual === 'Avistadas') return r.descripcion && r.descripcion.startsWith('[Avistada]')
        if (filtroActual === 'Encontradas') return r.descripcion && r.descripcion.startsWith('[Encontrada]')
        return true
    })

    return (
        <div className="reportes-page">
            <div className="page-header">
                <div className="page-header__text">
                    <h1>Reportes</h1>
                    <p>{reportesFiltrados.length} reporte{reportesFiltrados.length !== 1 ? 's' : ''} en pantalla</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            <div className="reportes-filtros-bar">
                <button className={`filtro-btn ${filtroActual === 'Todas' ? 'activo-todas' : ''}`} onClick={() => setFiltroActual('Todas')}>Todas</button>
                <button className={`filtro-btn ${filtroActual === 'Perdidas' ? 'activo-perdidas' : ''}`} onClick={() => setFiltroActual('Perdidas')}>Perdidas</button>
                <button className={`filtro-btn ${filtroActual === 'Avistadas' ? 'activo-avistadas' : ''}`} onClick={() => setFiltroActual('Avistadas')}>Avistadas</button>
                <button className={`filtro-btn ${filtroActual === 'Encontradas' ? 'activo-encontradas' : ''}`} onClick={() => setFiltroActual('Encontradas')}>Encontradas</button>
            </div>

            {loading && <p className="reportes-loading">Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && reportesFiltrados.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <p>No hay reportes para este filtro.</p>
                </div>
            )}

            <div className="card-grid">
                {reportesFiltrados.map(r => (
                    <InfoCard
                        key={r.id}
                        title={r.descripcion ? r.descripcion.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '') : ''}
                        badge={obtenerTextoBadge(r.descripcion, r.mascotaNombre)}
                        badgeColor={obtenerColorBadge(r.descripcion)}
                        meta={buildMeta(r)}
                        onEdit={() => openEdit(r)}
                        onDelete={() => eliminar(r.id)}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    title={editando ? 'Editar reporte' : 'Nuevo reporte'}
                    onClose={closeModal}
                    onSave={guardar}
                    saveLabel={guardando ? 'Guardando...' : (editando ? 'Guardar cambios' : 'Publicar reporte')}
                >
                    <div className="reportes-form-group">
                        <label className="reportes-select-label">Estado del Reporte *</label>
                        <select
                            className="reportes-select"
                            value={form.tipo}
                            onChange={e => setForm({ ...form, tipo: e.target.value })}
                        >
                            <option value="Perdida">Mascota Perdida</option>
                            <option value="Avistada">Mascota Avistada</option>
                            <option value="Encontrada">Mascota Encontrada</option>
                        </select>
                    </div>

                    <Input
                        label="Descripción *"
                        placeholder="¿Qué pasó? Describe la situación..."
                        textarea
                        value={form.descripcion}
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    />

                    <Input
                        label="Fecha y hora *"
                        type="datetime-local"
                        value={form.fechaHora}
                        onChange={e => setForm({ ...form, fechaHora: e.target.value })}
                    />

                    {/* Al editar, ocultamos el flujo de creación o reasignación de mascotas para evitar inconsistencias en la BD */}
                    {!editando && (
                        <>
                            <hr className="reportes-form-divider" />
                            <div className="reportes-mascota-section">
                                <label className="checkbox-nueva-mascota-label">
                                    <input
                                        type="checkbox"
                                        checked={form.crearNuevaMascota}
                                        onChange={e => setForm(prev => ({
                                            ...prev,
                                            crearNuevaMascota: e.target.checked,
                                            mascotaId: ''
                                        }))}
                                    />
                                    <span>La mascota no está en la lista (registrar ahora)</span>
                                </label>

                                {!form.crearNuevaMascota ? (
                                    <div className="reportes-select-wrapper">
                                        <label className="reportes-select-label">Mascota *</label>
                                        <select
                                            className="reportes-select"
                                            value={form.mascotaId}
                                            onChange={e => setForm({ ...form, mascotaId: e.target.value })}
                                        >
                                            <option value="">Selecciona una mascota...</option>
                                            {mascotas.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.nombre} {m.especie ? '(' + m.especie + ')' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="nueva-mascota-subform">
                                        <p className="subform-title">Datos de la nueva mascota</p>
                                        <div className="subform-grid">
                                            <Input label="Nombre *" placeholder="Ej: Firulais" value={form.nuevaMascota.nombre} onChange={e => handleMascotaNuevaChange('nombre', e.target.value)} />
                                            <Input label="Especie *" placeholder="Ej: Perro" value={form.nuevaMascota.especie} onChange={e => handleMascotaNuevaChange('especie', e.target.value)} />
                                            <Input label="Raza" placeholder="Ej: Labrador" value={form.nuevaMascota.raza} onChange={e => handleMascotaNuevaChange('raza', e.target.value)} />
                                            <Input label="Color y características" placeholder="Ej: Café con blanco" value={form.nuevaMascota.colorCaracteristica} onChange={e => handleMascotaNuevaChange('colorCaracteristica', e.target.value)} />
                                            <Input label="Tamaño" placeholder="Ej: Mediano" value={form.nuevaMascota.tamano} onChange={e => handleMascotaNuevaChange('tamano', e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <hr className="reportes-form-divider" />

                    <div className="reportes-ubicacion-section">
                        <p className="subform-title">Ubicación del suceso *</p>
                        <label className="reportes-select-label">Comuna de Santiago *</label>
                        <select
                            className="reportes-select"
                            value={form.comuna}
                            onChange={e => setForm({ ...form, comuna: e.target.value })}
                        >
                            <option value="">-- Elige una comuna --</option>
                            {COMUNAS.map(c => (
                                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {formError && <div className="reportes-form-error">⚠️ {formError}</div>}
                </Modal>
            )}
        </div>
    )
}

export default Reportes;