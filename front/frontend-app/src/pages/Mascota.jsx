// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import Text from '../components/atoms/Text'
import '../styles/organisms/Grid.css'

const EMPTY = { nombre: '', especie: '', raza: '', color: '', descripcion: '', ubicacion: '' }

function Mascotas() {
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const cargar = () => {
        setLoading(true)
        axios.get(API_MASCOTAS)
            .then(r => { setMascotas(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de mascotas'))
            .finally(() => setLoading(false))
    }
    useEffect(() => { cargar() }, [])

    const field = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) })

    const openCreate = () => { setForm(EMPTY); setEditando(null); setModal(true) }
    const openEdit = (m) => { setForm({ nombre: m.nombre || '', especie: m.especie || '', raza: m.raza || '', color: m.color || '', descripcion: m.descripcion || '', ubicacion: m.ubicacion || '' }); setEditando(m); setModal(true) }
    const closeModal = () => setModal(false)

    const guardar = () => {
        const req = editando ? axios.put(`${API_MASCOTAS}/${editando.id}`, form) : axios.post(API_MASCOTAS, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }
    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`).then(cargar)
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div className="page-header">
                <div className="page-header__text">
                    <h1>Mascotas perdidas</h1>
                    <p>{mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada{mascotas.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Registrar mascota</Button>
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: 'system-ui' }}>Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && mascotas.length === 0 && (
                <div className="empty-state"><div className="empty-state__icon">🐾</div><p>No hay mascotas registradas aún.</p></div>
            )}

            <div className="card-grid">
                {mascotas.map(m => (
                    <InfoCard
                        key={m.id}
                        title={m.nombre || 'Sin nombre'}
                        badge="Perdida" badgeColor="red"
                        description={m.descripcion}
                        meta={[m.especie, m.raza, m.ubicacion && `📍 ${m.ubicacion}`].filter(Boolean).join(' · ')}
                        onEdit={() => openEdit(m)}
                        onDelete={() => eliminar(m.id)}
                    />
                ))}
            </div>

            {modal && (
                <Modal title={editando ? 'Editar mascota' : 'Registrar mascota'} onClose={closeModal} onSave={guardar}>
                    <Input label="Nombre" placeholder="Ej: Firulais"        {...field('nombre')} />
                    <Input label="Especie" placeholder="Ej: Perro, Gato"     {...field('especie')} />
                    <Input label="Raza" placeholder="Ej: Labrador"        {...field('raza')} />
                    <Input label="Color" placeholder="Ej: Café con blanco" {...field('color')} />
                    <Input label="Última ubicación" placeholder="Ej: Parque O'Higgins" {...field('ubicacion')} />
                    <Input label="Descripción" placeholder="Señas particulares..." textarea {...field('descripcion')} />
                </Modal>
            )}
        </div>
    )
}

export default Mascotas
