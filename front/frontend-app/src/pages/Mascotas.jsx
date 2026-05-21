// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'

const EMPTY_FORM = { nombre: '', especie: '', raza: '', color: '', descripcion: '', ubicacion: '' }

function Badge({ text, color = '#16a34a', bg = '#f0fdf4' }) {
    return (
        <span style={{
            background: bg, color, padding: '2px 10px',
            borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: 'system-ui',
        }}>{text}</span>
    )
}

function MascotaCard({ mascota, onEdit, onDelete }) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: 8,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>
                        {mascota.nombre || 'Sin nombre'}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {mascota.especie && <Badge text={mascota.especie} />}
                        {mascota.raza && <Badge text={mascota.raza} color="#1d4ed8" bg="#eff6ff" />}
                    </div>
                </div>
                <Badge text="Perdida" color="#dc2626" bg="#fef2f2" />
            </div>

            {mascota.descripcion && (
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, fontFamily: 'system-ui' }}>
                    {mascota.descripcion}
                </p>
            )}

            {mascota.ubicacion && (
                <p style={{ fontSize: 13, color: '#4b5563', fontFamily: 'system-ui' }}>
                    📍 {mascota.ubicacion}
                </p>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => onEdit(mascota)} style={btnStyle('#16a34a')}>Editar</button>
                <button onClick={() => onDelete(mascota.id)} style={btnStyle('#dc2626')}>Eliminar</button>
            </div>
        </div>
    )
}

const btnStyle = (color) => ({
    fontSize: 13, padding: '5px 14px', borderRadius: 6,
    border: `1px solid ${color}22`, background: 'transparent',
    color, cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 500,
})

function Modal({ title, form, setForm, onSave, onClose }) {
    const fields = [
        { key: 'nombre', label: 'Nombre', placeholder: 'Ej: Firulais' },
        { key: 'especie', label: 'Especie', placeholder: 'Ej: Perro, Gato' },
        { key: 'raza', label: 'Raza', placeholder: 'Ej: Labrador' },
        { key: 'color', label: 'Color', placeholder: 'Ej: Café con blanco' },
        { key: 'ubicacion', label: 'Última ubicación', placeholder: 'Ej: Parque O\'Higgins' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Señas particulares...', textarea: true },
    ]

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
            <div style={{
                background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480,
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{title}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {fields.map(f => (
                        <div key={f.key}>
                            <label style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{f.label}</label>
                            {f.textarea
                                ? <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder} rows={3}
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontFamily: 'system-ui', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
                                : <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontFamily: 'system-ui', fontSize: 14, boxSizing: 'border-box' }} />
                            }
                        </div>
                    ))}
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={btnStyle('#6b7280')}>Cancelar</button>
                    <button onClick={onSave} style={{ ...btnStyle('#16a34a'), background: '#16a34a', color: '#fff' }}>Guardar</button>
                </div>
            </div>
        </div>
    )
}

function Mascotas() {
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)

    const cargar = () => {
        setLoading(true)
        axios.get(API_MASCOTAS)
            .then(r => { setMascotas(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => { setForm(EMPTY_FORM); setEditando(null); setShowModal(true) }
    const openEdit = (m) => { setForm({ nombre: m.nombre || '', especie: m.especie || '', raza: m.raza || '', color: m.color || '', descripcion: m.descripcion || '', ubicacion: m.ubicacion || '' }); setEditando(m); setShowModal(true) }
    const closeModal = () => setShowModal(false)

    const guardar = () => {
        const req = editando
            ? axios.put(`${API_MASCOTAS}/${editando.id}`, form)
            : axios.post(API_MASCOTAS, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`).then(cargar).catch(() => alert('Error al eliminar'))
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>Mascotas perdidas</h1>
                    <p style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui', marginTop: 4 }}>
                        {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada{mascotas.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={openCreate} style={{
                    background: '#16a34a', color: '#fff', border: 'none',
                    padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
                    fontWeight: 600, fontSize: 14, fontFamily: 'system-ui',
                }}>
                    + Registrar mascota
                </button>
            </div>

            {loading && <p style={{ color: '#9ca3af', fontFamily: 'system-ui', textAlign: 'center', padding: '3rem' }}>Cargando mascotas...</p>}
            {error && <p style={{ color: '#dc2626', fontFamily: 'system-ui', textAlign: 'center', padding: '3rem', background: '#fef2f2', borderRadius: 8 }}>⚠️ {error}</p>}

            {!loading && !error && mascotas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', fontFamily: 'system-ui' }}>
                    <div style={{ fontSize: 48, marginBottom: '1rem' }}>🐾</div>
                    <p>No hay mascotas registradas aún.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {mascotas.map(m => (
                    <MascotaCard key={m.id} mascota={m} onEdit={openEdit} onDelete={eliminar} />
                ))}
            </div>

            {showModal && (
                <Modal
                    title={editando ? 'Editar mascota' : 'Registrar mascota'}
                    form={form} setForm={setForm}
                    onSave={guardar} onClose={closeModal}
                />
            )}
        </div>
    )
}

export default Mascotas