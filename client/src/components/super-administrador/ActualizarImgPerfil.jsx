import React, { useEffect, useState, useContext, useRef } from "react";
import '../../assets/styles/actualizarImgPerfil.css';
import ImagenPerfil from "../general/ImagenPerfil";
import { CiImageOn } from "react-icons/ci";
import PerfilFotoAccionesAdmin from "./PerfilFotoAccionesAdmin";
import { UsuarioContexto } from "../../context/UsuarioContexto";

function ActualizarImgPerfil(){
    const [isOpen, setIsOpen] = useState(false);
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);

    useEffect(() => {
        if (usuario) setIsOpen(false);
    }, [usuario])

    return(
        <>
        <div className={`container-img-grande-datos-basicos ${!usuario.imagen ? 'none' : '' }`} onClick={() => setIsOpen(true)}>
            {usuario.imagen && (
                <img className="imagen-perfil-admin-super" src={`http://localhost:3001/${usuario.imagen}`} alt="mineros"/>
            )}
            <ImagenPerfil estilos={{ 
                width: "100px",
                height: "100px",
                position: "absolute",
                top: "30px",
                left: "30px",
                boxShadow: "0 4px 8px rgb(148, 148, 148, 0.8)",
                zIndex: "15"
            }}
            />
            <div className="container-cargar-img-perfil">
                <CiImageOn className="icon-subir-imagen"/>
                <p className="parrafo-info-subir-img-perfil">
                    Subir imagen
                </p>
                {isOpen && (
                    <PerfilFotoAccionesAdmin/>
                )}
            </div>
        </div>
        </>
    );
}

export default ActualizarImgPerfil;