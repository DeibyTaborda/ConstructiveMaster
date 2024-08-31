import React, {useState, useContext} from "react";
import '../../assets/styles/perfil.css';
import GestionDePerfilAdministracion from "../super-administrador/GestionDePerfilAdministracion";
import { UsuarioContexto } from "../../context/UsuarioContexto";


function Perfil() {
    const [isOpen, setIsOpen] = useState(false);
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);

      // Verifica si 'usuario' es null o undefined
      const imagen = usuario && usuario.imagen ? usuario.imagen : 'uploads/imagenes/usernone.jpg';
      



    const abrirCerrar = () => {
        if (isOpen) setIsOpen(false);
        if (!isOpen) setIsOpen(true);
    }

    return(
        <div className="container-foto-perfil-admin-super-admin">
            <img src={`http://localhost:3001/${imagen}`} alt="Foto de perfil" className="foto-perfil-admin-superadmin" onClick={abrirCerrar}/>
            {isOpen && (
                <GestionDePerfilAdministracion/>
            )}
        </div>
    );
}

export default Perfil;