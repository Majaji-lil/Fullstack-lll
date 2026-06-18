// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/pages/Login.css'

const validarFormatoCorreo = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

function Campo({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="login-field">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}

function FormLogin({ onSwitch }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    if (!correo || !password) { setError('Completa todos los campos'); return }
    
    if (!validarFormatoCorreo(correo.trim())) { 
      setError('Por favor, ingresa un correo electrónico válido'); 
      return 
    }

    setCargando(true)
    const ok = await login(correo.trim(), password)
    setCargando(false)
    if (ok) navigate('/')
  }

  return (
    <>
      <Campo label="Correo" type="email" value={correo}
        onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.cl" />
      <Campo label="Contraseña" type="password" value={password}
        onChange={e => setPassword(e.target.value)} placeholder="••••••••" />

      {error && <div className="login-error">{error}</div>}

      <button className="login-btn-submit" onClick={handleSubmit} disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
      </button>

      <p className="login-switch">
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitch}>Regístrate</button>
      </p>
    </>
  )
}

function FormRegistro({ onSwitch }) {
  const [nombres, setNombres] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [cargando, setCargando] = useState(false)
  const { register, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    if (!nombres || !correo || !password) { setError('Completa todos los campos'); return }
    
    if (!validarFormatoCorreo(correo.trim())) { 
      setError('El correo debe incluir un @ y un dominio válido (ej: usuario@correo.com)'); 
      return 
    }
    
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }

    setCargando(true)
    const ok = await register(nombres.trim(), correo.trim(), password)
    setCargando(false)
    if (ok) navigate('/')
  }

  return (
    <>
      <Campo label="Nombre completo" value={nombres}
        onChange={e => setNombres(e.target.value)} placeholder="Juan Pérez" />
      <Campo label="Correo" type="email" value={correo}
        onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.cl" />
      <Campo label="Contraseña" type="password" value={password}
        onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
      <Campo label="Confirmar contraseña" type="password" value={confirm}
        onChange={e => setConfirm(e.target.value)} placeholder="Repite la contraseña" />

      {error && <div className="login-error">{error}</div>}

      <button className="login-btn-submit" onClick={handleSubmit} disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="login-switch">
        ¿Ya tienes cuenta?{' '}
        <button onClick={onSwitch}>Inicia sesión</button>
      </p>
    </>
  )
}

function Login() {
  const { pathname } = useLocation()
  const { setError } = useAuth()

  const [tab, setTab] = useState(pathname === '/registro' ? 'registro' : 'login')

  const switchTab = (t) => { setError(''); setTab(t) }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-card__logo-wrap">
          <div className="login-card__logo">🐾</div>
          <p className="login-card__title">Sanos y Salvos</p>
          <p className="login-card__subtitle">
            {tab === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
          </p>
        </div>

        <div className="login-tabs">
          {[['login', 'Iniciar sesión'], ['registro', 'Registrarse']].map(([key, label]) => (
            <button
              key={key}
              className={`login-tab ${tab === key ? 'login-tab--active' : ''}`}
              onClick={() => switchTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'login'
          ? <FormLogin onSwitch={() => switchTab('registro')} />
          : <FormRegistro onSwitch={() => switchTab('login')} />
        }
      </div>
    </div>
  )
}

export default Login