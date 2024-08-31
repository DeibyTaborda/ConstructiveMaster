import React, {useEffect, useState} from "react";
import '../../assets/styles/formEditImgTabla.css';
import usePostRequest from "../../services/usePostRequest";


function FormAddImgTabla({fetchData}) {
    const [data, setData] = useState({
        tabla: '',
        ruta: '',
        imagen: ''
    });

    const {loading, error, response, postRequest} = usePostRequest('http://localhost:3001/panel_de_control');

    const handleOnchange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name] : value});
    }

    const handleFileonChange = (e) => {
        const {name, files} = e.target;
        setData({...data, [name] : files[0]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tabla', data.tabla);
        formData.append('ruta', data.ruta);
        formData.append('imagen', data.imagen);

        await postRequest(formData);
        fetchData();
        console.log(response);
    }

    useEffect(() => {
        if (response) {
            fetchData();
        }
    }, [response]);

    return(
        <>
            <form onSubmit={handleSubmit} className="form-edit-img-tabla">
                <label htmlFor="nombre_tabla" className="label-form-add-imagen-tabla">Tabla:</label>
                <input 
                    type="text" 
                    name="tabla"
                    className="input-form-edit-img-tabla"
                    onChange={handleOnchange}

                />
                <label htmlFor="ruta" className="label-form-add-imagen-tabla">Ruta:</label>
                <input 
                    type="text" 
                    name="ruta"
                    className="input-form-edit-img-tabla"
                    onChange={handleOnchange}
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
