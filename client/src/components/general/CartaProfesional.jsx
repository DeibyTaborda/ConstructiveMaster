import React from "react";
import '../../assets/styles/CartaProfesionalInicio.css';

function CartaProfesional({profesional, onClick}) {
    return(
        <div className="contenedor-carta-profesional-inicio" onClick={onClick}>
            <div>
                <div>
                    <img src={profesional?.imagen ?`http://localhost:3001/${profesional.imagen}` : 'usernone.jpg'} alt={profesional.nombre}/>
                </div>
            </div>
            <h2>{`${profesional.nombre} ${profesional.apellido}`}</h2>
            <h3>{profesional.especialidad}</h3>
            <p>{profesional.estado}</p>
        </div>
    );
}
 
export default CartaProfesional; 