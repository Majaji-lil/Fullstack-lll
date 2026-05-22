// src/molecules/Navbar/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/atoms/Button'
import '../../styles/molecules/Navbar.css'

const PUBLIC_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/mascotas', label: 'Mascotas' },
    { to: '/reportes', label: 'Reportes' },
]
const ADMIN_LINKS = [
    ...PUBLIC_LINKS,
    { to: '/usuarios', label: 'Usuarios' },
]

function Navbar() {
    const { pathname } = useLocation()
    const { isAdmin, logout } = useAuth()
    const links = isAdmin ? ADMIN_LINKS : PUBLIC_LINKS

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__brand">
                <div className="navbar__logo">🐾</div>
                <span className="navbar__title">Sanos y Salvos</span>
            </Link>

            {links.map(l => (
                <Link
                    key={l.to}
                    to={l.to}
                    className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}
                >
                    {l.label}
                </Link>
            ))}

            <div className="navbar__spacer" />

            {isAdmin ? (
                <>
                    <span className="navbar__admin-badge">Admin</span>
                    <Button variant="ghost" size="sm" onClick={logout}>Cerrar sesión</Button>
                </>
            ) : (
                <Link to="/login">
                    <Button variant="outline" size="sm">Acceso admin</Button>
                </Link>
            )}
        </nav>
    )
}

export default Navbar
