import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_USUARIOS } from './api/urls'



function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    // Llamada a tu microservicio de usuarios
    axios.get(API_USUARIOS)
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Error conectando al microservicio", err))
  }, [])

  return (
    <div>
      <h1>Gestión de Usuarios </h1>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombres} - {u.correo}</li>
        ))}
      </ul>
    </div>
  )
}

export default App