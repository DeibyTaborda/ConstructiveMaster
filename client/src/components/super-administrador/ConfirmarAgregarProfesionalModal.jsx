import React from "react";
import ButtonEditar from "../administrador/ButtonEditar";
import ButtonEliminar from "../administrador/ButtonEliminar";

function ConfirmarAgregarProfesionalModal({data, onClick, onClickCancelar}) {
    return(
        <>
            <div className="contenedor-modal-confirmar-agregar-profesional">
                <h3 className="titulo-eliminar-confirmar-agregar-profesional">Añadir a </h3>
                <h4 className="nombre-en-modal-confirmar-agregar-profesional">{data?.nombre || ''}</h4>
                <p className="pregunta-confirmar-agregar-profesional">{`¿Incorporar al profesional ${data?.nombre || ''} al equipo ConstructiveMaster?`}</p>
                <div className="contenedor-botones-modal-confirmar-agregar-profesional">
                    <ButtonEditar descripcion={'Aceptar'} onClick={onClick}/>
                    <ButtonEliminar description={'Cancelar'}/>
                </div>
            </div>
        </>
    );
}

export default ConfirmarAgregarProfesionalModal;