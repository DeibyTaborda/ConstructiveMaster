import React from "react";
import '../../assets/styles/cartaProfesional.css';

function CartaProfesional({imagen, nombre, especialidad, disponibilidad, onClick}) {
    return ( 
            <div className="contenedor-principal-carta-profesional" onClick={onClick}>
                <div className="contenedor-imagen-carta-profesional">
                    <img src={imagen ? `http://localhost:3001/${imagen}` : '/usernone.jpg'} alt="imagen profesional" className="img-carta-profesional"/>
                </div>
                <div className="contenedor-datos-profesional">
                    <h3>{nombre}</h3> 
                    <h4>{especialidad}</h4> 
                </div> 
                <div className="contenedor-disponibilida-profesional">
                    <p className={`disponibilidad-profesional ${disponibilidad === 'Disponible' ? 'disponible' : 'ocupado'}`}>{disponibilidad}</p>
                </div>
            </div>
    );

}

export default CartaProfesional;