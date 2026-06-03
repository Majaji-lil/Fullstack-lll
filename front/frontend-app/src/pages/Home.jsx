// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import Section from '../components/atoms/Section'
import Text from '../components/atoms/Text'
import Button from '../components/atoms/Button'
import { IconBox } from '../components/atoms/Image'
import '../styles/pages/Home.css'

const FEATURES = [
    { emoji: '🐕', title: 'Registra tu mascota', desc: 'Publica una ficha con nombre, especie y última ubicación.' },
    { emoji: '📋', title: 'Crea un reporte', desc: 'Genera un reporte de mascota perdida o encontrada en segundos.' },
    { emoji: '🔔', title: 'Recibe alertas', desc: 'La comunidad te notifica si alguien encuentra a tu mascota.' },
]

const TAGS = ['Spring Boot', 'React + Vite', 'API Gateway', 'MySQL']

function Home() {
    return (
        <div>
            <Section variant="hero">
                <p className="home-hero__label">Plataforma colaborativa de mascotas</p>
                <Text variant="h1">Porque cada mascota<br />merece volver a casa</Text>
                <p className="home-hero__sub">
                    Sanos y Salvos conecta a personas con mascotas perdidas con quienes las encuentran,
                    usando tecnología para reunirlos más rápido.
                </p>
                <div className="home-hero__actions">
                    <Link to="/mascotas"><Button variant="primary" size="lg">Ver mascotas perdidas</Button></Link>
                    <Link to="/reportes"><Button variant="outline" size="lg">Crear reporte</Button></Link>
                </div>
            </Section>

            <Section>
                <div className="home-features__title-group">
                    <Text variant="h2">¿Cómo funciona?</Text>
                    <Text variant="body">Simple, rápido y gratuito para toda la comunidad.</Text>
                </div>
                <div className="home-features__grid">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="home-feature-card">
                            <IconBox emoji={f.emoji} />
                            <Text variant="h3">{f.title}</Text>
                            <Text variant="small">{f.desc}</Text>
                        </div>
                    ))}
                </div>
            </Section>

            <Section variant="gray" size="sm">
                <Text variant="h2">Sobre el proyecto</Text>
                <Text variant="body">
                    Sanos y Salvos es un proyecto universitario desarrollado en DuocUC como parte del
                    curso FullStack Development III. Utiliza una arquitectura de microservicios con
                    Spring Boot, Node.js y React, conectados a través de una API Gateway.
                </Text>
                <div className="home-tags">
                    {TAGS.map(t => <Text key={t} badge="green">{t}</Text>)}
                </div>
            </Section>
        </div>
    )
}

export default Home
