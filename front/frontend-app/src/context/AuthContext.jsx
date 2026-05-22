// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'

const ADMIN_CREDENTIALS = {
  correo:   'admin@sanosysalvos.cl',
  password: 'admin1234',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError]     = useState('')

  const login = (correo, password) => {
    if (correo === ADMIN_CREDENTIALS.correo && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true)
      setError('')
      return true
    }
    setError('Credenciales incorrectas')
    return false
  }

  const logout = () => setIsAdmin(false)

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
