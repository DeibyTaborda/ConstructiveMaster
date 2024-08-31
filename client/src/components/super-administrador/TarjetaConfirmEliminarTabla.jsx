import React from "react";
import '../../assets/styles/tarjetaConfirmEliminarTabla.css';
import ButtonPequenoNaranja from "../super-administrador/ButtonPequeñoNaranja";
import ButtonPequenoGris from "../super-administrador/ButtonPequeñoGris";
import { TablasBdContext } from "../../context/TablasBdContext";

function TarjetaConfirmEliminarTabla({onClick, onClick2}) {
    return(
        <>
            <p className="mensaje-confirmar-eliminar-tabla">¿Estás seguro de que deseas eliminar la tabla?</p>
            <div className="confirm-buttons">
                <ButtonPequenoNaranja descripcion="Eliminar" onClick={onClick2}/>
                <ButtonPequenoGris descripcion="Cancelar" onClick={onClick}/>
            </div>
        </>
    );

}

export default TarjetaConfirmEliminarTabla;