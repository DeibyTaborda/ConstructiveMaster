import React, { useContext, useEffect, useState } from "react";
import '../../assets/styles/perfilFotoAccionesAdmin.css';
import usePostRequest from '../../services/usePostRequest';
import { useParams } from "react-router-dom";
import { UsuarioContexto } from "../../context/UsuarioContexto";
import useDelete from '../../services/delete';

function PerfilFotoAccionesAdmin() {
    const [imagen, setImagen] = useState(null);
    const { usuario, actualizarUsuario } = useContext(UsuarioContexto);
    const { loading, error, response, postRequest } = usePostRequest(`http://localhost:3001/admin/imagen`);
    const {response: responseDelete, eliminar} = useDelete(`http://localhost:3001/admin/imagen/${usuario.id}`);


    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            setImagen(files[0]);
        }
    };

    useEffect(() => {
        const actualizarImagen = async () => {
            if (imagen) {
                const formData = new FormData();
                formData.append('imagen', imagen);

                console.log('Enviando imagen...');
                await postRequest(formData); // Envía la imagen
            }
        };

        actualizarImagen();
    }, [imagen]);

    useEffect(() => {
        if (response && response?.imagenActualizada) {
            // Actualiza el estado y el contexto con la nueva imagen cuando se actualiza `response`
            actualizarUsuario({ ...usuario, imagen: response?.imagenActualizada });
            console.log('Imagen actualizada en el contexto:', response?.imagenActualizada);
        }
    }, [response]); // Este efecto se ejecuta cuando `response` cambia

    const eliminarImagen = async() => {
        await eliminar();
     }

    useEffect(() => {
        if (responseDelete) {
            console.log(responseDelete);
            actualizarUsuario({...usuario, imagen: responseDelete.resultado.imagen});
        }
    }, [responseDelete]);


    return (
        <div className="container-botones-acciones-foto-perfil-admin">
            <form>
                <input  
                    type="file" 
                    name="imagen" 
                    className="botones-acciones-foto-perfil-admin" 
                    id="button-cargar-imagen-super-admin"
                    onChange={handleFileChange}
                />
                <button 
                    type="button" 
                    className="botones-acciones-foto-perfil-admin" 
                    onClick={() => document.getElementById('button-cargar-imagen-super-admin').click()}
                >
                    {usuario.imagen ? 'Editar imagen' : 'Subir una imagen'}
                </button>
                <button 
                    type="button" 
                    className="botones-acciones-foto-perfil-admin"
                    onClick={eliminarImagen}
                >
                    Eliminar la imagen
                </button>
                {/* {response && (
                    <p>{response.message}</p>
                )} */}
            </form>
        </div>
    );
}

export default PerfilFotoAccionesAdmin;
