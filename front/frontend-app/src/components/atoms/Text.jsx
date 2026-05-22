import '../../styles/atoms/Text.css'

function Text({ children, variant = 'body', badge, className = '' }) {
    if (badge) {
        return <span className={`text-badge text-badge--${badge} ${className}`}>{children}</span>
    }
    const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p'
    return <Tag className={`text-${variant} ${className}`}>{children}</Tag>
}

export default Text
