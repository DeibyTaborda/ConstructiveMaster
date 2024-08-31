import React, {useEffect, useState, useContext, act} from "react";
import '../../assets/styles/formEditImgTabla.css';
import usePostRequest from "../../services/usePostRequest";
import { TablasBdContext } from "../../context/TablasBdContext";
import useAxios from "../../services/api";


function FormAddImgTabla() {
    const [datos, setDatos] = useState({
        tabla: '',
        ruta: '',
        imagen: '' 
    });

    const {tablasBD, actualizarTablasBD} = useContext(TablasBdContext);
    const {loading, error, response, postRequest} = usePostRequest('http://localhost:3001/panel_de_control');
    const { data, fetchData } = useAxios("http://localhost:3001/panel_de_control");

    const handleOnchange = (e) => {
        const {name, value} = e.target;
        setDatos({...datos, [name] : value});
    }

    const handleFileonChange = (e) => {
        const {name, files} = e.target;
        setDatos({...datos, [name] : files[0]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tabla', datos.tabla);
        formData.append('ruta', datos.ruta);
        formData.append('imagen', datos.imagen);

        await postRequest(formData);
        await fetchData();
    }

    useEffect(() => {
        if (data) {
            actualizarTablasBD(data.data);
        }
    }, [data]);

    return(
        <>
            <form onSubmit={handleSubmit} className="form-edit-img-tabla">
                <label htmlFor="nombre_tabla" className="label-form-add-imagen-tabla">Tabla:</label>
                <input 
                    type="text" 
                    name="tabla"
                    className="input-form-edit-img-tabla"
                    onChange={handleOnchange}
                    value={datos.tabla}
                />
                <label htmlFor="ruta" className="label-form-add-imagen-tabla">Ruta:</label>
                <input 
                    type="text" 
                    name="ruta"
                    className="input-form-edit-img-tabla"
                    onChange={handleOnchange}
                    value={datos.ruta}
                />
                <label htmlFor="imagen" className="label-form-add-imagen-tabla">Imagen:</label>
                <input 
                    type="file" 
                    name="imagen"
                    onChange={handleFileonChange}
                />
                <input type="submit" />
                {response && (
                    <p>{response.message}</p>
                )}
                {error && (
                    <p>{error}</p>
                )}
            </form>
        </>
    );
}

export default FormAddImgTabla;
