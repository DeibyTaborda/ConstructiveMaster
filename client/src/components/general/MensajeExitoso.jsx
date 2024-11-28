import React from "react";
import '../../assets/styles/mensajeExitoso2.css'; // Asegúrate de importar el CSS

const MensajeExito = ({ mensaje, style }) => {
    if (!mensaje) return null; // No renderiza nada si no hay mensaje

    return (
        <div className="mensaje-exito" style={style}>
            <div className="mensaje-exito-icono">✓</div>
            <div className="mensaje-exito-texto">{mensaje}</div>
        </div>
    );
};

export default MensajeExito;
