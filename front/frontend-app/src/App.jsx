import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    // Llamada a tu microservicio de usuarios
    axios.get("http://localhost:8082/api/usuarios")
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