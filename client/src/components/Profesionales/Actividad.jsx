import React from "react";
import CartaActividad from "../general/CartaActividad";

function Actividad ({actividades}) {
    return(
        <div>
            <h2 style={{color: 'var(--color-principal)', fontFamily: 'var(--titulos)', margin: '0 0 10px 0'}}>Actividad</h2>
            {actividades ? actividades.map(actividad => (
                <CartaActividad
                    accion={actividad.accion}
                    descripcion={actividad.detalles}
                    fecha={actividad.created_at}
                />
            )) : (
                <p>No hay actividades</p>
            )}
        </div>
    );
}

export default Actividad;