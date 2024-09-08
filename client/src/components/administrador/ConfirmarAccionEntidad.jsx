import React from "react";
import '../../assets/styles/confirmarEliminarCliente.css';
import ButtonEditar from "./ButtonEditar";
import ButtonEliminar from "./ButtonEliminar";

function ConfirmarAccionEntidad({titulo, referencia, mensaje, onClick, onClickCancelar, Icono, boton1, boton2}) {
    return(
        <>
            <div className="dialogo-confirmar-confirmar-entidad">
                <h3 className="titulo-confirmar-accion-entidad">{titulo}</h3>
                    <h4 className="referencia-accion-entidad">{referencia}</h4>
                    <p className="pregunta-confirmar-accion-entidad">{mensaje}</p> 
                    {Icono && (<Icono className="icono-confirmar-accion-entidad"/>)}
                    <div className="contenedor-botones-confirmar-acciones-entidad">
                        <ButtonEditar descripcion={boton1} onClick={onClick}/>
                        <ButtonEliminar description={boton2} onClick={onClickCancelar}/>
                    </div>
            </div>
        </> 
    );
}

export default ConfirmarAccionEntidad;