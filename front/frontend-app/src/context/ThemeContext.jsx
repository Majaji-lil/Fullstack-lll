// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    // Persiste la preferencia del usuario
    return localStorage.getItem('tema') || 'claro'
  })

  useEffect(() => {
    // Aplica el atributo al <html> para que el CSS lo capture globalmente
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  const toggleTema = () => setTema(t => t === 'claro' ? 'oscuro' : 'claro')

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
