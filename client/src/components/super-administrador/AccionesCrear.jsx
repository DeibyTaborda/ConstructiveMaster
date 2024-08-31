import React, { useState } from "react";
import '../../assets/styles/accionesCrear.css';
import FormAddImgTabla from "./FormAddImgTabla";
import FormAgregarAdmin from "./FormAgregarAdmin";

function AccionesCrear() {
    const [isOpen, setIsOpen] = useState(false); 
    const [isOpenFormAdmin, setIsOpenFormAdmin] = useState(false);

    return(
        <>
        <div className="contenedor-botones-acciones-crear">
            <button className="botones-acciones-crear">Trabajo</button>
            <div className="contenedor-boton-individual-acciones-crear">
                <button className="botones-acciones-crear" onClick={() => setIsOpenFormAdmin(true)}>Administrador</button>
                {isOpenFormAdmin && (
                    <FormAgregarAdmin/>
                )}
            </div>
            <button className="botones-acciones-crear">Profesional</button>
            <div className="contenedor-boton-individual-acciones-crear">
                <button className="botones-acciones-crear" onClick={() => setIsOpen(true)}>Tabla</button>
                {isOpen && (
                    <FormAddImgTabla/>
                )}
            </div>
        </div>
        </>
    );
}

export default AccionesCrear;