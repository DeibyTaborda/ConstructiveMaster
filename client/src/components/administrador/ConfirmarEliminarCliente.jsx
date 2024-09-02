import React from "react";
import '../../assets/styles/confirmarEliminarCliente.css';
import ButtonEditar from "./ButtonEditar";
import ButtonEliminar from "./ButtonEliminar";
import { MdDelete } from "react-icons/md";

function ConfirmarEliminarCliente({id, onClick, onClickDelete, data}) {
    return(
        <>
            <div className="dialogo-confirmar-eliminar-cliente">
                <h3 className="titulo-confirmar-eliminar-cliente">Eliminar a</h3>
                    <h4 className="nombre-del-cliente-a-eliminar">{data?.nombre || ''}</h4>
                    <p className="pregunta-confirmar-eliminar-cliente">¿Quieres eliminar el cliente?</p> 
                    <MdDelete className="icon-confirmar-eliminar-cliente"/>
                    <div className="contenedor-botones-confirmar-eliminar-cliente">
                        <ButtonEditar descripcion={'Eliminar'} onClick={onClickDelete}/>
                        <ButtonEliminar description={'Cancelar'} onClick={onClick}/>
                    </div>
            </div>
        </> 
    );
}

export default ConfirmarEliminarCliente;