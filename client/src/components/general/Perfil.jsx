import React, { useState, useContext } from "react";
import '../../assets/styles/perfil.css';
import GestionDePerfilAdministracion from "../super-administrador/GestionDePerfilAdministracion";
import { UsuarioContexto } from "../../context/UsuarioContexto";

function Perfil() {
    const [isOpen, setIsOpen] = useState(false);
    const { usuario } = useContext(UsuarioContexto);

    // Verifica si 'usuario' es null o undefined
    const imagen = usuario && usuario.imagen ? usuario.imagen : 'uploads/imagenes/usernone.jpg';

    // Abre o cierra la gestión de perfil
    const abrirCerrar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="container-foto-perfil-admin-super-admin">
            <img 
                src={`http://localhost:3001/${'uploads/imagenes/usernone.jpg'}`} 
                alt="Foto de perfil" 
                className="foto-perfil-admin-superadmin" 
                onClick={abrirCerrar}
            />
            {isOpen && (
                <div className={`gestion-perfil-popup ${!isOpen ? 'cerrado' : ''}`}>
                    <div className="gestion-perfil-header">
                        <h2>Gestión de Perfil</h2>
                        <button className="boton-cerrar-popup" onClick={abrirCerrar}>✖</button>
                    </div>
                    <div className="gestion-perfil-body">
                        <GestionDePerfilAdministracion />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Perfil;
