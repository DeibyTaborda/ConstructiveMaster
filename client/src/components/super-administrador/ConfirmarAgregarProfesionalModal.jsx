import React from "react";
import '../../assets/styles/confirmarAgregarProfesionalModal.css';
import ButtonEditar from "../administrador/ButtonEditar";
import ButtonEliminar from "../administrador/ButtonEliminar";
import { MdOutlineQuestionMark } from "react-icons/md";

function ConfirmarAgregarProfesionalModal({data, onClick, onClickCancelar}) {
    return(
        <>
            <div className="contenedor-modal-confirmar-agregar-profesional">
                <h3 className="titulo-eliminar-confirmar-agregar-profesional">Añadir a </h3>
                <h4 className="nombre-en-modal-confirmar-agregar-profesional">{data?.nombre || ''} {data?.apellido || ''}</h4>
                <p className="pregunta-confirmar-agregar-profesional">{`¿Incorporar al profesional ${data?.nombre || ''} ${data?.apellido || ''} al equipo ConstructiveMaster?`}</p>
                <MdOutlineQuestionMark className="icon-confirmar-agregar-profesional"/>
                <div className="contenedor-botones-modal-confirmar-agregar-profesional">
                    <ButtonEditar descripcion={'Aceptar'} onClick={onClick}/>
                    <ButtonEliminar description={'Cancelar'} onClick={onClickCancelar}/>
                </div>
            </div>
        </>
    );
}

export default ConfirmarAgregarProfesionalModal;