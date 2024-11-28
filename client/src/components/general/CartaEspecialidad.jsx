import React, { useEffect } from "react";
import '../../assets/styles/cartaEspecialidad.css';

function CartaEspecialidad({especialidad}) {
    return (
        <div className="contenedor-carta-especialidad">
            <div>
                <img src={especialidad?.imagen ? `http://localhost:3001/${especialidad.imagen}` :  '/iconoImagen.png'} alt={especialidad?.subcategoria} />
            </div>
            <h2>{especialidad?.subcategoria}</h2>
        </div>
    );
}

export default CartaEspecialidad;