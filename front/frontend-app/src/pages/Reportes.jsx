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

const EMPTY_FORM = {
    descripcion: '',
    fechaHora: '',
    mascotaId: '',
    ubicacionId: '',
}

const formatFecha = (fechaHora) => {
    if (!fechaHora) return null
    try {
        return new Date(fechaHora).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    } catch { return fechaHora }
}

const buildMeta = (r) => {
    const partes = []
    if (r.mascotaNombre) partes.push(`🐾 ${r.mascotaNombre}`)
    if (r.fechaHora) partes.push(`📅 ${formatFecha(r.fechaHora)}`)
    if (r.ubicacion) {
        const u = r.ubicacion
        const dir = [u.direccion, u.ciudad, u.departamento, u.pais].filter(Boolean).join(', ')
        if (dir) partes.push(`📍 ${dir}`)
    }
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
    const { usuario } = useAuth()

    const cargar = () => {
        setLoading(true)
        Promise.all([
            axios.get(API_REPORTES),
            axios.get(API_MASCOTAS),
        ])
            .then(([rReportes, rMascotas]) => {
                setReportes(rReportes.data)
                setMascotas(rMascotas.data)
                setError(null)
            })
            .catch(() => setError('No se pudo conectar al servicio de reportes o mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm({ ...form, [key]: e.target.value }),
    })

    const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal(true) }
    const closeModal = () => { setModal(false); setFormError('') }

    const guardar = () => {
        if (!form.descripcion) { setFormError('La descripción es obligatoria'); return }
        if (!form.mascotaId) { setFormError('Debes seleccionar una mascota'); return }

        // Validación y formateo estricto para LocalDateTime de Java (YYYY-MM-DDTHH:mm:ss)
        let fechaFormateada = null;
        if (form.fechaHora) {
            // Asegura que tenga segundos ":00" si el input nativo no los pone
            fechaFormateada = form.fechaHora.length === 16 ? `${form.fechaHora}:00` : form.fechaHora;
        }

        const payload = {
            descripcion: form.descripcion,
            fechaHora: fechaFormateada, // Enviamos el formato ISO correcto o null
            mascotaId: Number(form.mascotaId),
            ubicacionId: form.ubicacionId ? Number(form.ubicacionId) : null,
            usuarioId: usuario?.id || null,
        }

        axios.post(API_REPORTES, payload)
            .then(() => { closeModal(); cargar() })
            .catch(err => {
                const msg = err.response?.status === 400
                    ? 'No se encontró la mascota con ese ID o el formato de datos es incorrecto.'
                    : 'Error al crear el reporte'
                setFormError(msg)
            })
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Reportes</h1>
                    <p>{reportes.length} reporte{reportes.length !== 1 ? 's' : ''} registrado{reportes.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && reportes.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <p>No hay reportes registrados aún.</p>
                </div>
            )}

            <div className="card-grid">
                {reportes.map(r => (
                    <InfoCard
                        key={r.id}
                        title={r.descripcion}
                        badge={r.mascotaNombre}
                        badgeColor="green"
                        meta={buildMeta(r)}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    title="Nuevo reporte"
                    onClose={closeModal}
                    onSave={guardar}
                    saveLabel="Publicar reporte"
                >
                    <Input
                        label="Descripción *"
                        placeholder="¿Qué pasó? Describe la situación..."
                        textarea
                        {...field('descripcion')}
                    />

                    {mascotas.length > 0 ? (
                        <div>
                            <label style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>
                                Mascota *
                            </label>
                            <select
                                value={form.mascotaId}
                                onChange={e => setForm({ ...form, mascotaId: e.target.value })}
                                style={{
                                    width: '100%', padding: '9px 12px', borderRadius: 7,
                                    border: '1px solid #d1d5db', fontFamily: 'system-ui',
                                    fontSize: 14, color: '#111827', background: '#fff',
                                    boxSizing: 'border-box',
                                }}
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
                        <Input
                            label="ID de mascota *"
                            placeholder="Ingresa el ID numérico de la mascota"
                            type="number"
                            {...field('mascotaId')}
                        />
                    )}

                    <Input
                        label="Fecha y hora"
                        type="datetime-local"
                        {...field('fechaHora')}
                    />

                    <Input
                        label="ID de ubicación (opcional)"
                        placeholder="Si ya existe una ubicación registrada"
                        type="number"
                        {...field('ubicacionId')}
                    />

                    {formError && (
                        <div style={{
                            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                            borderRadius: 7, padding: '8px 12px', fontSize: 13, fontFamily: 'system-ui',
                        }}>
                            ⚠️ {formError}
                        </div>
                    )}

                    <p style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'system-ui', margin: 0, lineHeight: 1.5 }}>
                        Para asignar una ubicación nueva usa <code>PUT /api/reportes/{'{id}'}/ubicacion</code> después de crear el reporte.
                    </p>
                </Modal>
            )}
        </div>
    )
}

export default Reportes