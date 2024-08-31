import React, {useEffect, useState} from "react";
import '../../assets/styles/formEditTabla.css';
import { usePutRequest } from "../../services/usePutRequest.js";
import { CiImageOn } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";
import {primeraLetraMayuscula} from '../../utils/utils.js';

function FormEditTabla({datos, onClick, id}) {
    const [nombreImagen, setNombreImagen] = useState(null);

    const tablaEncontrada = datos.find(tabla => tabla.id === id);
    const [data, setData] = useState({
        tabla: tablaEncontrada?.nombre_tabla,
        ruta: tablaEncontrada?.url_tabla,
        imagen: ''
    });

    const {loading, error, response, sendPutRequest} = usePutRequest();

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'tabla') {
            const nombreTabla = primeraLetraMayuscula(value);
            return setData({...data, [name] : nombreTabla});
        }

        setData({...data, [name] : value});
    }

    const handleFileonChange = (e) => {
        const {name, files} = e.target;
        setNombreImagen(files[0].name)
        setData({...data, [name] : files[0]});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tabla', data.tabla);
        formData.append('ruta', data.ruta);
        formData.append('imagen', data.imagen);

        await sendPutRequest(`http://localhost:3001/panel_de_control/${id}`, formData);
    }

    useEffect(() => {
        if (response || error) {
            onClick();
        }
    }, [response, error, sendPutRequest]);

    return (
        <>
            <form className="form-edit-tabla" onSubmit={handleSubmit}>
                <label htmlFor="tabla" className="label-edit-tabla">Tabla:</label>
                <input 
                    type="text" 
                    name="tabla"
                    value={data.tabla}
                    onChange={handleChange}
                    className="input-form-edit-tabla"
                />
                <label htmlFor="ruta" className="label-edit-tabla">Ruta:</label>
                <input 
                    type="text" 
                    name="ruta"
                    value={data.ruta}
                    onChange={handleChange}
                     className="input-form-edit-tabla"
                />
                <label htmlFor="imagen" className="label-edit-tabla">Imagen:</label>
                <input 
                    type="file" 
                    name="imagen"
                    onChange={handleFileonChange}
                    className="input-form-edit-tabla"
                    style={{display: 'none'}}
                    id="tabla-mela"
                />
                <div className="container-icon-file-name">
                    <CiImageOn size={20} color='black' className="icon-file-upload" onClick={() => document.getElementById('tabla-mela').click()}/>
                    {data.imagen ? <IoIosCheckmarkCircle color="green" className="checklist"/> : <IoIosCheckmarkCircleOutline color="black" className="checklist"/>}
                </div>
                <div className="container-botones-form-edit-tabla">
                    <input type="submit" className="input-submit-form-edit-tabla" />
                    <button className="button-cancelar-edit-tabla" onClick={onClick}>Cancelar</button>
                </div>
            </form>
        </>
    );
}

export default FormEditTabla;