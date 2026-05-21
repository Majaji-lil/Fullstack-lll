// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'

const links = [
    { to: '/', label: 'Inicio' },
    { to: '/mascotas', label: 'Mascotas' },
    { to: '/usuarios', label: 'Usuarios' },
    { to: '/reportes', label: 'Reportes' },
]

function Navbar() {
    const { pathname } = useLocation()

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 2rem',
            height: '56px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginRight: '1.5rem' }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#16a34a', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 16 }}>🐾</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#111827', fontFamily: 'Georgia, serif' }}>
                    Sanos y Salvos
                </span>
            </Link>

            {/* Links */}
            {links.map(l => (
                <Link
                    key={l.to}
                    to={l.to}
                    style={{
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: pathname === l.to ? 600 : 400,
                        color: pathname === l.to ? '#16a34a' : '#6b7280',
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: pathname === l.to ? '#f0fdf4' : 'transparent',
                        transition: 'all 0.15s',
                    }}
                >
                    {l.label}
                </Link>
            ))}
        </nav>
    )
}

export default Navbar