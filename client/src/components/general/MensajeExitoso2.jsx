import React from 'react';
import '../../assets/styles/mensajeExitoso.css';

const MensajeExitoso = ({ mensaje, visible }) => {
  if (!visible) return null;

  return (
    <div className="mensaje-exitoso2">
      <p>{mensaje}</p>
    </div>
  );
};

export default MensajeExitoso;
