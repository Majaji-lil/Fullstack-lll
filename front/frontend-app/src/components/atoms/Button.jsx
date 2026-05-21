import '../../styles/atoms/Button.css'

function Button({ children, variant = 'primary', size = '', onClick, type = 'button', disabled = false }) {
    const classes = ['btn', `btn--${variant}`, size ? `btn--${size}` : ''].filter(Boolean).join(' ')
    return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button
