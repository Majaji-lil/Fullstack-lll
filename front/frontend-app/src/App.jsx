// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/molecules/Navbar'
import Footer from './organisms/Footer'
import Home from './pages/Home'
import Mascotas from './pages/Mascotas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'
import Login from './pages/Login'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound' // 👈 Importamos la nueva página de error
import './styles/global.css'


function RutaProtegida({ children }) {
  const { isAdmin } = useAuth()
  
  // 👈 MODIFICACIÓN CRÍTICA: Si no es Admin, pintamos la interfaz de "No existe" 
  // manteniendo la URL intacta en la barra del navegador.
  return isAdmin ? children : <NotFound />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mascotas" element={<Mascotas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Login />} />
              <Route path="/perfil" element={<Profile />} />
              
              <Route path="/usuarios" element={
                <RutaProtegida><Usuarios /></RutaProtegida>
              } />
              
              {/* 👈 Captura cualquier otra URL que no coincida y muestra el error */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App