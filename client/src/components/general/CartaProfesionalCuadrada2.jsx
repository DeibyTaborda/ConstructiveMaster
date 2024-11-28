import React, { useEffect } from "react";
import '../../assets/styles/cartaProfesionalCuadrada2.css';

function CartaProfesionalCuadrada2({profesional}) {
    return(
        <div className="contenedor-carta-profesional-cuadrada2">
            <div>
                <img src={profesional?.imagen ? `http://localhost:3001/${profesional?.imagen} ` :  'http://localhost:3001/uploads/imagenes/usernone.jpg'} alt={profesional?.nombre} />
            </div>
            <h2>{`${profesional?.nombre} ${profesional?.apellido}`}</h2>
            <p>{profesional?.especialidad}</p>
        </div>
    );
}

export default CartaProfesionalCuadrada2;