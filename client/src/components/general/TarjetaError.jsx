import React from "react";
import '../../assets/styles/tarjetError.css';

function TarjetaError({mensajeError}) {
    return (
        <div className="contenedor-mensaje-error-temporizado">
            <p>{mensajeError}</p>
        </div>
    );
}

export default TarjetaError;