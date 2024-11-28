import React from "react";
import '../../assets/styles/tarjetaDatoProfesional.css';

function TarjetaDatoProfesional({dato, valor}) {
    return (
        <div className="contenedor-dato-profesional">
            <h3>{dato}</h3>
            <p>{valor}</p>
        </div>
    );
}

export default TarjetaDatoProfesional;