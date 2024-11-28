import React from "react";
import '../../assets/styles/gestionDePerfilAdministracion.css';
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import ImagenPerfil from "../general/ImagenPerfil";
import { useNavigate } from "react-router-dom";

function GestionDePerfilAdministracion() {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.clear();
        navigate('/');
    }

    const obtenerDatosUsuario = () => {
        const usuario = localStorage.getItem('usuario');
        return JSON.parse(usuario);
    }

    const dirigirAEditarDatos = () => {
        try {
            const rol = localStorage.getItem('usuario');
            const rolParseado = JSON.parse(rol);
            if (rolParseado.rol === 'super_admin' || rolParseado.rol === 'admin') {
                return '/datos/personales';
            } else if (rolParseado.rol === 'cliente') {
                return '/panel-de-usuario';
            } else if (rolParseado.rol === 'profesional') {
                return '/panel-de-control-profesional';
            } 
        } catch (error) {
            return;
        }
    }

    const ruta = dirigirAEditarDatos();
    const usuario = obtenerDatosUsuario();

    return (
        <div className="contenedor-gestion-perfil-administracion">
            <div className="contenedor-img-nombre-rol-admin-super">
                <ImagenPerfil estilos={{ width: "60px", height: "60px" }} />
            </div>
            <p className="nombre-usuario">{`${usuario?.nombre} ${usuario?.apellido || ''}`}</p>
            <p className="correo-usuario">{usuario?.correo}</p>
            <ul className="lista-gestion-perfil-administracion">
            <li className="item-gestion-perfil-admin-super">
                    <Link to={ruta} className="link-gestion-perfil-admin-super">
                        Datos básicos
                    </Link>
                </li>
                <li className="item-gestion-perfil-admin-super">
                    <Link to='/cambiar-contrasena' className="link-gestion-perfil-admin-super">
                        Cambiar Contraseña
                    </Link>
                </li>
                <li className="item-gestion-perfil-admin-super item-logout">
                    <IoLogOut size={25} onClick={cerrarSesion} />
                </li>
            </ul>
        </div>
    );
}

export default GestionDePerfilAdministracion;
