import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'

// Mocks para evitar cargar mapas y APIs
vi.mock('../pages/Mapa', () => ({ default: () => <div>Mapa</div> }))
vi.mock('../pages/Mascotas', () => ({ default: () => <div>Mascotas</div> }))
vi.mock('../pages/Reportes', () => ({ default: () => <div>Reportes</div> }))
vi.mock('../pages/Usuarios', () => ({ default: () => <div>Usuarios</div> }))
vi.mock('../pages/Home', () => ({ default: () => <div><button>Ver mascotas perdidas</button><button>Crear reporte</button></div> }))
vi.mock('../pages/Login', () => ({ default: () => <div><button>Ingresar</button></div> }))
vi.mock('../components/molecules/Navbar', () => ({ default: () => <nav><a href="/">Inicio</a><a href="/mascotas">Mascotas</a><a href="/reportes">Reportes</a></nav> }))
vi.mock('../organisms/Footer', () => ({ default: () => <footer>Footer</footer> }))

import App from '../App'

const renderApp = (ruta = '/') => {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('App — navegación y botones', () => {

  it('renderiza la navbar correctamente', () => {
    render(<App />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Mascotas')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
  })

  it('renderiza el footer', () => {
    render(<App />)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('muestra botón Ver mascotas perdidas en Home', () => {
    render(<App />)
    expect(screen.getByText('Ver mascotas perdidas')).toBeInTheDocument()
  })

  it('muestra botón Crear reporte en Home', () => {
    render(<App />)
    expect(screen.getByText('Crear reporte')).toBeInTheDocument()
  })

  it('muestra botón Ingresar en Login', () => {
    window.history.pushState({}, '', '/login')
    render(<App />)
    expect(screen.getByText('Ingresar')).toBeInTheDocument()
})

it('ruta inexistente redirige a Home', () => {
    window.history.pushState({}, '', '/ruta-que-no-existe')
    render(<App />)
    expect(screen.getByText('Ver mascotas perdidas')).toBeInTheDocument()
})

})