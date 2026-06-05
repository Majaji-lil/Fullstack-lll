// src/pages/Reportes.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_REPORTES, API_MASCOTAS } from '../api/urls'
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
    { font: 'La Cisterna', nombre: 'La Cisterna', latitud: -33.5267, longitud: -70.6636 },
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
    nuevaMascota: { nombre: '', especie: '', raza: '', color_caracteristica: '', tamano: '' },
    comuna: '',
    tipo: 'Perdida'
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
    if (r.mascotaNombre) partes.push(`🐾 ${r.mascotaNombre}`)
    if (r.fechaHora) partes.push(`📅 ${formatFecha(r.fechaHora)}`)
    if (r.ubicacion?.departamento) partes.push(`📍 ${r.ubicacion.departamento}`)
    return partes.join('  ·  ')
}

function Reportes() {
    const [reportes, setReportes] = useState([])
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [formError, setFormError] = useState('')
    const [guardando, setGuardando] = useState(false)

    const [filtroActual, setFiltroActual] = useState('Todas')

    const cargar = () => {
        setLoading(true)
        Promise.all([axios.get(API_REPORTES), axios.get(API_MASCOTAS)])
            .then(([rR, rM]) => { setReportes(rR.data); setMascotas(rM.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de reportes o mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal(true) }
    const closeModal = () => { setModal(false); setFormError('') }

    const handleMascotaNuevaChange = (campo, valor) =>
        setForm(prev => ({ ...prev, nuevaMascota: { ...prev.nuevaMascota, [campo]: valor } }))

    const guardar = async () => {
    setFormError('')

    // 1. Validaciones estrictas en el Frontend para evitar Nulos en la Base de Datos
    if (!form.descripcion.trim()) { setFormError('La descripción es obligatoria'); return }
    if (!form.comuna) { setFormError('Debes seleccionar una comuna'); return }
    if (!form.fechaHora) { setFormError('La fecha y hora del suceso son obligatorias'); return }
    
    if (!form.crearNuevaMascota && !form.mascotaId) {
        setFormError('Selecciona una mascota o marca la opción de registrar una nueva'); return
    }
    if (form.crearNuevaMascota &&
        (!form.nuevaMascota.nombre.trim() || !form.nuevaMascota.especie.trim())) {
        setFormError('Nombre y especie de la mascota son obligatorios'); return
    }

    setGuardando(true)
    let mascotaCreadaId = null 

    try {
        // 2. Obtener los identificadores de la mascota
        let mascotaIdFinal = Number(form.mascotaId)
        let nombreMascotaFinal = ''

        if (form.crearNuevaMascota) {
            const { data: mascotaGuardada } = await axios.post(API_MASCOTAS, form.nuevaMascota)
            mascotaIdFinal = mascotaGuardada.id
            mascotaCreadaId = mascotaGuardada.id 
            nombreMascotaFinal = mascotaGuardada.nombre
        } else {
            const encontrada = mascotas.find(m => m.id === mascotaIdFinal)
            nombreMascotaFinal = encontrada ? encontrada.nombre : 'Mascota'
        }

        // 3. FORMATEO GARANTIZADO DE LA FECHA PARA @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        let fechaFormateada = form.fechaHora;
        if (fechaFormateada.includes('T') && fechaFormateada.split(':').length === 2) {
            fechaFormateada = `${fechaFormateada}:00`;
        } else if (fechaFormateada.includes('.')) {
            fechaFormateada = fechaFormateada.split('.')[0];
        }

        // 4. CONSTRUCCIÓN DEL PAYLOAD ADAPTADO A TU ENTIDAD JAVA
        const payloadReporte = {
            descripcion: `[${form.tipo}] ${form.descripcion.trim()}`,
            fechaHora: fechaFormateada,
            mascotaId: mascotaIdFinal,
            mascotaNombre: nombreMascotaFinal, // Requerido por tu @Column(nullable = false)
            ubicacion: null // 👈 CORRECCIÓN CRÍTICA: Cambiado de ubicacionId: null a ubicacion: null
        }

        console.log("Enviando JSON adaptado a la firma del Backend:", payloadReporte)

        const { data: reporteCreado } = await axios.post(API_REPORTES, payloadReporte)

        // 5. Inyección de la ubicación mediante PUT una vez creado el reporte con éxito
        if (reporteCreado && reporteCreado.id) {
            const comunaData = COMUNAS.find(c => c.nombre === form.comuna)
            
            const payloadUbicacion = {
                direccion: 'No especificada',
                ciudad: 'Santiago',
                departamento: form.comuna,
                pais: 'Chile',
                latitud: comunaData?.latitud ?? null,
                longitud: comunaData?.longitud ?? null,
            }

            await axios.put(`${API_REPORTES}/${reporteCreado.id}/ubicacion`, payloadUbicacion)
        }

        closeModal()
        cargar()

    } catch (err) {
        console.error('Error crítico al procesar el flujo del reporte:', err.response?.data || err.message)
        
        // Reversión automatizada para no guardar mascotas sin reporte
        if (mascotaCreadaId) {
            try { 
                await axios.delete(`${API_MASCOTAS}/${mascotaCreadaId}`) 
                console.log('Se limpió la mascota creada automáticamente para evitar registros huérfanos.')
            } catch (delErr) {
                console.error('No se pudo limpiar la mascota huérfana:', delErr)
            }
        }
        
        const msgError = err.response?.data?.message || 'Error interno del servidor (500). Verifica los tipos de datos en la consola de Java.'
        setFormError(msgError)
    } finally {
        setGuardando(false)
    }




}
    // Lógica del filtro de Reportes ampliada a 4 estados
    const reportesFiltrados = reportes.filter(r => {
        if (filtroActual === 'Todas') return true
        if (filtroActual === 'Perdidas') return r.descripcion?.startsWith('[Perdida]')
        if (filtroActual === 'Avistadas') return r.descripcion?.startsWith('[Avistada]')
        if (filtroActual === 'Encontradas') return r.descripcion?.startsWith('[Encontrada]')
        return true
    })

    const obtenerColorBadge = (desc) => {
        if (desc?.includes('[Perdida]')) return 'red'
        if (desc?.includes('[Avistada]')) return 'orange'
        return 'green' // Encontrada
    }

    const obtenerTextoBadge = (desc, defecto) => {
        if (desc?.startsWith('[Perdida]')) return 'Perdida ⚠️'
        if (desc?.startsWith('[Avistada]')) return 'Avistada 👀'
        if (desc?.startsWith('[Encontrada]')) return 'Encontrada ✅'
        return defecto
    }

    return (
        <div className="reportes-page">

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Reportes</h1>
                    <p>{reportesFiltrados.length} reporte{reportesFiltrados.length !== 1 ? 's' : ''} en pantalla</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            {/* BARRA DE FILTROS ACTUALIZADA (4 OPCIONES) */}
            <div className="reportes-filtros-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                        title={r.descripcion?.replace(/^\[(Perdida|Avistada|Encontrada)\]\s*/, '')}
                        badge={obtenerTextoBadge(r.descripcion, r.mascotaNombre)}
                        badgeColor={obtenerColorBadge(r.descripcion)}
                        meta={buildMeta(r)}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    title="Nuevo reporte"
                    onClose={closeModal}
                    onSave={guardar}
                    saveLabel={guardando ? 'Publicando...' : 'Publicar reporte'}
                >
                    {/* SELECTOR DE ESTADO CON TRES OPCIONES REALES */}
                    <div style={{ marginBottom: '15px' }}>
                        <label className="reportes-select-label">Estado del Reporte *</label>
                        <select
                            className="reportes-select"
                            value={form.tipo}
                            onChange={e => setForm({ ...form, tipo: e.target.value })}
                        >
                            <option value="Perdida">Mascota Perdida ⚠️</option>
                            <option value="Avistada">Mascota Avistada (Pregunta/Datos) 👀</option>
                            <option value="Encontrada">Mascota Encontrada / Resguardada ✅</option>
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
                        label="Fecha y hora"
                        type="datetime-local"
                        value={form.fechaHora}
                        onChange={e => setForm({ ...form, fechaHora: e.target.value })}
                    />

                    <hr className="reportes-form-divider" />

                    {/* Sección Mascota */}
                    <div className="reportes-mascota-section">
                        <label className="checkbox-nueva-mascota-label">
                            <input
                                type="checkbox"
                                checked={form.crearNuevaMascota}
                                onChange={e => setForm({ ...form, crearNuevaMascota: e.target.checked, mascotaId: '' })}
                            />
                            <span>✨ La mascota no está en la lista (registrar ahora)</span>
                        </label>

                        {!form.crearNuevaMascota ? (
                            <div style={{ marginTop: 10 }}>
                                <label className="reportes-select-label">Mascota *</label>
                                <select
                                    className="reportes-select"
                                    value={form.mascotaId}
                                    onChange={e => setForm({ ...form, mascotaId: e.target.value })}
                                >
                                    <option value="">Selecciona una mascota...</option>
                                    {mascotas.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre} {m.especie ? `(${m.especie})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="nueva-mascota-subform">
                                <p className="subform-title">📝 Datos de la nueva mascota</p>
                                <div className="subform-grid">
                                    <Input label="Nombre *" placeholder="Ej: Firulais" value={form.nuevaMascota.nombre} onChange={e => handleMascotaNuevaChange('nombre', e.target.value)} />
                                    <Input label="Especie *" placeholder="Ej: Perro" value={form.nuevaMascota.especie} onChange={e => handleMascotaNuevaChange('especie', e.target.value)} />
                                    <Input label="Raza" placeholder="Ej: Quiltro" value={form.nuevaMascota.raza} onChange={e => handleMascotaNuevaChange('raza', e.target.value)} />
                                    <Input label="Color / características" placeholder="Ej: Negro completo" value={form.nuevaMascota.color_caracteristica} onChange={e => handleMascotaNuevaChange('color_caracteristica', e.target.value)} />
                                    <Input label="Tamaño" placeholder="Ej: Grande" value={form.nuevaMascota.tamano} onChange={e => handleMascotaNuevaChange('tamano', e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="reportes-form-divider" />

                    {/* Ubicación */}
                    <div className="reportes-ubicacion-section">
                        <p className="subform-title">📍 Ubicación del suceso *</p>
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

export default Reportes