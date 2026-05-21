import '../../styles/atoms/Image.css'

const AVATAR_COLORS = ['green', 'blue', 'purple', 'orange']

export function Avatar({ name, size = 'md', colorIndex = 0 }) {
    const initials = name
        ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?'
    const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
    const cls = `img-avatar img-avatar--${size} img-avatar--${color}`
    return <div className={cls}>{initials}</div>
}

export function IconBox({ emoji }) {
    return <div className="img-icon-box">{emoji}</div>
}
