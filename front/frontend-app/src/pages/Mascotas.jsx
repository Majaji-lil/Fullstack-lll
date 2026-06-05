// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Mascotas.css'

const EMPTY = { nombre: '', especie: '', raza: '', color_caracteristica: '', tamano: '' }

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

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm({ ...form, [key]: e.target.value }),
    })

    const openCreate = () => { setForm(EMPTY); setEditando(null); setModal(true) }
    const openEdit = (m) => {
        setForm({
            nombre: m.nombre || '',
            especie: m.especie || '',
            raza: m.raza || '',
            color_caracteristica: m.color_caracteristica || '',
            tamano: m.tamano || '',
        })
        setEditando(m)
        setModal(true)
    }
    const closeModal = () => setModal(false)

    const guardar = () => {
        const req = editando
            ? axios.put(`${API_MASCOTAS}/${editando.id}`, form)
            : axios.post(API_MASCOTAS, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`).then(cargar)
    }

    return (
        <div className="mascotas-page">

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Mascotas perdidas</h1>
                    <p>{mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada{mascotas.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Registrar mascota</Button>
            </div>

            {loading && <p className="mascotas-loading">Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && mascotas.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">🐾</div>
                    <p>No hay mascotas registradas aún.</p>
                </div>
            )}

            <div className="card-grid">
                {mascotas.map(m => (
                    <InfoCard
                        key={m.id}
                        title={m.nombre || 'Sin nombre'}
                        badge="Perdida"
                        badgeColor="red"
                        description={m.especie && `${m.especie}${m.raza ? ` · ${m.raza}` : ''}`}
                        meta={[
                            m.color_caracteristica && `🎨 ${m.color_caracteristica}`,
                            m.tamano && `📏 ${m.tamano}`,
                        ].filter(Boolean).join('  ·  ')}
                        onEdit={() => openEdit(m)}
                        onDelete={() => eliminar(m.id)}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    title={editando ? 'Editar mascota' : 'Registrar mascota'}
                    onClose={closeModal}
                    onSave={guardar}
                >
                    <Input label="Nombre" placeholder="Ej: Firulais"         {...field('nombre')} />
                    <Input label="Especie" placeholder="Ej: Perro, Gato"      {...field('especie')} />
                    <Input label="Raza" placeholder="Ej: Labrador"         {...field('raza')} />
                    <Input label="Color / característica" placeholder="Ej: Café con blanco" {...field('color_caracteristica')} />
                    <Input label="Tamaño" placeholder="Ej: Mediano"          {...field('tamano')} />
                </Modal>
            )}
        </div>
    )
}

export default Mascotas
