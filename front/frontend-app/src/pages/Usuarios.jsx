// src/pages/Usuarios.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_USUARIOS } from '../api/urls'
import { Avatar } from '../components/atoms/Image'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Usuarios.css'

const EMPTY = { nombres: '', correo: '', password: '' }

function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [busqueda, setBusqueda] = useState('')

    const cargar = () => {
        setLoading(true)
        axios.get(API_USUARIOS)
            .then(r => { setUsuarios(r.data); setError(null) })
            .catch(() => setError('No se pudo conectar al servicio de usuarios'))
            .finally(() => setLoading(false))
    }
    useEffect(() => { cargar() }, [])

    const field = (key) => ({
        value: form[key],
        onChange: e => setForm({ ...form, [key]: e.target.value }),
    })

    const openCreate = () => { setForm(EMPTY); setEditando(null); setModal(true) }
    const openEdit = (u) => {
        setForm({ nombres: u.nombres || '', correo: u.correo || '', password: '' })
        setEditando(u)
        setModal(true)
    }
    const closeModal = () => setModal(false)

    const guardar = () => {
        if (!form.nombres || !form.correo) { alert('Nombre y correo son obligatorios'); return }
        const req = editando
            ? axios.put(`${API_USUARIOS}/${editando.id}`, form)
            : axios.post(API_USUARIOS, form)
        req.then(() => { closeModal(); cargar() }).catch(() => alert('Error al guardar'))
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar este usuario?')) return
        axios.delete(`${API_USUARIOS}/${id}`).then(cargar)
    }

    const filtrados = usuarios.filter(u =>
        u.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correo?.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="usuarios-page">

            <div className="page-header">
                <div className="page-header__text">
                    <h1>Usuarios</h1>
                    <p>{usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Nuevo usuario</Button>
            </div>

            <input
                className="search-bar"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o correo..."
            />

            {loading && <p className="usuarios-loading">Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            {!loading && !error && (
                <div className="list-table">
                    {filtrados.length === 0 ? (
                        <div className="empty-state">
                            <p>{busqueda ? 'Sin resultados.' : 'No hay usuarios registrados.'}</p>
                        </div>
                    ) : filtrados.map(u => (
                        <div key={u.id} className="list-table__row">
                            <Avatar name={u.nombres} size="md" colorIndex={u.id} />
                            <div className="list-table__info">
                                <p className="list-table__name">{u.nombres}</p>
                                <p className="list-table__sub">{u.correo}</p>
                            </div>
                            <div className="list-table__actions">
                                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                                <Button variant="danger" size="sm" onClick={() => eliminar(u.id)}>Eliminar</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <Modal title={editando ? 'Editar usuario' : 'Nuevo usuario'} onClose={closeModal} onSave={guardar}>
                    <Input label="Nombre completo" placeholder="Ej: Juan Pérez"    {...field('nombres')} />
                    <Input label="Correo" type="email" placeholder="correo@ejemplo.com" {...field('correo')} />
                    {!editando && (
                        <Input label="Contraseña" type="password" placeholder="••••••••" {...field('password')} />
                    )}
                </Modal>
            )}
        </div>
    )
}

export default Usuarios
