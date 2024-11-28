import React, { useState, useRef } from "react";
import '../../assets/styles/accionesCrear.css';
import FormAddImgTabla from "./FormAddImgTabla";
import FormAgregarAdmin from "./FormAgregarAdmin";
import useClicAfuera from "../../hooks/useClicAfuera";

function AccionesCrear() {
    const [isOpen, setIsOpen] = useState(false); 
    const [isOpenFormAdmin, setIsOpenFormAdmin] = useState(false);
    const menuRef = useRef(null);

    const cerrarMenu = () => {
        setIsOpenFormAdmin(false);
      };
    
      useClicAfuera(menuRef, cerrarMenu);

    return(
        <>
        <div className="contenedor-botones-acciones-crear">
            <div className="contenedor-boton-individual-acciones-crear">
                <button className="botones-acciones-crear" onClick={() => setIsOpenFormAdmin(true)}>Administrador</button>
                {isOpenFormAdmin && (
                    <div ref={menuRef}>
                        <FormAgregarAdmin/>
                    </div>
                )}
            </div>
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