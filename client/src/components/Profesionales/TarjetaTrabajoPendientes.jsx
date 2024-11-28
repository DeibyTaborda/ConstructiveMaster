import React from "react";
import '../../assets/styles/tarjetaTrabajoPendiente.css';
import {mostrarFecha, transformarEstadoTrabajo} from '../../utils/utils';

function TarjetaTrabajoPendiente({id, cliente, fecha, hora, estado}) {
    return(
        <div className="contenedor-tarjeta-trabajo-pendiente">
            <div>{id}</div>
            <div>{cliente}</div>
            <div>{mostrarFecha(fecha)}</div>
            <div>{hora}</div>
            <div>{transformarEstadoTrabajo(estado)}</div>
        </div>
        
    );
}

export default TarjetaTrabajoPendiente;