import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../assets/styles/menu.css';
import { IoMdMenu } from "react-icons/io";
import { FaHome, FaHammer, FaUser  } from "react-icons/fa";
import { HiUserGroup, HiMiniKey } from "react-icons/hi2";
import { GrUserWorker } from "react-icons/gr";
import { TbCategoryFilled } from "react-icons/tb";
import { PiHandshakeFill } from "react-icons/pi";
import GestionDePerfilAdministracion from "../super-administrador/GestionDePerfilAdministracion";
import Perfil from "./Perfil";
import { UsuarioContexto } from "../../context/UsuarioContexto";

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);
    const [existeToken, setExisteToken] = useState(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const cerrarSesion = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.clear();
        }
    }

    const verificarToken = () => {
        return localStorage.getItem('token') !== null;
    }

    useEffect(() => {
        const token = verificarToken();
        if (!token) {
            setExisteToken(true);
        }
    }, []);

    const rol = () => {
        try {
            const usuario = localStorage.getItem('usuario');
            const usuarioParseado = JSON.parse(usuario);
            return usuarioParseado.rol;
        } catch (error) {
            return;
        }
    }

    const rolUsuario = rol() || null;
    

    return (
        <header className="header-general">
            <div className="logo-container">
                <img src="/logo.png" alt="Logo" className="logo"/>
            </div>
            <nav className={`navegation-menu ${isOpen ? 'open' : ''}`}>
                {existeToken && (
                    <>
                        <li className="menu-item"><Link to={'/'} className="link-menu"><FaHome className="icon-menu"/>Inicio</Link></li>
                        {/* <li className="menu-item"><Link className="link-menu"><HiUserGroup className="icon-menu"/>Acerca de nosotros</Link></li> */}
                    </>
                )}
                {!existeToken && (
                    <li className="menu-item"><Link to={rolUsuario === 'cliente' ? '/panel-de-usuario' : '/panel-de-control-profesional'} className="link-menu"><GrUserWorker className="icon-menu"/>Panel de control</Link></li>
                )}
                <li className="menu-item"><Link to='/profesionales/lista' className="link-menu"><GrUserWorker className="icon-menu"/>Profesionales</Link></li>
                <li className="menu-item"><Link to='/categorias-ejecucion-administracion' className="link-menu"><TbCategoryFilled className="icon-menu"/>Categorías</Link></li>
                <li className="menu-item"><Link to="/solicitud/trabajo" className="link-menu"><FaHammer className="icon-menu"/>Trabajos</Link></li>
                <li className="menu-item"><Link to='/unete' className="link-menu"><PiHandshakeFill className="icon-menu"/>Únete</Link></li>
                {existeToken && (
                    <li className="menu-item"><Link to='/login' className="link-menu"><HiMiniKey className="icon-menu"/>Iniciar sesión</Link></li>
                )}
                {existeToken && (
                     <li className="menu-item"><Link to='/registro' className="link-menu"><FaUser className="icon-menu"/>Registrate</Link></li> 
                )}
                
                {!existeToken && (
                    <Perfil/>
                )}
            </nav>
            <div className="logo-menu" onClick={toggleMenu}>
                <IoMdMenu size={25}/>
            </div>
        </header>
    );
}

export default Menu;
