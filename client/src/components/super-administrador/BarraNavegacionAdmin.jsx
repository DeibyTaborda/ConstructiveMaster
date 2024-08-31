import React, { useRef, useState, useEffect } from "react";
import '../../assets/styles/barraNavegacionAdmin.css';
import { FaBuilding } from "react-icons/fa";
import Perfil from "../general/Perfil";
import AccionesCrear from "./AccionesCrear";
import useClicAfuera from "../../hooks/useClicAfuera";

function BarraNavegacionAdmin() {
    const [isOpen, setIsOpen] = useState(false);
    const referenciaComponente = useRef(null);

    // Maneja el clic en el botón para abrir/cerrar el menú
    const manejarClicBoton = () => {
        setIsOpen(!isOpen);
    };

     // Usa el hook personalizado para cerrar el menú si se hace clic fuera de él
    useClicAfuera(referenciaComponente, () => setIsOpen(false));

    return (
        <ul className="lista-barra-navegacion-admin">
            <li className="item-barra-navegacion-admin"><FaBuilding className="icon-home-admin"/></li>
            <li className="item-barra-navegacion-admin"></li>
            <li className="item-barra-navegacion-admin">
                <button className="boton-admin-acciones" onClick={manejarClicBoton}>Crear</button>
                {isOpen && (
                    <div role="menu" aria-expanded={isOpen} ref={referenciaComponente}>
                        <AccionesCrear/>
                    </div>
                )}
            </li>
            <li className="item-barra-navegacion-admin"><input type="text" value="Buscar..." className="input-barra-de-busqueda"/></li>
            <li className="item-barra-navegacion-admin"><Perfil/></li>
        </ul>
    );
}

export default BarraNavegacionAdmin;