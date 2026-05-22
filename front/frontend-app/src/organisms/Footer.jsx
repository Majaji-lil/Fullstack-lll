import '../styles/organisms/Footer.css'

function Footer() {
    return (
        <footer className="main-footer">
            <div className="main-footer__inner">
                <p className="main-footer__text">
                    <strong>Dirección:</strong> Av. Américo Vespucio 1501, Mall Plaza Oeste, Cerrillos.
                </p>
                <p className="main-footer__text">
                    <strong>Teléfono:</strong> +56 9 9129 9945
                </p>
                <div className="main-footer__divider" />
                <p className="main-footer__credits">🌱 DuocUC — FullStack Development III</p>
            </div>
        </footer>
    )
}

export default Footer