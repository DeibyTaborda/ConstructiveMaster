import React, { useEffect, useState } from "react";
import '../../assets/styles/barraDeNavegacion.css';
import { FiSearch } from "react-icons/fi";

function BarraDeBusqueda ({name,placeholder, solicitudGET}) {
    const [busqueda, setBusqueda] = useState('todos');

    // Controlador de campo del input
    const handleOnchange = (e) => {
        const {value} = e.target;
        setBusqueda(value);
    }

    useEffect(() => {
        solicitudGET(busqueda);
    }, [busqueda]) 

    return(
        <>
            <form className="form-barra-de-navegacion">
                <input 
                    type="search" name={name} 
                    placeholder={placeholder} aria-label="Buscar" 
                    onChange={handleOnchange}
                    className="barra-de-busqueda"
                />
                <button className="boton-buscar"><FiSearch/></button>
            </form>
        </>
    );
}
export default BarraDeBusqueda;