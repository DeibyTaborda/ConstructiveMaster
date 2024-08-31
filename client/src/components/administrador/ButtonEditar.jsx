import React from "react";
import '../../assets/styles/buttonEditar.css';

function ButtonEditar({descripcion, onClick}){
    return(
        <>
        <button className="button-editar" onClick={onClick}>{descripcion}</button>
        </>
    );
}

export default ButtonEditar;