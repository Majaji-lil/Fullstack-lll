// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom'
import Button from '../components/atoms/Button'
import '../styles/pages/NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <span className="notfound-icon">🔍</span>
      <h1 className="notfound-title">Página no encontrada</h1>
      <p className="notfound-desc">
        La página que estás buscando no existe, ha sido eliminada o es de acceso exclusivo para administradores.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </div>
  )
}

export default NotFound