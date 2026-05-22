// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import Section from '../components/atoms/Section'
import Text from '../components/atoms/Text'
import Button from '../components/atoms/Button'
import { IconBox } from '../components/atoms/Image'

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
                <Text variant="small" className="hero-label">Plataforma colaborativa de mascotas</Text>
                <Text variant="h1" className="mt-sm">Porque cada mascota<br />merece volver a casa</Text>
                <Text variant="body" className="hero-sub mt-md">
                    Sanos y Salvos conecta a personas con mascotas perdidas con quienes las encuentran,
                    usando tecnología para reunirlos más rápido.
                </Text>
                <div className="hero-actions mt-lg">
                    <Link to="/mascotas"><Button variant="primary" size="lg">Ver mascotas perdidas</Button></Link>
                    <Link to="/reportes"><Button variant="outline" size="lg">Crear reporte</Button></Link>
                </div>
            </Section>

            <Section>
                <div className="section-title-group">
                    <Text variant="h2">¿Cómo funciona?</Text>
                    <Text variant="body">Simple, rápido y gratuito para toda la comunidad.</Text>
                </div>
                <div className="features-grid mt-lg">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="feature-card">
                            <IconBox emoji={f.emoji} />
                            <Text variant="h3">{f.title}</Text>
                            <Text variant="small">{f.desc}</Text>
                        </div>
                    ))}
                </div>
            </Section>


        </div>
    )
}

export default Home
