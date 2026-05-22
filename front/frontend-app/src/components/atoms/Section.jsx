import '../../styles/atoms/Section.css'

function Section({ children, variant = '', size = 'default', className = '' }) {
    const cls = ['section', variant ? `section--${variant}` : '', className].filter(Boolean).join(' ')
    const innerCls = size === 'sm' ? 'section__inner--sm' : 'section__inner'
    return (
        <section className={cls}>
            <div className={innerCls}>{children}</div>
        </section>
    )
}

export default Section
