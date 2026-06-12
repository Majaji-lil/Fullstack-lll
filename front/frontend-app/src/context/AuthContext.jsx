// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { API_USUARIOS } from '../api/urls'

const ADMIN = { correo: 'admin@sanosysalvos.cl', password: 'admin1234' }

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usr = localStorage.getItem('usuario')
    return usr ? JSON.parse(usr) : null
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true'
  })

  const [error, setError] = useState('')

  const login = async (correo, password) => {
    setError('')

    // Admin hardcodeado
    if (correo === ADMIN.correo && password === ADMIN.password) {
      const adminUser = { id: 0, nombres: 'Administrador', correo: ADMIN.correo }

      localStorage.setItem('usuario', JSON.stringify(adminUser))
      localStorage.setItem('isAdmin', 'true')

      setIsAdmin(true)
      setUsuario(adminUser)
      return true
    }

    try {
      const { data: usuarioEncontrado } = await axios.post(
        `${API_USUARIOS}/login`,
        { correo, password }
      )

      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado))
      localStorage.setItem('isAdmin', 'false')

      setUsuario(usuarioEncontrado)
      setIsAdmin(false)
      return true
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos')
      } else {
        setError('No se pudo conectar al servidor')
      }
      return false
    }
  }

  const register = async (nombres, correo, password) => {
    setError('')
    try {
      const { data: nuevoUsuario } = await axios.post(API_USUARIOS, {
        nombres, correo, password,
      })

      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
      localStorage.setItem('isAdmin', 'false')

      setUsuario(nuevoUsuario)
      setIsAdmin(false)
      return true
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya existe una cuenta con ese correo')
      } else {
        setError('No se pudo crear la cuenta')
      }
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('isAdmin')

    setUsuario(null)
    setIsAdmin(false)
    setError('')
  }

  return (
    <AuthContext.Provider value={{
      usuario, isAdmin, isLoggedIn: !!usuario,
      login, register, logout, error, setError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)