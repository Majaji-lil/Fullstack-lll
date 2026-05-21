import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Mascotas from './pages/Mascotas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/mascotas">Mascotas</Link>
        <Link to="/usuarios">Usuarios</Link>
        <Link to="/reportes">Reportes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mascotas" element={<Mascotas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App