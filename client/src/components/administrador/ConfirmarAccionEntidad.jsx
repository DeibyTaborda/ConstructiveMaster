import React from "react";
import '../../assets/styles/confirmarEliminarCliente.css';

function ConfirmarAccionEntidad({ titulo, referencia, mensaje, onClick, onClickCancelar, Icono, boton1, boton2 }) {
    return (
        <div className="dialogo-confirmar-entidad">
            <h3 className="titulo-confirmar-accion">{titulo}</h3>
            <h4 className="referencia-accion">{referencia}</h4>
            <p className="mensaje-confirmar-accion">{mensaje}</p>
            {Icono && (<Icono className="icono-confirmar-accion"/>)}
            <div className="contenedor-botones-confirmar-acciones">
                <button className="boton-confirmar" onClick={onClick}>{boton1}</button>
                <button className="boton-cancelar" onClick={onClickCancelar}>{boton2}</button>
            </div>
        </div>
    );
}

export default ConfirmarAccionEntidad;
