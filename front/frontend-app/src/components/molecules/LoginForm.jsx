// src/molecules/LoginForm/LoginForm.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/atoms/Input'
import Button from '../../components/atoms/Button'
import '../../styles/molecules/LoginForm.css'

function LoginForm() {
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, setError } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = () => {
        if (!correo || !password) { setError('Completa todos los campos'); return }
        const ok = login(correo, password)
        if (ok) navigate('/')
    }

    return (
        <div className="login-form">
            <div className="login-form__header">
                <div className="login-form__logo">🐾</div>
                <p className="login-form__title">Acceso administrador</p>
                <p className="login-form__subtitle">Solo personal autorizado</p>
            </div>

            {error && <div className="login-form__error">{error}</div>}

            <Input
                label="Correo"
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="correo@sanosysalvos.cl"
            />
            <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
            />

            <Button variant="primary" onClick={handleSubmit}>Ingresar</Button>

            <p className="login-form__hint">
                Credenciales de prueba:<br />
                admin@sanosysalvos.cl / admin1234
            </p>
        </div>
    )
}

export default LoginForm
