import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/molecules/Navbar'
import Footer from './organisms/Footer'
import Home from './pages/Home'
import Mascotas from './pages/Mascotas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'
import Mapa from './pages/Mapa'
import Login from './pages/Login'
import Profile from './pages/Profile'
import './styles/global.css'

function RutaProtegida({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <ThemeProvider>
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
                <Route path="/perfil" element={<Profile />} />
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
    </ThemeProvider>
  )
}

export default App