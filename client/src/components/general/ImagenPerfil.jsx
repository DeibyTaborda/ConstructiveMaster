import React, {useContext} from "react";
import '../../assets/styles/imagenPerfil.css';
import { UsuarioContexto } from "../../context/UsuarioContexto";
import { FaUserAlt } from "react-icons/fa";

function ImagenPerfil({estilos}) {
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto); 
    const imagen = usuario && usuario.imagen ? usuario.imagen : 'uploads/imagenes/usernone.jpg';

    return(
        <>
            <div className="contenedor-imagen-perfil-admin-super" style={estilos}>
                <img src={`http://localhost:3001/${imagen}`} alt="imagen de perfil" className="img-perfil-admin-super" />
            </div>
        </>
    );
}

export default ImagenPerfil;