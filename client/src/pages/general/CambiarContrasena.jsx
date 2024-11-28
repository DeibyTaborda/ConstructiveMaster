import React from "react";
import FormCambiarContasena from "../../components/general/FormCambiarContrasena";
import '../../assets/styles/cambiarContrasena.css';
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


function CambiarContrasena() {
    const navigate = useNavigate();

    const redigirAlPanelDeControl = () => {
        const rol = localStorage.getItem('usuario');
        const rolParseado = JSON.parse(rol);

        if (rolParseado.rol === 'cliente') {
            return navigate('/panel-de-usuario');
        } else if (rolParseado.rol === 'profesional') {
            return navigate('/panel-de-control-profesional');
        } else {
            return navigate('/panel_de_control');
        }
    }

    const obtenerRol = () => {
        const rol = localStorage.getItem('usuario');
        const rolParseado = JSON.parse(rol);
        return rolParseado;
    }

    const rol = obtenerRol()?.rol;

    return(
        <main className="main-cambiar-contrasena">
            {rol === 'super_admin' || rol === 'admin' || rol === 'cliente' && (
                <div>
                    <IoHomeOutline className="icono-home" onClick={redigirAlPanelDeControl}/>
                </div>
            )}
            <h2>Cambiar contraseña</h2>
            <FormCambiarContasena/>
        </main>
    );
}

export default CambiarContrasena;