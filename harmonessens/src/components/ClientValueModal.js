import React from 'react';
import "./ClientValueModal.css";

const ClientValueModal = ({ differences, onConfirm, onCancel, clientId }) => {
  return (
    <div className="confirmation-modal__overlay">
      <div className="confirmation-modal__content">
        <span className="confirmation-modal__close" onClick={onCancel}>&times;</span>
        <h2>Adresse email déjà utilisée</h2>
        <p>
          {differences.map((diff, index) => (
            <div key={index}>
              <strong>{diff.field}:</strong><br/> {diff.oldValue} → {diff.newValue}
            </div>
          ))}
        </p>
        <button className="confirmation-modal__button" onClick={() => onConfirm(true, clientId)}>Use New Data</button>
        <button className="confirmation-modal__button" onClick={() => onConfirm(false)}>Keep Old Data</button>
      </div>
    </div>
  );
};

export default ClientValueModal;
