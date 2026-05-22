// src/pages/Reportes.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_REPORTES } from '../api/urls'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'

const EMPTY = { titulo: '', descripcion: '', ubicacion: '', tipo: 'PERDIDA', fecha: '' }
const TIPOS = { PERDIDA: { label: 'Perdida', color: 'red' }, ENCONTRADA: { label: 'Encontrada', color: 'green' } }

function Reportes() {
    const [reportes, setReportes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [filtro, setFiltro] = useState('TODOS')

    const cargar = () => {
        setLoading(true)
        axios.get(API_REPORTES)
            .then(r => { setReportes(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de reportes'))
            .finally(() => setLoading(false))
    }
    useEffect(() => { cargar() }, [])

    const field = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) })

    const openCreate = () => { setForm(EMPTY); setEditando(null); setModal(true) }
    const openEdit = (r) => { setForm({ titulo: r.titulo || '', descripcion: r.descripcion || '', ubicacion: r.ubicacion || '', tipo: r.tipo || 'PERDIDA', fecha: r.fecha || '' }); setEditando(r); setModal(true) }
    const closeModal = () => setModal(false)

    const guardar = () => {
        if (!form.titulo) { alert('El título es obligatorio'); return }
        const req = editando ? axios.put(`${API_REPORTES}/${editando.id}`, form) : axios.post(API_REPORTES, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }
    const eliminar = (id) => {
        if (!confirm('¿Eliminar este reporte?')) return
        axios.delete(`${API_REPORTES}/${id}`).then(cargar)
    }

    const filtrados = filtro === 'TODOS' ? reportes : reportes.filter(r => r.tipo === filtro)

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div className="page-header">
                <div className="page-header__text">
                    <h1>Reportes</h1>
                    <p>{reportes.length} reporte{reportes.length !== 1 ? 's' : ''} publicado{reportes.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo reporte</Button>
            </div>

            <div className="filter-bar">
                {['TODOS', 'PERDIDA', 'ENCONTRADA'].map(t => (
                    <button key={t} className={`filter-chip ${filtro === t ? 'filter-chip--active' : ''}`} onClick={() => setFiltro(t)}>
                        {t === 'TODOS' ? 'Todos' : TIPOS[t].label}
                    </button>
                ))}
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && filtrados.length === 0 && (
                <div className="empty-state"><div className="empty-state__icon">📋</div><p>No hay reportes en esta categoría.</p></div>
            )}

            <div className="card-grid">
                {filtrados.map(r => (
                    <InfoCard
                        key={r.id}
                        title={r.titulo || 'Sin título'}
                        badge={TIPOS[r.tipo]?.label || r.tipo}
                        badgeColor={TIPOS[r.tipo]?.color || 'gray'}
                        description={r.descripcion}
                        meta={[r.ubicacion && `📍 ${r.ubicacion}`, r.fecha && `📅 ${r.fecha}`].filter(Boolean).join('  ')}
                        onEdit={() => openEdit(r)}
                        onDelete={() => eliminar(r.id)}
                    />
                ))}
            </div>

            {modal && (
                <Modal title={editando ? 'Editar reporte' : 'Nuevo reporte'} onClose={closeModal} onSave={guardar} saveLabel="Publicar">
                    <div style={{ display: 'flex', gap: 8 }}>
                        {Object.entries(TIPOS).map(([key, val]) => (
                            <button key={key} onClick={() => setForm({ ...form, tipo: key })}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
                                    border: form.tipo === key ? `2px solid` : '1px solid #e5e7eb',
                                    borderColor: form.tipo === key ? (key === 'PERDIDA' ? '#dc2626' : '#16a34a') : '#e5e7eb',
                                    background: form.tipo === key ? (key === 'PERDIDA' ? '#fef2f2' : '#f0fdf4') : '#fff',
                                    color: form.tipo === key ? (key === 'PERDIDA' ? '#dc2626' : '#16a34a') : '#6b7280'
                                }}>
                                {val.label}
                            </button>
                        ))}
                    </div>
                    <Input label="Título" placeholder="Ej: Perdí a mi perro en Ñuñoa" {...field('titulo')} />
                    <Input label="Ubicación" placeholder="Ej: Plaza Ñuñoa, Santiago"     {...field('ubicacion')} />
                    <Input label="Fecha" type="date"                                  {...field('fecha')} />
                    <Input label="Descripción" placeholder="Describe la situación..." textarea {...field('descripcion')} />
                </Modal>
            )}
        </div>
    )
}

export default Reportes
