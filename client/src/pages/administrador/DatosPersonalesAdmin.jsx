import React, { useEffect, useContext, useState } from "react";
import '../../assets/styles/datosPersonalesAdmin.css';
import useAxios from "../../services/api";
import ActualizarImgPerfil from "../../components/super-administrador/ActualizarImgPerfil";
import { UsuarioContexto } from "../../context/UsuarioContexto";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import axios from "axios";


function DatosPersonalesAdmin() {
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);
    const [rol, setRol] = useState(usuario?.rol);
    const {loading, data, fetchData, response} = useAxios(`http://localhost:3001/datos/personales`, {rol});
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [apellido, setApellido] = useState(usuario?.apellido || '');
    const [correo, setCorreo] = useState(usuario?.correo || '');
    const [telefono, setTelefono] = useState(usuario?.telefono || '');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const propiedadesUsuario = Object.keys(usuario);
    const navigate = useNavigate();

    // Función para enviar la actualización de un solo campo
        const handleUpdate = async (campo, valor) => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:3001/datos/personales/${usuario.id}`, { [campo]: valor }, {
            headers: {Authorization: `Bearer ${token}`}
        });
        setMensaje(response.data.mensaje);
        setError('');
        fetchData();
        } catch (error) {
        setError('Error al actualizar el campo.');
        setMensaje('');
    }
  };

    useEffect(() => {
        if(response) {
            actualizarUsuario({...usuario, ...response.data[0]});
        }
    }, [response]);

    // Funciones manejadoras de cada campo
    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleApellidoChange = (e) => setApellido(e.target.value);
    const handleCorreoChange = (e) => setCorreo(e.target.value);
    const handleTelefonoChange = (e) => setTelefono(e.target.value);

    // Función para confirmar la actualización de un campo específico
    const handleConfirmUpdate = (campo, valor) => {
        if (valor.trim() === '') return; // Evitar envíos vacíos
        handleUpdate(campo, valor);
    }

    const redigirAlPanelDeControl = () => {
        if (rol === 'cliente') {
            return navigate('/panel-de-usuario');
        } else if (rol === 'profesional') {
            return navigate('/panel-de-control-profesional');
        } else {
            return navigate('/panel_de_control');
        }
    }

    return(
        <>
            {usuario && (
                <div className="container-editar-datos-basicos-admin">
                    {rol === 'admin' || rol === 'super_admin' && (
                        <div className="contenedor-icono-home">
                            <IoHomeOutline onClick={redigirAlPanelDeControl}/>
                        </div>
                    )}
                    <div className="subcontainer-editar-datos-basicos-admin">
                        <h2 className="titulo-perfil-super-admin">Perfil</h2>
                        <p className="parrafo">Administra tu información personal</p>
                        <h3 className="subtitulos-perfil-super-admin">Foto de perfil </h3>
                        <ActualizarImgPerfil/>
                        <h3 className="subtitulos-perfil-super-admin">Datos básicos</h3>
                        <form className="form-edit-datos-basicos-admin">
                            {propiedadesUsuario.includes('nombre') && (
                                <div className="input-group">
                                    <label htmlFor="nombre" className="label-edit-datos-basicos-admin">Nombre</label>
                                    <input 
                                        type="text" 
                                        name="nombre"  
                                        className="input-edit-datos-basicos-admin" 
                                        value={nombre}
                                        onChange={handleNombreChange}
                                        onBlur={() => handleConfirmUpdate('nombre', nombre)}
                                    />
                                </div>
                            )}
                            {propiedadesUsuario.includes('apellido') && (
                                <div className="input-group">
                                    <label htmlFor="apellido" className="label-edit-datos-basicos-admin">Apellido</label>
                                    <input 
                                        type="text" 
                                        name="apellido" 
                                        className="input-edit-datos-basicos-admin"
                                        value={apellido}
                                        onChange={handleApellidoChange}
                                        onBlur={() => handleConfirmUpdate('apellido', apellido)}
                                    />
                                </div>
                            )}
                            {propiedadesUsuario.includes('correo') && (
                                <div className="input-group">
                                    <label htmlFor="correo" className="label-edit-datos-basicos-admin">Correo</label>
                                    <input 
                                        type="text" 
                                        name="correo" 
                                        className="input-edit-datos-basicos-admin" 
                                        value={correo}
                                        onChange={handleCorreoChange}
                                        onBlur={() => handleConfirmUpdate('correo', correo)}
                                    />
                                </div>
                            )}
                            {propiedadesUsuario.includes('telefono') && (
                                <div className="input-group">
                                    <label htmlFor="telefono" className="label-edit-datos-basicos-admin">Teléfono</label>
                                    <input 
                                        type="text" 
                                        name="telefono"
                                        className="input-edit-datos-basicos-admin" 
                                        value={telefono}
                                        onChange={handleTelefonoChange}
                                        onBlur={() => handleConfirmUpdate('telefono', telefono)}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DatosPersonalesAdmin;
