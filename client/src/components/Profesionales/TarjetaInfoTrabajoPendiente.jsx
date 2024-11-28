import React, { useState } from "react";
import '../../assets/styles/tarjetaInfoTrabajoPendiente.css';
import { mostrarFecha, transformarEstadoTrabajo } from '../../utils/utils';

function TarjetaInfoTrabajoPendiente({ id, cliente, fecha, hora, direccion, descripcion, valor, fecha_inicio, fecha_fin, estado, solicitudPut, confirmarTrabajo }) {
    console.log(fecha)
    console.log(hora)
    const puedeCancelar = () => {
        const ahora = new Date();
    
        const fechaSolo = fecha.split('T')[0]; 
   
        const [horaHoras, horaMinutos, horaSegundos] = hora.split(':');
        const fechaHoraCombinada = new Date(fechaSolo);
        fechaHoraCombinada.setHours(horaHoras, horaMinutos, horaSegundos); 
    
        const diferenciaHoras = (fechaHoraCombinada - ahora) / (1000 * 60 * 60);
    
        return diferenciaHoras >= 24;
    };

    const handleCancelar = () => {
        if (puedeCancelar()) {
            solicitudPut(id);
        }
    };

    // Condición para mostrar el botón solo si el estado es "confirmado" o "pendiente"
    const mostrarBotonCancelar = puedeCancelar() && (estado === "confirmado" || estado === "pendiente");
    const mostrarBotonConfirmar = estado === 'pendiente';
    return (
        <div className="contenedor-tarjeta-inf-trabajo-pendiente">
            <div className="id">ID: {id}</div>
            <div className="cliente">Cliente: {cliente}</div>
            <div className="fecha">Fecha: {mostrarFecha(fecha)}</div>
            <div className="hora">Hora: {hora}</div>
            <div className="direccion">Dirección: {direccion}</div>
            <div className="descripcion">Descripción: {descripcion}</div>
            <div className="fecha-inicio">Fecha fin: {fecha_fin ? mostrarFecha(fecha_fin) : ''}</div>
            <div className="valor">Valor: ${valor}</div>
            <div className="fecha-inicio">Fecha Contrato: {mostrarFecha(fecha_inicio)}</div>
            <div className="estado">Estado: {transformarEstadoTrabajo(estado)}</div>

            {mostrarBotonConfirmar && (
                <button onClick={() => confirmarTrabajo(id)}>Confirmar</button>
            )}

            {mostrarBotonCancelar && (
                <button onClick={handleCancelar}>Cancelar</button>
            )}

        </div>
    );
}

export default TarjetaInfoTrabajoPendiente;
