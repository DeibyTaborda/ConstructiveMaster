import React, { useState } from "react";
import TrabajoPendiente from "./TarjetaTrabajoPendientes";
import TarjetaInfoTrabajoPendiente from "./TarjetaInfoTrabajoPendiente";

function TrabajosPendientes({ trabajos, titulo, solicitudPut, confirmarTrabajo}) {
    const [selectedTrabajoId, setSelectedTrabajoId] = useState(null);

    const handleCardClick = (id) => {
        setSelectedTrabajoId(prevId => prevId === id ? null : id); 
    };

    return (
        <div className="trabajos-pendientes-container">
            <h2 style={{color: 'var(--color-principal)', fontFamily: 'var(--titulos)', margin: '0 0 10px 0'}}>{titulo}</h2>
            {trabajos && trabajos.map(trabajo => (
                <div key={trabajo.id} className="trabajo-item">
                    <div className="trabajo-pendiente" onClick={() => handleCardClick(trabajo.id)}>
                        <TrabajoPendiente
                            id={trabajo.id}
                            cliente={trabajo.nombre_cliente}
                            fecha={trabajo.fecha}
                            hora={trabajo.hora}
                            estado={trabajo.estado}
                        />
                    </div>

                    {selectedTrabajoId === trabajo.id && (
                        <div className="tarjeta-info-trabajo">
                            <TarjetaInfoTrabajoPendiente
                                id={trabajo.id}
                                cliente={trabajo.nombre_cliente}
                                fecha={trabajo.fecha}
                                hora={trabajo.hora}
                                direccion={trabajo.direccion}
                                descripcion={trabajo.descripcion}
                                valor={trabajo.valor}
                                fecha_inicio={trabajo.fecha_inicio}
                                fecha_fin={trabajo?.fecha_fin}
                                estado={trabajo.estado}
                                solicitudPut={solicitudPut}
                                confirmarTrabajo={confirmarTrabajo}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TrabajosPendientes;
