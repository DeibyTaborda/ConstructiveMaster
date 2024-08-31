import React, { useRef, useState } from "react";
import '../../assets/styles/gestionDePerfilAdministracion.css';
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import ImagenPerfil from "../general/ImagenPerfil";

function GestionDePerfilAdministracion() {

    const cerrarSesion = () => {
        localStorage.removeItem('token');
    }

    return(
        <>
            <div className="contenedor-gestion-perfil-administracion">
                <div className="contenedor-img-nombre-rol-admin-super">
                    <ImagenPerfil estilos={{width: "60px", height: "60px"}}/>
                </div>
                <ul className="lista-gestion-perfil-administracion">           
                    <li className="item-gestion-perfil-admin-super"><Link to='/datos/personales' className="link-gestion-perfil-admin-super">Datos personales</Link></li>
                    <li className="item-gestion-perfil-admin-super"><Link className="link-gestion-perfil-admin-super">Actividad</Link></li>
                    <li className="item-gestion-perfil-admin-super"><Link className="link-gestion-perfil-admin-super">Privacidad</Link></li>
                    <li className="item-gestion-perfil-admin-super"><Link className="link-gestion-perfil-admin-super">Seguridad</Link></li>
                    <li className="item-gestion-perfil-admin-super item-logout"><IoLogOut size={25} onClick={cerrarSesion}/></li>
                </ul>
            </div>
        </>
    );
}

export default GestionDePerfilAdministracion;