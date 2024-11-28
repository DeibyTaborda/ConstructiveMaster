import React from "react";
import '../../assets/styles/cartaProfesionalCuadrada.css';
import ButtonPequenoGris from "../super-administrador/ButtonPequeñoGris";
import ButtonPequenoNaranja from "../super-administrador/ButtonPequeñoNaranja";

function CartaProfesionaCuadrada({imagen, nombre, especialidad, onClick, buscarOtroProfesional}) {
    return (
        <div className='contenedor-carta-cuadrada-profesional'>
        <div>
            <img src={imagen ? `http://localhost:3001/${imagen}` : '/usernone.jpg'} alt="" />
        </div>
        <h3>
            {nombre}
        </h3>
        <h4>
            {especialidad}
        </h4>
        <div>
            <ButtonPequenoNaranja descripcion={'Aceptar'} onClick={onClick}/>
            <ButtonPequenoGris descripcion={'Otro'} onClick={ buscarOtroProfesional}/>
        </div>
    </div>
    );
}

export default CartaProfesionaCuadrada;