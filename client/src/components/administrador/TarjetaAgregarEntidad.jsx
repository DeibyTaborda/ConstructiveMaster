import React from "react";
import '../../assets/styles/tarjetaAgregarEntidad.css';

function TarjetaAgregarEntidad({cadena, onClick, id}) {
    return(
        <>
            <button onClick={onClick} className="tarjeta-agregar-entidad" id={id}>
                {cadena}
            </button>
        </>
    );
}

export default TarjetaAgregarEntidad;