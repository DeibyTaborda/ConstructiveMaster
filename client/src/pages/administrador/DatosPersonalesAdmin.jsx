import React, { useEffect, useContext, useState } from "react";
import '../../assets/styles/datosPersonalesAdmin.css';
import useAxios from "../../services/api";
import ActualizarImgPerfil from "../../components/super-administrador/ActualizarImgPerfil";
import { UsuarioContexto } from "../../context/UsuarioContexto";
import PaginaDeError from '../../components/general/PaginaDeError';
import axios from "axios";


function DatosPersonalesAdmin() {
    const {loading, data, fetchData, response} = useAxios(`http://localhost:3001/datos/personales`);
    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);

    // Estado para cada campo
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [apellido, setApellido] = useState(usuario?.apellido || '');
    const [correo, setCorreo] = useState(usuario?.correo || '');
    const [telefono, setTelefono] = useState(usuario?.telefono || '');

    // Estado para mensajes y manejo de errores
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

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
            console.log(response.data[0]);
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

    return(
        <>
            {usuario && (
                <div className="container-editar-datos-basicos-admin">
                    <div className="subcontainer-editar-datos-basicos-admin">
                        <h2 className="titulo-perfil-super-admin">Perfil</h2>
                        <p className="parrafo">Administra tu información personal</p>
                        <h3 className="subtitulos-perfil-super-admin">Foto de perfil </h3>
                        <ActualizarImgPerfil/>
                        <h3 className="subtitulos-perfil-super-admin">Datos básicos</h3>
                        <form action="" className="form-edit-datos-basicos-admin">
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
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DatosPersonalesAdmin;
