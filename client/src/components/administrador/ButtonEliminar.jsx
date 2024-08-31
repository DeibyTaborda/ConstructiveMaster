import React from "react";
import '../../assets/styles/buttonEliminar.css';

function ButtonEliminar({id, onClick, description}){
    return(
        <>
        <button className="button-eliminar" id={id} onClick={onClick}>{description}</button>
        </>
    );
}

export default ButtonEliminar;