import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/molecules/Navbar'
import Home from './pages/Home'
import Mascotas from './pages/Mascotas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'
import Login from './pages/Login'
import './styles/global.css'

function RutaProtegida({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 56px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/login" element={<Login />} />

            <Route path="/usuarios" element={
              <RutaProtegida>
                <Usuarios />
              </RutaProtegida>
            } />


            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App