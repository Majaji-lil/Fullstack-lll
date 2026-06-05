// src/components/molecules/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../atoms/Button'
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
    const navigate = useNavigate()
    const { isAdmin, isLoggedIn, usuario, logout } = useAuth()

    const links = isAdmin ? ADMIN_LINKS : PUBLIC_LINKS

    const handleLogout = () => { logout(); navigate('/') }

    const initials = usuario?.nombres
        ? usuario.nombres.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?'

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

            {/* Sin sesión */}
            {!isLoggedIn && (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Iniciar sesión</Button>
                    </Link>
                    <Link to="/registro">
                        <Button variant="primary" size="sm">Registrarse</Button>
                    </Link>
                </div>
            )}

            {/* Usuario logueado — avatar y nombre llevan al perfil */}
            {isLoggedIn && !isAdmin && (
                <div className="navbar__user-zone">
                    <Link to="/perfil" className="navbar__user-link">
                        <div className="navbar__avatar">{initials}</div>
                        <span className="navbar__username">
                            {usuario?.nombres?.split(' ')[0]}
                        </span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>Salir</Button>
                </div>
            )}

            {/* Admin */}
            {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="navbar__admin-badge">Admin</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
                </div>
            )}

        </nav>
    )
}

export default Navbar
