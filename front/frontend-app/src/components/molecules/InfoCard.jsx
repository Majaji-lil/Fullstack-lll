// src/molecules/InfoCard/InfoCard.jsx
import Text from '../../components/atoms/Text'
import Button from '../../components/atoms/Button'
import '../../styles/molecules/InfoCard.css'

function InfoCard({ title, badge, badgeColor = 'green', description, meta, onEdit, onDelete }) {
    return (
        <div className="infocard">
            <div className="infocard__header">
                <p className="infocard__title">{title}</p>
                {badge && <Text badge={badgeColor}>{badge}</Text>}
            </div>
            {description && <p className="infocard__desc">{description}</p>}
            {meta && <p className="infocard__meta">{meta}</p>}
            <div className="infocard__actions">
                {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Editar</Button>}
                {onDelete && <Button variant="danger" size="sm" onClick={onDelete}>Eliminar</Button>}
            </div>
        </div>
    )
}

export default InfoCard
