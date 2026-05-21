import '../../styles/atoms/Input.css'

function Input({ label, type = 'text', value, onChange, placeholder, error, textarea = false }) {
    const cls = ['input-field', error ? 'input-field--error' : ''].filter(Boolean).join(' ')
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            {textarea
                ? <textarea className={cls} value={value} onChange={onChange} placeholder={placeholder} />
                : <input className={cls} type={type} value={value} onChange={onChange} placeholder={placeholder} />
            }
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    )
}

export default Input
