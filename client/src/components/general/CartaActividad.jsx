import React from "react";
import '../../assets/styles/cartaActividad.css'; 
import {mostrarFecha} from '../../utils/utils';

function CartaActividad({ accion, descripcion, fecha }) {
    return (
        <div className="contenedor-carta-actividad">
            <div className="carta-actividad-seccion">
                <p className="carta-actividad-titulo">Acción:</p>
                <p className="carta-actividad-descripcion">{accion}</p>
            </div>
            <div className="carta-actividad-seccion">
                <p className="carta-actividad-titulo">Descripción:</p>
                <p className="carta-actividad-descripcion">{descripcion}</p>
            </div>
            <div className="carta-actividad-seccion">
                <p className="carta-actividad-titulo">Fecha:</p>
                <p className="carta-actividad-descripcion">{mostrarFecha(fecha)}</p>
            </div>
        </div>
    );
}

export default CartaActividad;
