import React, { useState } from "react";
import '../../assets/styles/tarjetaActividad.css';
import TarjetaInfoActividad from "./TarjetaInfActividad";
import {mostrarFecha} from '../../utils/utils';
import {transformarEstadoTrabajo} from '../../utils/utils';

function TarjetaActividad({data, actuliazarEstadoTrabajo}) {
    const [isOpenInfo, setisOpenInfo] = useState(false);


    const handleClick = () => {
        setisOpenInfo(!isOpenInfo);
    };
    
    return(
        <>
            <div className="contenedor-tarjeta-actividad" onClick={handleClick}>
                <p>{data.id}</p>
                <p>{data.fecha_inicio ? mostrarFecha(data.fecha) : ''}</p>
                <p>{data.fecha_fin}</p>
                <p>{transformarEstadoTrabajo(data.estado)}</p>
            </div>
            {isOpenInfo &&  (
                <div>
                    <TarjetaInfoActividad
                        data={data}
                        actualizarEstadoTrabajo={actuliazarEstadoTrabajo}
                    />
                </div>
            )}
        </>

    );
}

export default TarjetaActividad;