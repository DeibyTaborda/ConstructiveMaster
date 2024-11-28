import React from "react";
import '../../assets/styles/tarjetaInfoActividad.css';
import { mostrarFecha } from '../../utils/utils';
import { transformarEstadoTrabajo } from '../../utils/utils';

function TarjetaInfoActividad({ data, actualizarEstadoTrabajo }) {

    // Función que combina la fecha y la hora de la actividad
    const combinarFechaYHora = (fecha, hora) => {
        const [year, month, day] = fecha.split('T')[0].split('-');
        const [hours, minutes, seconds] = hora.split(':');
        
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const validarTiempoRestante = (fecha, hora) => {
        const fechaActividad = combinarFechaYHora(fecha, hora);
        const fechaActual = new Date();

        const diferenciaMilisegundos = fechaActividad - fechaActual;

        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);

        return diferenciaHoras >= 24;
    };

    const mostrarBoton = data.estado === 'pendiente' && validarTiempoRestante(data.fecha, data.hora);

    return (
        <div className="contenedor-info-actividad">
            <p className="titulo-info">ID:</p>
            <p>{data.id}</p>
            <p className="titulo-info">Nombre del profesional:</p>
            <p>{data.nombre_profesional}</p>
            <p className="titulo-info">Hora:</p>
            <p>{data.hora}</p>
            <p className="titulo-info">Fecha:</p>
            <p>{mostrarFecha(data.fecha)}</p>
            <p className="titulo-info">Dirección:</p>
            <p>{data.direccion}</p>
            <p className="titulo-info">Estado:</p>
            <p>{transformarEstadoTrabajo(data.estado)}</p>
            {mostrarBoton && (
                <button onClick={() => actualizarEstadoTrabajo(data.id)}>
                    Cancelar
                </button>
            )}
        </div>
    );
}

export default TarjetaInfoActividad;

