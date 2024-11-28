import React from "react";
import '../../assets/styles/confirmarAdmisionProfesional.css';

function ConfirmarAdmisionProfesional({ titulo, referencia, mensaje, onClick, onClickCancelar, Icono, boton1, boton2 }) {
    return (
        <div className="dialogo-confirmar-admision">
            <h3 className="titulo-admision-profesional">{titulo}</h3>
            <h4 className="referencia-admision">{referencia}</h4>
            <p className="mensaje-admision">{mensaje}</p>
            {Icono && (<Icono className="icono-admision"/>)}
            <div className="contenedor-botones-admision">
                <button className="boton-admitir" onClick={onClick}>{boton1}</button>
                <button className="boton-rechazar" onClick={onClickCancelar}>{boton2}</button>
            </div>
        </div>
    );
}

export default ConfirmarAdmisionProfesional;
