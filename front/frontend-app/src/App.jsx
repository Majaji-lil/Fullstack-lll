// src/App.jsx  — sin cambios en las rutas de mascotas/reportes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/molecules/Navbar'
import Footer from './organisms/Footer'
import Home from './pages/Home'
import Mascotas from './pages/Mascotas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'
import Mapa from './pages/Mapa'
import Login from './pages/Login'
import './styles/global.css'

// Solo admin puede entrar
function RutaProtegida({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/login" replace />
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
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Login />} />
              <Route path="/usuarios" element={
                <RutaProtegida><Usuarios /></RutaProtegida>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
