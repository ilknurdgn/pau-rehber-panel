import React from 'react';
import './BaseModal.css';

export default function BaseModal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}