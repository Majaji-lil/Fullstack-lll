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

const EMPTY_FORM = { descripcion: '', fechaHora: '', mascotaId: '', ubicacionId: '' }

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
        Promise.all([axios.get(API_REPORTES), axios.get(API_MASCOTAS)])
            .then(([rR, rM]) => { setReportes(rR.data); setMascotas(rM.data); setError(null) })
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

        const fechaFormateada = form.fechaHora?.length === 16
            ? `${form.fechaHora}:00`
            : form.fechaHora || null

        const payload = {
            descripcion: form.descripcion,
            fechaHora: fechaFormateada,
            mascotaId: Number(form.mascotaId),
            ubicacionId: form.ubicacionId ? Number(form.ubicacionId) : null,
            usuarioId: usuario?.id || null,
        }

        axios.post(API_REPORTES, payload)
            .then(() => { closeModal(); cargar() })
            .catch(err => setFormError(
                err.response?.status === 400
                    ? 'No se encontró la mascota con ese ID.'
                    : 'Error al crear el reporte'
            ))
    }

    return (
        <div className="reportes-page">

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Reportes</h1>
                    <p>{reportes.length} reporte{reportes.length !== 1 ? 's' : ''} registrado{reportes.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            {loading && <p className="reportes-loading">Cargando...</p>}
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
                <Modal title="Nuevo reporte" onClose={closeModal} onSave={guardar} saveLabel="Publicar reporte">

                    <Input label="Descripción *" placeholder="¿Qué pasó? Describe la situación..." textarea {...field('descripcion')} />

                    {mascotas.length > 0 ? (
                        <div>
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
                        <Input label="ID de mascota *" placeholder="ID numérico" type="number" {...field('mascotaId')} />
                    )}

                    <Input label="Fecha y hora" type="datetime-local" {...field('fechaHora')} />
                    <Input label="ID de ubicación (opcional)" type="number" placeholder="Si ya existe una ubicación" {...field('ubicacionId')} />

                    {formError && <div className="reportes-form-error">⚠️ {formError}</div>}

                    <p className="reportes-form-note">
                        Para asignar una ubicación nueva usa <code>PUT /api/reportes/{'{id}'}/ubicacion</code> después de crear el reporte.
                    </p>
                </Modal>
            )}
        </div>
    )
}

export default Reportes
