// src/components/molecules/ThemeToggle.jsx
import { useTheme } from '../../context/ThemeContext'
import '../../styles/molecules/ThemeToggle.css'

function ThemeToggle() {
  const { tema, toggleTema } = useTheme()
  const esOscuro = tema === 'oscuro'

  return (
    <button
      className={`theme-toggle ${esOscuro ? 'theme-toggle--oscuro' : ''}`}
      onClick={toggleTema}
      title={esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-label="Cambiar tema"
    >
      <span className="theme-toggle__icon">
        {esOscuro ? '☀️' : '🌙'}
      </span>
    </button>
  )
}

export default ThemeToggle
