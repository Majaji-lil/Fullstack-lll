// src/pages/Usuarios.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_USUARIOS } from '../api/urls'

const EMPTY_FORM = { nombres: '', correo: '', password: '' }

const btnStyle = (color, filled = false) => ({
    fontSize: 13, padding: '6px 14px', borderRadius: 6,
    border: `1px solid ${color}33`, cursor: 'pointer', fontFamily: 'system-ui', fontWeight: 500,
    background: filled ? color : 'transparent', color: filled ? '#fff' : color,
})

function initials(name) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function Modal({ title, form, setForm, onSave, onClose, isEdit }) {
    const fields = [
        { key: 'nombres', label: 'Nombre completo', placeholder: 'Ej: Juan Pérez', type: 'text' },
        { key: 'correo', label: 'Correo', placeholder: 'correo@ejemplo.com', type: 'email' },
        ...(!isEdit ? [{ key: 'password', label: 'Contraseña', placeholder: '••••••••', type: 'password' }] : []),
    ]

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
            <div style={{
                background: '#fff', borderRadius: 12, width: '100%', maxWidth: 420,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{title}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {fields.map(f => (
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
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={btnStyle('#6b7280')}>Cancelar</button>
                    <button onClick={onSave} style={btnStyle('#16a34a', true)}>Guardar</button>
                </div>
            </div>
        </div>
    )
}

function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [busqueda, setBusqueda] = useState('')

    const cargar = () => {
        setLoading(true)
        axios.get(API_USUARIOS)
            .then(r => { setUsuarios(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de usuarios'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    const openCreate = () => { setForm(EMPTY_FORM); setEditando(null); setShowModal(true) }
    const openEdit = (u) => { setForm({ nombres: u.nombres || '', correo: u.correo || '' }); setEditando(u); setShowModal(true) }
    const closeModal = () => setShowModal(false)

    const guardar = () => {
        if (!form.nombres || !form.correo) { alert('Nombre y correo son obligatorios'); return }
        const req = editando
            ? axios.put(`${API_USUARIOS}/${editando.id}`, form)
            : axios.post(API_USUARIOS, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar este usuario?')) return
        axios.delete(`${API_USUARIOS}/${id}`).then(cargar).catch(() => alert('Error al eliminar'))
    }

    const filtrados = usuarios.filter(u =>
        u.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo?.toLowerCase().includes(busqueda.toLowerCase())
    )

    const avatarColors = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0891b2']

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>Usuarios</h1>
                    <p style={{ color: '#6b7280', fontSize: 14, fontFamily: 'system-ui', marginTop: 4 }}>
                        {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={openCreate} style={{
                    background: '#16a34a', color: '#fff', border: 'none',
                    padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
                    fontWeight: 600, fontSize: 14, fontFamily: 'system-ui',
                }}>
                    + Nuevo usuario
                </button>
            </div>

            {/* Buscador */}
            <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: '1px solid #d1d5db', fontFamily: 'system-ui', fontSize: 14,
                    marginBottom: '1.25rem', boxSizing: 'border-box',
                }}
            />

            {/* Estado */}
            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>Cargando usuarios...</p>}
            {error && <p style={{ color: '#dc2626', fontFamily: 'system-ui', textAlign: 'center', padding: '2rem', background: '#fef2f2', borderRadius: 8 }}>⚠️ {error}</p>}

            {/* Lista */}
            {!loading && !error && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                    {filtrados.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>
                            {busqueda ? 'No hay resultados para tu búsqueda.' : 'No hay usuarios registrados aún.'}
                        </div>
                    ) : filtrados.map((u, i) => (
                        <div key={u.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 20px',
                            borderBottom: i < filtrados.length - 1 ? '1px solid #f3f4f6' : 'none',
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: avatarColors[u.id % avatarColors.length] + '20',
                                color: avatarColors[u.id % avatarColors.length],
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 13, fontFamily: 'system-ui', flexShrink: 0,
                            }}>
                                {initials(u.nombres)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>{u.nombres}</p>
                                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, fontFamily: 'system-ui' }}>{u.correo}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => openEdit(u)} style={btnStyle('#2563eb')}>Editar</button>
                                <button onClick={() => eliminar(u.id)} style={btnStyle('#dc2626')}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal
                    title={editando ? 'Editar usuario' : 'Nuevo usuario'}
                    form={form} setForm={setForm}
                    onSave={guardar} onClose={closeModal}
                    isEdit={!!editando}
                />
            )}
        </div>
    )
}

export default Usuarios