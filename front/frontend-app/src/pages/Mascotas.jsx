// src/pages/Mascotas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_MASCOTAS } from '../api/urls'
import { useAuth } from '../context/AuthContext'
import InfoCard from '../components/molecules/InfoCard'
import Modal from '../organisms/Modal'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import '../styles/organisms/Grid.css'
import '../styles/pages/Mascotas.css'

const fotoUrl = (id) => `${import.meta.env.VITE_API_BASE || 'http://localhost:8090'}/api/mascotas/${id}/foto`

function FotoPreview({ file }) {
    const [preview, setPreview] = useState(null)
    useEffect(() => {
        if (!file) { setPreview(null); return }
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    if (!preview) return null
    return <img src={preview} alt="Preview" className="mascota-foto-preview" />
}

export default function Mascotas() {
    const [mascotas, setMascotas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [fotoFile, setFotoFile] = useState(null)
    const [formError, setFormError] = useState('')
    const [guardando, setGuardando] = useState(false)
    const { usuario, isAdmin } = useAuth()

    const [form, setForm] = useState({
        nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: ''
    })

    const cargar = () => {
        setLoading(true)
        axios.get(API_MASCOTAS)
            .then(res => {
                setMascotas(res.data)
                setError(null)
            })
            .catch(() => setError('No se pudo conectar al servicio de mascotas'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { cargar() }, [])

    // VALIDACIÓN DE EDICIÓN: Forzamos true si no encuentra ID para evitar bloquearte en desarrollo
    const puedeEditarMascota = (mascota) => {
        if (!usuario) return true; // Permitir en desarrollo si no hay sesión
        if (isAdmin) return true;
        if (!mascota.usuarioId) return true; // Si no tiene dueño asignado, permitir editar
        return mascota.usuarioId === usuario.id;
    }

    const openCreate = () => {
        setForm({ nombre: '', especie: '', raza: '', colorCaracteristica: '', tamano: '' })
        setEditando(null)
        setFotoFile(null)
        setFormError('')
        setModal(true)
    }

    const openEdit = (mascota) => {
        setFormError('')
        setEditando(mascota)
        setFotoFile(null)
        setForm({
            nombre: mascota.nombre || '',
            especie: mascota.especie || '',
            raza: mascota.raza || '',
            colorCaracteristica: mascota.colorCaracteristica || '',
            tamano: mascota.tamano || ''
        })
        setModal(true)
    }

    const guardar = async () => {
        if (!form.nombre.trim() || !form.especie.trim()) {
            setFormError('Nombre y especie son obligatorios')
            return
        }
        setGuardando(true)
        try {
            const payload = {
                ...form,
                usuarioId: editando ? editando.usuarioId : (usuario?.id || null),
                usuarioNombre: editando ? editando.usuarioNombre : (usuario?.nombres || null)
            }

            let mascotaId = editando?.id
            if (editando) {
                await axios.put(`${API_MASCOTAS}/${editando.id}`, payload)
            } else {
                const res = await axios.post(API_MASCOTAS, payload)
                mascotaId = res.data.id
            }

            if (fotoFile && mascotaId) {
                const formData = new FormData()
                formData.append('archivo', fotoFile)
                await axios.post(`${API_MASCOTAS}/${mascotaId}/foto`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }

            setModal(false)
            cargar()
        } catch (err) {
            setFormError('Error al procesar la mascota')
        } finally {
            setGuardando(false)
        }
    }

    const eliminar = (id) => {
        if (!confirm('¿Eliminar esta mascota?')) return
        axios.delete(`${API_MASCOTAS}/${id}`)
            .then(() => cargar())
            .catch(() => alert('No se pudo eliminar la mascota.'))
    }

    return (
        <div className="mascotas-page">
            <div className="page-header">
                <div>
                    <h1>Mis Mascotas</h1>
                    <p>{mascotas.length} registradas</p>
                </div>
                <Button variant="primary" onClick={openCreate}>+ Registrar Mascota</Button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <div className="alert-error">⚠️ {error}</div>}

            <div className="card-grid">
                {mascotas.map(m => {
                    const [fotoOk, setFotoOk] = useState(true)
                    return (
                        <div className="mascota-card" key={m.id}>
                            {fotoOk ? (
                                <img
                                    src={fotoUrl(m.id)}
                                    alt={m.nombre}
                                    className="mascota-card__img"
                                    onError={() => setFotoOk(false)}
                                />
                            ) : (
                                <div className="mascota-card__placeholder">🐾</div>
                            )}
                            <div className="mascota-card__content">
                                <InfoCard
                                    title={m.nombre}
                                    badge={m.especie}
                                    meta={`Raza: ${m.raza || 'N/A'} · Tamaño: ${m.tamano || 'N/A'}`}
                                    onEdit={puedeEditarMascota(m) ? () => openEdit(m) : undefined}
                                    onDelete={puedeEditarMascota(m) ? () => eliminar(m.id) : undefined}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {modal && (
                <Modal
                    title={editando ? 'Editar Mascota' : 'Registrar Mascota'}
                    onClose={() => setModal(false)}
                    onSave={guardar}
                    saveLabel={guardando ? 'Guardando...' : 'Guardar'}
                >
                    <Input label="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                    <Input label="Especie *" value={form.especie} onChange={e => setForm({ ...form, especie: e.target.value })} />
                    <Input label="Raza" value={form.raza} onChange={e => setForm({ ...form, raza: e.target.value })} />
                    <Input label="Tamaño" value={form.tamano} onChange={e => setForm({ ...form, tamano: e.target.value })} />
                    <Input label="Características" value={form.colorCaracteristica} onChange={e => setForm({ ...form, colorCaracteristica: e.target.value })} />

                    <div className="mascota-upload-section">
                        <label className="mascota-upload-label">Foto de la mascota</label>
                        <FotoPreview file={fotoFile} />
                        <label className="mascota-upload-picker">
                            <span>📷 Elegir Imagen</span>
                            <input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files[0] || null)} />
                        </label>
                    </div>
                    {formError && <div className="form-error">⚠️ {formError}</div>}
                </Modal>
            )}
        </div>
    )
}