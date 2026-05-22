// src/organisms/Modal/Modal.jsx
import Button from '../components/atoms/Button'
import '../styles/organisms/Modal.css'

function Modal({ title, children, onClose, onSave, saveLabel = 'Guardar' }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-box__header">
          <span className="modal-box__title">{title}</span>
          <button className="modal-box__close" onClick={onClose}>×</button>
        </div>
        <div className="modal-box__body">{children}</div>
        <div className="modal-box__footer">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
