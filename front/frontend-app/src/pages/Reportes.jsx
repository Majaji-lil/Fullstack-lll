// src/pages/Reportes.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_REPORTES } from '../api/urls'

const EMPTY_FORM = { titulo: '', descripcion: '', ubicacion: '', tipo: 'PERDIDA', fecha: '' }

const TIPOS = {
    PERDIDA: { label: 'Perdida', color: '#dc2626', bg: '#fef2f2' },
    ENCONTRADA: { label: 'Encontrada', color: '#16a34a', bg: '#f0fdf4' },
}

const btnStyle = (color, filled = false) => ({
    fontSize: 13, padding: '6px 14px', borderRadius: 6,
    border: `1px solid ${color}33`, cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 500,
    background: filled ? color : 'transparent', color: filled ? '#fff' : color,
})

function TipoBadge({ tipo }) {
    const t = TIPOS[tipo] || TIPOS.PERDIDA
    return (
        <span style={{
            background: t.bg, color: t.color, padding: '3px 10px',
            borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: 'system-ui',
        }}>{t.label}</span>
    )
}

function Modal({ title, form, setForm, onSave, onClose }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
            <div style={{
                background: '#fff', borderRadius: 12, width: '100%', maxWidth: 460,
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{title}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Tipo */}
                    <div>
                        <label style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Tipo de reporte</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {Object.entries(TIPOS).map(([key, val]) => (
                                <button
                                    key={key}
                                    onClick={() => setForm({ ...form, tipo: key })}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer',
                                        fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
                                        border: form.tipo === key ? `2px solid ${val.color}` : '1px solid #e5e7eb',
                                        background: form.tipo === key ? val.bg : '#fff',
                                        color: form.tipo === key ? val.color : '#6b7280',
                                    }}
                                >{val.label}</button>
                            ))}
                        </div>
                    </div>
                    {/* Campos */}
                    {[
                        { key: 'titulo', label: 'Título', placeholder: 'Ej: Perdí a mi perro en Ñuñoa', type: 'text' },
                        { key: 'ubicacion', label: 'Ubicación', placeholder: 'Ej: Plaza Ñuñoa, Santiago', type: 'text' },
                        { key: 'fecha', label: 'Fecha del avistamiento', placeholder: '', type: 'date' },
                    ].map(f => (
                        <div key={f.key}>
                            <label style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{f.label}</label>
                            <input
                                type={f.type}
                                value={form[f.key] || ''}
                                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                placeholder={f.placeholder}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontFamily: 'system-ui', fontSize: 14, boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
                    {/* Descripcion */}
                    <div>
                        <label style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Descripción</label>
                        <textarea
                            value={form.descripcion || ''}
                            onChange={e => setForm({ ...form, descripcion: e.target.value })}
                            placeholder="Describe la situación, señas de la mascota, cómo contactar..."
                            rows={4}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontFamily: 'system-ui', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={btnStyle('#6b7280')}>Cancelar</button>
                    <button onClick={onSave} style={btnStyle('#16a34a', true)}>Publicar reporte</button>
                </div>
            </div>
        </div>
    )
}

function ReporteCard({ reporte, onEdit, onDelete }) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0, flex: 1 }}>
                    {reporte.titulo || 'Sin título'}
                </p>
                <TipoBadge tipo={reporte.tipo} />
            </div>
            {reporte.descripcion && (
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'system-ui', margin: 0 }}>
                    {reporte.descripcion}
                </p>
            )}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {reporte.ubicacion && <span style={{ fontSize: 12, color: '#4b5563', fontFamily: 'system-ui' }}>📍 {reporte.ubicacion}</span>}
                {reporte.fecha && <span style={{ fontSize: 12, color: '#4b5563', fontFamily: 'system-ui' }}>📅 {reporte.fecha}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => onEdit(reporte)} style={btnStyle('#2563eb')}>Editar</button>
                <button onClick={() => onDelete(reporte.id)} style={btnStyle('#dc2626')}>Eliminar</button>
            </div>
        </div>
    )
}

function Reportes() {
    const [reportes, setReportes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [filtro, setFiltro] = useState('TODOS')

    const cargar = () => {
        setLoading(true)
        axios.get(API_REPORTES)
            .then(r => { setReportes(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de reportes'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => { setForm(EMPTY_FORM); setEditando(null); setShowModal(true) }
    const openEdit = (r) => { setForm({ titulo: r.titulo || '', descripcion: r.descripcion || '', ubicacion: r.ubicacion || '', tipo: r.tipo || 'PERDIDA', fecha: r.fecha || '' }); setEditando(r); setShowModal(true) }
    const closeModal = () => setShowModal(false)

    const guardar = () => {
        if (!form.titulo) { alert('El título es obligatorio'); return }
        const req = editando
            ? axios.put(`${API_REPORTES}/${editando.id}`, form)
            : axios.post(API_REPORTES, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar este reporte?')) return
        axios.delete(`${API_REPORTES}/${id}`).then(cargar).catch(() => alert('Error al eliminar'))
    }

    const filtrados = filtro === 'TODOS' ? reportes : reportes.filter(r => r.tipo === filtro)

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>Reportes</h1>
                    <p style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui', marginTop: 4 }}>
                        {reportes.length} reporte{reportes.length !== 1 ? 's' : ''} publicado{reportes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={openCreate} style={{
                    background: '#16a34a', color: '#fff', border: 'none',
                    padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
                    fontWeight: 600, fontSize: 14, fontFamily: 'system-ui',
                }}>
                    + Nuevo reporte
                </button>
            </div>

            {/* Filtro de tipo */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
                {['TODOS', 'PERDIDA', 'ENCONTRADA'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFiltro(t)}
                        style={{
                            padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                            fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
                            border: '1px solid',
                            borderColor: filtro === t ? '#16a34a' : '#e5e7eb',
                            background: filtro === t ? '#f0fdf4' : '#fff',
                            color: filtro === t ? '#16a34a' : '#6b7280',
                        }}
                    >
                        {t === 'TODOS' ? 'Todos' : TIPOS[t]?.label}
                    </button>
                ))}
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>Cargando reportes...</p>}
            {error && <p style={{ color: '#dc2626', fontFamily: 'system-ui', textAlign: 'center', padding: '2rem', background: '#fef2f2', borderRadius: 8 }}>⚠️ {error}</p>}

            {!loading && !error && filtrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', fontFamily: 'system-ui' }}>
                    <div style={{ fontSize: 48, marginBottom: '1rem' }}>📋</div>
                    <p>No hay reportes en esta categoría.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {filtrados.map(r => (
                    <ReporteCard key={r.id} reporte={r} onEdit={openEdit} onDelete={eliminar} />
                ))}
            </div>

            {showModal && (
                <Modal
                    title={editando ? 'Editar reporte' : 'Nuevo reporte'}
                    form={form} setForm={setForm}
                    onSave={guardar} onClose={closeModal}
                />
            )}
        </div>
    )
}

export default Reportes