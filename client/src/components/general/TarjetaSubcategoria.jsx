import React, { useEffect } from "react";
import '../../assets/styles/tarjetaSubcategoria.css';

function TarjetaSubcategoria({imagen, alt, subcategoria, onClick}) {
    return (
        <div className="contenedor-tarjeta-subcategoria" onClick={onClick}>
            <img src={imagen ? `http://localhost:3001/${imagen}` : '/iconoImagen.png'} alt={alt} className="imagen-tarjeta-subcategoria" />
            <h3 className="nombreSubcategoria">{subcategoria}</h3>
        </div>
    );
}

export default TarjetaSubcategoria;