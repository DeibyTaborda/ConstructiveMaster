import React, { useContext, useEffect, useState } from "react";
import '../../assets/styles/perfilFotoAccionesAdmin.css';
import usePostRequest from '../../services/usePostRequest';
import { useParams } from "react-router-dom";
import { UsuarioContexto } from "../../context/UsuarioContexto";
import useDelete from '../../services/delete';
import useAxios from "../../services/api";

function PerfilFotoAccionesAdmin() {
    const [imagen, setImagen] = useState(null);
    const { usuario, actualizarUsuario } = useContext(UsuarioContexto);
    const { loading, error, response, postRequest } = usePostRequest(`http://localhost:3001/admin/imagen`);
    const {response: responseDelete, eliminar} = useDelete(`http://localhost:3001/admin/imagen/${usuario.id}`);
    const {loading: loadingImagen, response: responseImagen, error: errorImagen, data, fetchData} = useAxios('http://localhost:3001/img/usuario');



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
                await postRequest(formData); 
                await fetchData();
    
                if (data && data.length > 0) {
                    actualizarUsuario({ ...usuario, imagen: data[0].imagen });
                }
            }
        };
    
        actualizarImagen();
    }, [imagen, data]);  
    
    useEffect(() => {
        if (response && response?.imagenActualizada) {
            actualizarUsuario({ ...usuario, imagen: response?.imagenActualizada });
        }
    }, [response]);

    const eliminarImagen = async() => {
        await eliminar();
     }

    useEffect(() => {
        if (responseDelete) {
            console.log(responseDelete); 
            actualizarUsuario({...usuario, imagen: responseDelete.resultado?.imagen});
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
                    {usuario?.imagen ? 'Editar imagen' : 'Subir una imagen'}
                </button>
                <button 
                    type="button" 
                    className="botones-acciones-foto-perfil-admin"
                    onClick={eliminarImagen}
                >
                    Eliminar la imagen
                </button>
            </form>
        </div>
    );
}

export default PerfilFotoAccionesAdmin;
