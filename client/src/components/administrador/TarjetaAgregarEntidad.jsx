import React from "react";
import '../../assets/styles/tarjetaAgregarEntidad.css';

function TarjetaAgregarEntidad({cadena, onClick}) {
    return(
        <>
            <button onClick={onClick} className="tarjeta-agregar-entidad">
                {cadena}
            </button>
        </>
    );
}

export default TarjetaAgregarEntidad;