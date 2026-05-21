// src/pages/Home.jsx
import { Link } from 'react-router-dom'

const features = [
    { icon: '🐕', title: 'Registra tu mascota', desc: 'Publica una ficha con foto, nombre, especie y última ubicación conocida.' },
    { icon: '📋', title: 'Crea un reporte', desc: 'Genera un reporte de mascota perdida o encontrada en segundos.' },
    { icon: '🔔', title: 'Recibe alertas', desc: 'La comunidad te notifica si alguien encuentra a tu mascota.' },
]

function Home() {
    return (
        <div style={{ fontFamily: 'Georgia, serif' }}>

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '5rem 2rem',
                textAlign: 'center',
                borderBottom: '1px solid #bbf7d0',
            }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'system-ui' }}>
                    Plataforma colaborativa de mascotas
                </p>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#111827', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                    Porque cada mascota<br />merece volver a casa
                </h1>
                <p style={{ fontSize: 18, color: '#4b5563', maxWidth: 540, margin: '0 auto 2.5rem', fontFamily: 'system-ui', fontWeight: 400, lineHeight: 1.7 }}>
                    Sanos y Salvos conecta a personas con mascotas perdidas con quienes las encuentran,
                    usando tecnología para reunirlos más rápido.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/mascotas" style={{
                        display: 'inline-block', textDecoration: 'none',
                        background: '#16a34a', color: '#fff',
                        padding: '12px 28px', borderRadius: 8,
                        fontWeight: 600, fontSize: 15, fontFamily: 'system-ui',
                    }}>
                        Ver mascotas perdidas
                    </Link>
                    <Link to="/reportes" style={{
                        display: 'inline-block', textDecoration: 'none',
                        background: '#fff', color: '#16a34a',
                        padding: '12px 28px', borderRadius: 8,
                        fontWeight: 600, fontSize: 15, fontFamily: 'system-ui',
                        border: '1.5px solid #16a34a',
                    }}>
                        Crear reporte
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '4rem 2rem', maxWidth: 960, margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                    ¿Cómo funciona?
                </h2>
                <p style={{ textAlign: 'center', color: '#6b7280', fontFamily: 'system-ui', marginBottom: '3rem' }}>
                    Simple, rápido y gratuito para toda la comunidad.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            background: '#fff', border: '1px solid #e5e7eb',
                            borderRadius: 12, padding: '2rem 1.5rem',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 40, marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, fontFamily: 'system-ui' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About */}
            <section style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
                        Sobre el proyecto
                    </h2>
                    <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, fontFamily: 'system-ui' }}>
                        Sanos y Salvos es un proyecto universitario desarrollado en DuocUC como parte del
                        curso FullStack Development III. Utiliza una arquitectura de microservicios con
                        Spring Boot, Node.js y React, conectados a través de una API Gateway.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                        {['Spring Boot', 'React + Vite', 'API Gateway', 'MySQL'].map(tag => (
                            <span key={tag} style={{
                                background: '#f0fdf4', color: '#15803d',
                                padding: '4px 14px', borderRadius: 99,
                                fontSize: 13, fontWeight: 600, fontFamily: 'system-ui',
                                border: '1px solid #bbf7d0',
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home