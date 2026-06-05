// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { API_USUARIOS } from '../api/urls'
import '../styles/pages/Profile.css'

function Profile() {
    const { usuario, setUsuario, logout } = useAuth()

    const [nombres, setNombres] = useState('')
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        if (usuario) {
            setNombres(usuario.nombres || '')
            setCorreo(usuario.correo || '')
        }
    }, [usuario])

    if (!usuario) {
        return (
            <div className="profile-container profile-anonimo">
                <p>⚠️ Debes iniciar sesión para ver tu perfil.</p>
            </div>
        )
    }

    const handleGuardarCambios = async (e) => {
        e.preventDefault()
        setMensaje({ texto: '', tipo: '' })

        if (!nombres.trim() || !correo.trim()) {
            setMensaje({ texto: 'El nombre y el correo no pueden estar vacíos.', tipo: 'error' })
            return
        }
        if (password && password !== confirmPassword) {
            setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'error' })
            return
        }
        if (password && password.length < 6) {
            setMensaje({ texto: 'La contraseña debe tener al menos 6 caracteres.', tipo: 'error' })
            return
        }

        try {
            setCargando(true)

            // IMPORTANTE: el backend tiene @JsonProperty(WRITE_ONLY) en password.
            // Si el usuario no quiere cambiar la contraseña, NO la enviamos en el PUT
            // para evitar pisar la contraseña actual con undefined/null.
            const datosActualizados = {
                nombres,
                correo,
                ...(password ? { password } : {}),
            }

            const { data: usuarioModificado } = await axios.put(
                `${API_USUARIOS}/${usuario.id}`,
                datosActualizados
            )

            // Actualiza localStorage y el contexto
            const usuarioActualizado = { ...usuario, nombres, correo }
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
            setUsuario(usuarioActualizado)

            // El backend devuelve el usuario sin password (WRITE_ONLY),
            // así que usamos la versión local para no perder el id
            setMensaje({ texto: '¡Perfil actualizado con éxito!', tipo: 'exito' })
            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            console.error(err)
            const msg = err.response?.status === 409
                ? 'Ese correo ya está en uso por otra cuenta.'
                : 'Hubo un error al actualizar los datos en el servidor.'
            setMensaje({ texto: msg, tipo: 'error' })
        } finally {
            setCargando(false)
        }
    }

    const initials = nombres
        ? nombres.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    return (
        <div className="profile-page">
            <div className="profile-card">

                {/* Header */}
                <div className="profile-header">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">{initials}</div>
                    </div>
                    <h2>Mi Perfil</h2>
                    <p className="profile-subtitle">Gestiona la información de tu cuenta</p>
                </div>

                {/* Alerta */}
                {mensaje.texto && (
                    <div className={`profile-alert alert-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleGuardarCambios} className="profile-form">

                    <div className="profile-form-group">
                        <label htmlFor="nombres">Nombre Completo</label>
                        <input type="text" id="nombres" value={nombres}
                            onChange={e => setNombres(e.target.value)} placeholder="Tu nombre" />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input type="email" id="correo" value={correo}
                            onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" />
                    </div>

                    <hr className="profile-divider" />
                    <p className="profile-section-title">Cambiar Contraseña (Opcional)</p>

                    <div className="profile-form-group">
                        <label htmlFor="password">Nueva Contraseña</label>
                        <input type="password" id="password" value={password}
                            onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                        <input type="password" id="confirmPassword" value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="profile-btn-save" disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button type="button" className="profile-btn-logout" onClick={logout}>
                            Cerrar Sesión
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Profile
